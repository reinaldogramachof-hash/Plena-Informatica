/* Prescrição preenchida pelo profissional. Fichas são independentes dos contratos comerciais. */
const FitTrainingRules = (() => {
    const clone=FitData.clone,empty=()=>({version:1,exercises:[],programs:[]}),training=data=>data.training||empty();
    function text(value,label,max,min=0){if(typeof value!=='string'||value.trim().length<min||value.trim().length>max)throw new Error(label+' deve ter '+(min?min+' a ':'até ')+max+' caracteres.');return value.trim();}
    function id(value){if(typeof value!=='string'||!/^[A-Za-z0-9_-]{1,160}$/.test(value))throw new Error('Identificador de treino inválido.');return value;}
    function number(value,label,min,max,optional=false){if(optional&&(value===''||value===null||value===undefined))return null;if(!['string','number'].includes(typeof value)||!/^\d+$/.test(String(value).trim())||!Number.isInteger(Number(value))||Number(value)<min||Number(value)>max)throw new Error(label+' inválido.');return Number(value);}
    function next(data){const result=clone(data);result.training=result.training||empty();return result;}
    function exercise(data,key){const found=training(data).exercises.find(e=>e.id===key);if(!found)throw new Error('Exercício não encontrado.');return found;}
    function program(data,key){const found=training(data).programs.find(p=>p.id===key);if(!found)throw new Error('Ficha de treino não encontrada.');return found;}
    function version(data,key,versionId){const p=program(data,key),v=p.versions.find(v=>v.id===versionId);if(!v)throw new Error('Versão da ficha não encontrada.');return {program:p,version:v};}
    function validate(data){FitData.validateTraining(data);return data;}
    function owner(data,kind,studentId){if(!['student','template'].includes(kind))throw new Error('Escolha ficha individual ou modelo.');if(kind==='student')FitStudentRules.student(data,studentId,true);else if(studentId!==null)throw new Error('Modelo não possui vínculo com aluno.');}
    function availableVersion(data,versionId){id(versionId);if(training(data).programs.some(p=>p.versions.some(v=>v.id===versionId)))throw new Error('Esta versão já foi registrada. Reabra a ficha antes de salvar.');}
    function saveExercise(data,input,newId,now=new Date()){
        const result=next(data),old=input.id?exercise(result,input.id):null;if(old&&input.expectedRevision!==old.revision)throw new Error('O exercício mudou. Reabra seu cadastro antes de salvar.');if(!old&&result.training.exercises.some(e=>e.id===id(newId)))throw new Error('Este exercício já foi registrado.');
        const record={...old,id:old?.id||id(newId),name:text(input.name,'Nome',160,2),group:text(input.group||'','Grupo ou categoria',80),equipment:text(input.equipment||'','Equipamento',160),instructions:text(input.instructions||'','Instruções',3000),archived:old?.archived||false,revision:(old?.revision||0)+1,createdAt:old?.createdAt||now.toISOString(),updatedAt:now.toISOString()};
        if(old)result.training.exercises[result.training.exercises.indexOf(old)]=record;else result.training.exercises.push(record);return validate(result);
    }
    function archiveExercise(data,key,archived,expectedRevision,now=new Date()){
        if(typeof archived!=='boolean')throw new Error('Estado inválido.');const result=next(data),e=exercise(result,key);if(e.archived===archived)return result;if(e.revision!==expectedRevision)throw new Error('O exercício mudou. Atualize a lista.');e.archived=archived;e.revision++;e.updatedAt=now.toISOString();return validate(result);
    }
    function fields(input){const startsOn=input.startsOn,reviewOn=input.reviewOn||'';if(!FitData.isDate(startsOn)||reviewOn&&(!FitData.isDate(reviewOn)||reviewOn<startsOn))throw new Error('Confira o início e a revisão prevista.');return {title:text(input.title,'Nome da ficha',160,2),goal:text(input.goal||'','Objetivo',2000),notes:text(input.notes||'','Observações da ficha',4000),startsOn,reviewOn};}
    function blocks(data,input,previous){
        if(!Array.isArray(input)||!input.length||input.length>14)throw new Error('Inclua de 1 a 14 divisões na ficha.');
        const previousRows=new Map((previous?.blocks||[]).flatMap(b=>b.items).map(row=>[row.id,row]));
        return input.map(b=>{if(!Array.isArray(b.items)||!b.items.length||b.items.length>50)throw new Error('Cada divisão precisa de 1 a 50 exercícios.');return {id:id(b.id),name:text(b.name,'Nome da divisão',120,1),notes:text(b.notes||'','Observações da divisão',2000),items:b.items.map(row=>{
            if(row.refresh!==undefined&&typeof row.refresh!=='boolean')throw new Error('Confirme explicitamente a atualização dos dados da biblioteca.');
            const old=previousRows.get(row.id),e=exercise(data,row.exerciseId),preserve=old&&old.exerciseId===row.exerciseId&&row.refresh!==true;
            if(!preserve&&e.archived)throw new Error('Reative o exercício antes de incluí-lo ou atualizar seus dados na ficha.');
            const source=preserve?old:e;return {id:id(row.id),exerciseId:e.id,name:source.name,group:source.group,equipment:source.equipment,instructions:source.instructions,sets:number(row.sets,'Quantidade de séries',1,100),reps:text(row.reps,'Repetições ou tempo',80,1),load:text(row.load||'','Carga ou orientação',80),restSeconds:number(row.restSeconds,'Descanso em segundos',0,3600,true),notes:text(row.notes||'','Observações do exercício',2000)};
        })};});
    }
    function saveProgram(data,input,newId,versionId,now=new Date()){
        const result=next(data),old=input.id?program(result,input.id):null;owner(result,input.kind,input.studentId);availableVersion(result,versionId);
        if(old&&(old.kind!==input.kind||old.studentId!==input.studentId))throw new Error('Para trocar o aluno ou transformar em modelo, duplique a ficha.');
        if(old&&(old.archived||old.versions.at(-1).id!==input.expectedVersionId))throw new Error('A ficha foi arquivada ou revisada. Reabra a versão atual.');
        if(!old&&result.training.programs.some(p=>p.id===id(newId)))throw new Error('Esta ficha já foi registrada.');
        const v={id:versionId,number:(old?.versions.length||0)+1,...fields(input),blocks:blocks(result,input.blocks,old?.versions.at(-1)),createdAt:now.toISOString()};
        if(old){old.versions.push(v);old.updatedAt=now.toISOString();old.history.push({action:'revised',at:now.toISOString(),versionId});}
        else result.training.programs.push({id:id(newId),kind:input.kind,studentId:input.studentId,archived:false,createdAt:now.toISOString(),updatedAt:now.toISOString(),versions:[v],history:[{action:'created',at:now.toISOString(),versionId}]});
        return validate(result);
    }
    function duplicate(data,key,sourceVersionId,input,newId,versionId,now=new Date()){
        const result=next(data),source=version(result,key,sourceVersionId);owner(result,input.kind,input.studentId);id(newId);availableVersion(result,versionId);if(result.training.programs.some(p=>p.id===newId))throw new Error('Esta duplicação já foi registrada.');
        const v={...clone(source.version),...fields({...source.version,...input}),id:versionId,number:1,createdAt:now.toISOString()};
        result.training.programs.push({id:newId,kind:input.kind,studentId:input.studentId,archived:false,source:{programId:key,versionId:sourceVersionId},createdAt:now.toISOString(),updatedAt:now.toISOString(),versions:[v],history:[{action:'duplicated',at:now.toISOString(),versionId}]});return validate(result);
    }
    function archiveProgram(data,key,archived,expectedVersionId,now=new Date()){
        if(typeof archived!=='boolean')throw new Error('Estado inválido.');const result=next(data),p=program(result,key);if(p.archived===archived)return result;if(p.versions.at(-1).id!==expectedVersionId)throw new Error('A ficha foi revisada. Atualize a lista.');if(!archived)owner(result,p.kind,p.studentId);p.archived=archived;p.updatedAt=now.toISOString();p.history.push({action:archived?'archived':'reactivated',at:now.toISOString(),versionId:p.versions.at(-1).id});return validate(result);
    }
    const fold=value=>String(value||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLocaleLowerCase('pt-BR');
    function catalog(data,query='',status='active'){const q=fold(query).trim();return training(data).exercises.filter(e=>(status==='all'||(status==='archived'?e.archived:!e.archived))&&(!q||[e.name,e.group,e.equipment].some(value=>fold(value).includes(q)))).slice().sort((a,b)=>a.name.localeCompare(b.name,'pt-BR')||a.id.localeCompare(b.id));}
    function programs(data,{kind='student',studentId='',query='',status='active'}={}){const q=fold(query).trim();return training(data).programs.filter(p=>(kind==='all'||p.kind===kind)&&(!studentId||p.studentId===studentId)&&(status==='all'||(status==='archived'?p.archived:!p.archived))&&(!q||[p.versions.at(-1).title,p.versions.at(-1).goal,data.clients.find(c=>c.id===p.studentId)?.name].some(value=>fold(value).includes(q)))).slice().sort((a,b)=>b.updatedAt.localeCompare(a.updatedAt)||a.id.localeCompare(b.id));}
    function clearStudents(data){const result=clone(data);if(result.training){result.training.programs=result.training.programs.filter(p=>p.kind==='template');if(result.training.sessions)result.training.sessions=[];for(const p of result.training.programs)if(p.source&&!result.training.programs.some(source=>source.id===p.source.programId))delete p.source;}return result;}
    return {training,exercise,program,version,saveExercise,archiveExercise,saveProgram,duplicate,archiveProgram,catalog,programs,clearStudents};
})();
