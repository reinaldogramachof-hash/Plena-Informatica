/* Links externos opcionais. Nenhuma chamada a serviços ou autorização de conta. */
const TherapyExternalRules=(()=>{
 function meet(value=''){
  if(typeof value!=='string'||value.length>500)throw new Error('Informe um link válido do Google Meet.');
  const text=value.trim();if(!text)return '';
  let url;try{url=new URL(text.startsWith('meet.google.com/')?'https://'+text:text);}catch{throw new Error('Cole o link completo da sala: https://meet.google.com/abc-defg-hij.');}
  if(/\s/.test(text)||url.protocol!=='https:'||url.hostname!=='meet.google.com'||url.port||url.username||url.password||!/^\/[a-z]{3}-[a-z]{4}-[a-z]{3}\/?$/.test(url.pathname))throw new Error('Use um link de sala em https://meet.google.com/abc-defg-hij.');
  return 'https://meet.google.com'+url.pathname.replace(/\/$/,'');
 }
 function calendar(item,{title='Atendimento',includeMeet=false,timezone=Intl.DateTimeFormat().resolvedOptions().timeZone}={}){
  if(!item||['cancelled','no_show'].includes(item.status))throw new Error('A marcação cancelada ou com falta não será adicionada ao Google Agenda.');
  if(typeof title!=='string'||!title.trim()||title.trim().length>200)throw new Error('Informe um título de até 200 caracteres.');
  if(!/^\d{4}-\d{2}-\d{2}$/.test(item.date||'')||!/^\d{2}:\d{2}$/.test(item.time||'')||!Number.isInteger(Number(item.duration))||Number(item.duration)<10||Number(item.duration)>240)throw new Error('Confira data, horário e duração da marcação.');
  const start=new Date(item.date+'T'+item.time+':00');
  const pad=n=>String(n).padStart(2,'0');
  if(!Number.isFinite(start.getTime())||start.getFullYear()+'-'+pad(start.getMonth()+1)+'-'+pad(start.getDate())!==item.date||pad(start.getHours())+':'+pad(start.getMinutes())!==item.time)throw new Error('A data ou o horário não existe no fuso deste dispositivo.');
  const stamp=date=>date.toISOString().replace(/[-:]/g,'').replace(/\.\d{3}Z$/,'Z'),url=new URL('https://calendar.google.com/calendar/r/eventedit');
  url.searchParams.set('action','TEMPLATE');url.searchParams.set('text',title.trim());url.searchParams.set('dates',stamp(start)+'/'+stamp(new Date(start.getTime()+Number(item.duration)*60000)));
  if(timezone)url.searchParams.set('ctz',timezone);
  if(includeMeet){const link=meet(item.meetUrl);if(!link)throw new Error('Esta marcação não tem link do Meet.');url.searchParams.set('details','Videochamada: '+link);}
  return url.href;
 }
 return {meet,calendar};
})();
