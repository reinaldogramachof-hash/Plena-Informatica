/* Cada PDF possui chave própria dentro do cofre. IndexedDB guarda apenas bytes cifrados.
   IDs são imutáveis; preparar arquivos antes do commit permite restauração sem referências parciais.
   Arquivos de versões/cópias anteriores não são removidos automaticamente. */
const TherapyDocumentFiles=(()=>{
 const encoder=new TextEncoder(),MAX_BACKUP=100000000;
 const encode=buffer=>{let s='';for(const b of new Uint8Array(buffer))s+=String.fromCharCode(b);return btoa(s);};
 const decode=s=>Uint8Array.from(atob(s),c=>c.charCodeAt(0));
 const hash=async buffer=>Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256',buffer)),b=>b.toString(16).padStart(2,'0')).join('');
 let connection;
 function open(){return connection||(connection=new Promise((resolve,reject)=>{const req=indexedDB.open('gestao-terapia-document-files',1);req.onupgradeneeded=()=>{req.result.createObjectStore('files',{keyPath:'id'});req.result.createObjectStore('checkpoints',{keyPath:'id'});};req.onsuccess=()=>{req.result.onversionchange=()=>{req.result.close();connection=null;};resolve(req.result);};req.onerror=()=>{connection=null;reject(Error('Não foi possível abrir os anexos locais. A base foi preservada.'));};}));}
 async function request(store,mode,action){const database=await open();return new Promise((resolve,reject)=>{const tx=database.transaction(store,mode);let result;const req=action(tx.objectStore(store));req.onsuccess=()=>result=req.result;tx.oncomplete=()=>resolve(result);tx.onabort=tx.onerror=()=>reject(Error('Não foi possível acessar os anexos. Verifique o espaço do navegador; a base foi preservada.'));});}
 const get=id=>request('files','readonly',store=>store.get(id));
 const refs=data=>(data.documents||[]).flatMap(row=>row.files);
 function unique(data){const files=refs(data),ids=new Set();for(const file of files){if(ids.has(file.id))throw Error('Arquivo vinculado mais de uma vez.');ids.add(file.id);}return files;}
 async function plain(meta,record){if(!record||record.id!==meta.id||!(record.bytes instanceof Uint8Array)||record.bytes.length!==meta.size+16)throw Error('Anexo ausente ou incompleto: '+meta.name+'. Restaure um backup completo.');let bytes;try{const key=await crypto.subtle.importKey('raw',decode(meta.key),'AES-GCM',false,['decrypt']);bytes=new Uint8Array(await crypto.subtle.decrypt({name:'AES-GCM',iv:decode(meta.iv),additionalData:encoder.encode(meta.id)},key,record.bytes));}catch{throw Error('Anexo danificado: '+meta.name);}if(await hash(bytes)!==meta.hash)throw Error('Integridade do anexo não confere: '+meta.name);return bytes;}
 async function prepare(file,role){
  if(!file||file.size<5||file.size>5000000)throw Error('Selecione um PDF de até 5 MB.');
  const bytes=new Uint8Array(await file.arrayBuffer());if(new TextDecoder().decode(bytes.slice(0,5))!=='%PDF-')throw Error('O arquivo precisa ser um PDF.');
  const raw=crypto.getRandomValues(new Uint8Array(32)),iv=crypto.getRandomValues(new Uint8Array(12)),id='df_'+crypto.randomUUID().replaceAll('-',''),key=await crypto.subtle.importKey('raw',raw,'AES-GCM',false,['encrypt']);
  const meta={id,role,name:file.name.slice(0,200),size:bytes.length,hash:await hash(bytes),key:encode(raw),iv:encode(iv),at:new Date().toISOString()};
  const encrypted=new Uint8Array(await crypto.subtle.encrypt({name:'AES-GCM',iv,additionalData:encoder.encode(id)},key,bytes));await request('files','readwrite',store=>store.add({id,bytes:encrypted}));return meta;
 }
 async function collect(data){const result=[];let size=0;for(const meta of unique(data)){const row=await get(meta.id);await plain(meta,row);size+=row.bytes.length;if(size>70000000)throw Error('Os anexos excedem a capacidade de 70 MB por backup. Nenhum backup incompleto foi gerado.');result.push({id:row.id,ciphertext:encode(row.bytes)});}return result;}
 async function bundle(vault,data){const files=await collect(data);const value=files.length?{format:'gestao-terapia-backup',version:2,system:'gestao-terapia',vault,files}:vault;const serialized=JSON.stringify(value);if(new Blob([serialized]).size>MAX_BACKUP)throw Error('O backup excede 100 MB. Nenhum arquivo incompleto foi gerado.');return serialized;}
 async function inspect(data,files){
  const metas=unique(data);if(!Array.isArray(files)||files.length!==metas.length)throw Error('O backup não contém todos os anexos correspondentes. Nenhum dado foi substituído.');
  let total=0;const ids=new Set();for(const meta of metas){const row=files.find(file=>file?.id===meta.id);if(!row||ids.has(row.id)||typeof row.ciphertext!=='string'||row.ciphertext.length>6666700)throw Error('Lista de anexos inválida.');ids.add(row.id);const bytes=decode(row.ciphertext);total+=bytes.length;if(total>70000000)throw Error('Os anexos excedem 70 MB.');await plain(meta,{id:row.id,bytes});}
 }
 async function stage(data,files){await inspect(data,files);for(const row of files){const bytes=decode(row.ciphertext),old=await get(row.id);if(old){if(encode(old.bytes)!==row.ciphertext)throw Error('Conflito de arquivo local. A base foi preservada.');}else await request('files','readwrite',store=>store.add({id:row.id,bytes}));}}
 async function saveCheckpoint(raw,data){
  let files;if(data)files=await collect(data);else files=(await request('files','readonly',store=>store.getAll())).map(row=>({id:row.id,ciphertext:encode(row.bytes)}));
  if(new Blob([JSON.stringify(files)]).size>95000000)throw Error('A cópia anterior com anexos excede o limite de recuperação. Guarde cópias externas antes de prosseguir.');
  if(files.length){const id=await hash(encoder.encode(raw));await request('checkpoints','readwrite',store=>store.put({id,files,recoveryFiles:!data}));}
 }
 async function previousBundle(raw){const id=await hash(encoder.encode(raw)),row=await request('checkpoints','readonly',store=>store.get(id));if(!row?.files?.length)return raw;let vault;try{vault=JSON.parse(raw);}catch{return JSON.stringify({format:'gestao-terapia-recovery-original',version:1,original:raw,files:row.files});}return JSON.stringify({format:'gestao-terapia-backup',version:2,system:'gestao-terapia',vault,files:row.files,recoveryFiles:row.recoveryFiles===true});}
 return {prepare,collect,bundle,inspect,stage,saveCheckpoint,previousBundle,read:async meta=>plain(meta,await get(meta.id)),MAX_BACKUP};
})();
