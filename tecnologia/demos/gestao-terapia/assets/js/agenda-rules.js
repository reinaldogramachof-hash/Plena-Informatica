/* Regras locais de disponibilidade. As datas de referência não são feriados nacionais. */
const TherapyAgendaRules = (() => {
    const dayNames = ['Domingo','Segunda-feira','Terça-feira','Quarta-feira','Quinta-feira','Sexta-feira','Sábado'];
    const national = [['01-01','Confraternização Universal'],['04-21','Tiradentes'],['05-01','Dia do Trabalho'],['09-07','Independência do Brasil'],['10-12','Nossa Senhora Aparecida'],['11-02','Finados'],['11-15','Proclamação da República'],['11-20','Dia Nacional de Zumbi e da Consciência Negra'],['12-25','Natal']];
    const views = ['day','week','month','list'];
    const states = ['AC','AL','AP','AM','BA','CE','DF','ES','GO','MA','MT','MS','MG','PA','PB','PR','PE','PI','RJ','RN','RS','RO','RR','SC','SP','SE','TO'];
    const minutes = value => /^\d{2}:\d{2}$/.test(value || '') && Number(value.slice(0,2)) < 24 && Number(value.slice(3)) < 60 ? Number(value.slice(0,2))*60+Number(value.slice(3)) : NaN;
    const time = value => String(Math.floor(value/60)).padStart(2,'0')+':'+String(value%60).padStart(2,'0');
    const validDate = value => typeof value==='string' && /^\d{4}-\d{2}-\d{2}$/.test(value) && TherapyData.dateKey(new Date(value+'T12:00:00'))===value;
    const addDays = (value, count) => {const date=new Date(value+'T12:00:00');date.setDate(date.getDate()+count);return TherapyData.dateKey(date);};
    function defaults() {
        return {version:1,defaultView:'week',weekStartsOn:1,showWeekends:true,slotMinutes:30,displayStart:'07:00',displayEnd:'21:00',density:'comfortable',bufferMinutes:0,enforceHours:false,showNational:true,showReferences:true,blockNational:false,showInactive:true,hideNames:false,city:'',state:'',customDates:[],blocks:[],weekDays:dayNames.map((name,index)=>({enabled:index>0&&index<6,periods:[{start:'08:00',end:'12:00'},{start:'13:00',end:'18:00'}]}))};
    }
    function normalize(source = {}) {
        if(!source || typeof source!=='object' || Array.isArray(source))throw new Error('Configurações da Agenda inválidas.');
        const base=defaults(),cfg={...base,...source};
        if(!views.includes(cfg.defaultView)||![0,1].includes(cfg.weekStartsOn)||![10,15,20,30,60].includes(cfg.slotMinutes)||!['comfortable','compact'].includes(cfg.density)||!Number.isInteger(cfg.bufferMinutes)||cfg.bufferMinutes<0||cfg.bufferMinutes>120)throw new Error('Confira a visualização, a grade e o intervalo entre sessões.');
        for(const key of ['showWeekends','enforceHours','showNational','showReferences','blockNational','showInactive','hideNames'])if(typeof cfg[key]!=='boolean')throw new Error('Opção da Agenda inválida: '+key);
        if(!Number.isFinite(minutes(cfg.displayStart))||!Number.isFinite(minutes(cfg.displayEnd))||minutes(cfg.displayEnd)<=minutes(cfg.displayStart))throw new Error('O horário final da grade deve ser posterior ao inicial.');
        if(typeof cfg.city!=='string'||cfg.city.length>100||typeof cfg.state!=='string'||cfg.state&&!states.includes(cfg.state))throw new Error('Confira cidade e estado.');
        cfg.city=cfg.city.trim();
        if(!Array.isArray(cfg.weekDays)||cfg.weekDays.length!==7)throw new Error('Configure os sete dias da semana.');
        cfg.weekDays=cfg.weekDays.map((day,index)=>{
            if(!day||typeof day.enabled!=='boolean'||!Array.isArray(day.periods)||day.periods.length>2)throw new Error('Expediente inválido em '+dayNames[index]+'.');
            const periods=day.periods.map(period=>{if(!period||!Number.isFinite(minutes(period.start))||!Number.isFinite(minutes(period.end))||minutes(period.end)<=minutes(period.start))throw new Error('Confira os períodos de '+dayNames[index]+'.');return {start:period.start,end:period.end};}).sort((a,b)=>minutes(a.start)-minutes(b.start));
            if(day.enabled&&!periods.length||periods.length===2&&minutes(periods[1].start)<minutes(periods[0].end))throw new Error('Períodos vazios ou sobrepostos em '+dayNames[index]+'.');
            return {enabled:day.enabled,periods};
        });
        for(const key of ['customDates','blocks']){
            if(!Array.isArray(cfg[key])||cfg[key].length>500)throw new Error('Lista de datas ou bloqueios inválida.');
            const ids=new Set();
            cfg[key]=cfg[key].map(item=>{
                if(!item||typeof item.id!=='string'||!/^[a-zA-Z0-9_-]+$/.test(item.id)||ids.has(item.id))throw new Error('Data ou bloqueio repetido ou inválido.');ids.add(item.id);
                if(key==='customDates'){
                    if(!validDate(item.date)||typeof item.name!=='string'||!item.name.trim()||item.name.length>120||!['state','municipal','reference','closure'].includes(item.kind)||typeof item.annual!=='boolean'||typeof item.blocked!=='boolean')throw new Error('Confira o nome, a data e o tipo da data personalizada.');
                    return {id:item.id,date:item.date,name:item.name.trim(),kind:item.kind,annual:item.annual,blocked:item.blocked};
                }
                if(!validDate(item.startDate)||!validDate(item.endDate)||item.endDate<item.startDate||typeof item.reason!=='string'||!item.reason.trim()||item.reason.length>160||typeof item.allDay!=='boolean'||!item.allDay&&(!Number.isFinite(minutes(item.startTime))||!Number.isFinite(minutes(item.endTime))||minutes(item.endTime)<=minutes(item.startTime)))throw new Error('Confira o período, o horário e o motivo do bloqueio.');
                return {id:item.id,startDate:item.startDate,endDate:item.endDate,reason:item.reason.trim(),allDay:item.allDay,startTime:item.allDay?'':item.startTime,endTime:item.allDay?'':item.endTime};
            });
        }
        if(cfg.blockNational)cfg.showNational=true;
        return cfg;
    }
    const read = settings => normalize(settings?.agenda || {});
    function easter(year) {
        const a=year%19,b=Math.floor(year/100),c=year%100,d=Math.floor(b/4),e=b%4,f=Math.floor((b+8)/25),g=Math.floor((b-f+1)/3),h=(19*a+b-d-g+15)%30,i=Math.floor(c/4),k=c%4,l=(32+2*e+2*i-h-k)%7,m=Math.floor((a+11*h+22*l)/451),month=Math.floor((h+l-7*m+114)/31),day=(h+l-7*m+114)%31+1;
        return year+'-'+String(month).padStart(2,'0')+'-'+String(day).padStart(2,'0');
    }
    function holidays(year,cfg) {
        if(!Number.isInteger(year)||year<1900||year>2199)return [];
        const items=[];
        if(cfg.showNational||cfg.blockNational)for(const [date,name]of national){if(date==='11-20'&&year<2024)continue;items.push({date:year+'-'+date,name,kind:'national',blocked:cfg.blockNational});}
        if(cfg.showReferences){const sunday=easter(year);for(const [offset,name]of [[-48,'Carnaval — segunda-feira'],[-47,'Carnaval — terça-feira'],[-2,'Sexta-feira da Paixão'],[60,'Corpus Christi']])items.push({date:addDays(sunday,offset),name,kind:'reference',blocked:false});}
        for(const item of cfg.customDates){const date=item.annual?year+item.date.slice(4):item.date;if(validDate(date)&&Number(date.slice(0,4))===year)items.push({...item,date});}
        return items.sort((a,b)=>a.date.localeCompare(b.date)||a.name.localeCompare(b.name,'pt-BR'));
    }
    function withinHours(cfg,date,start,duration){const day=cfg.weekDays[new Date(date+'T12:00:00').getDay()];return day.enabled&&day.periods.some(period=>start>=minutes(period.start)&&start+duration<=minutes(period.end));}
    function reason(cfg,date,start,duration) {
        if(!validDate(date)||!Number.isFinite(start)||!Number.isFinite(duration)||duration<=0||start<0||start+duration>1440)return 'Confira data, horário e duração.';
        const holiday=holidays(Number(date.slice(0,4)),cfg).find(item=>item.date===date&&item.blocked);
        if(holiday)return 'Data bloqueada: '+holiday.name+'.';
        if(cfg.enforceHours&&!withinHours(cfg,date,start,duration))return 'Horário fora do expediente ou dentro de uma pausa em '+date+'.';
        const block=cfg.blocks.find(item=>date>=item.startDate&&date<=item.endDate&&(item.allDay||start<minutes(item.endTime)&&start+duration>minutes(item.startTime)));
        return block?'Período bloqueado: '+block.reason+'.':'';
    }
    function week(date,startsOn=1){const day=new Date(date+'T12:00:00').getDay(),first=addDays(date,-((day-startsOn+7)%7));return Array.from({length:7},(_,index)=>addDays(first,index));}
    function conflict(items,appointment,buffer=0){const start=minutes(appointment.time),end=start+Number(appointment.duration);return items.some(item=>item.id!==appointment.id&&item.date===appointment.date&&!['cancelled','no_show'].includes(item.status)&&start<minutes(item.time)+Number(item.duration||50)+buffer&&end+buffer>minutes(item.time));}
    function month(date,startsOn=1){const first=date.slice(0,7)+'-01',start=week(first,startsOn)[0];return Array.from({length:42},(_,index)=>addDays(start,index));}
    function layout(items){
        const sorted=[...items].sort((a,b)=>minutes(a.time)-minutes(b.time)),result=[];let group=[],end=-1;
        const flush=()=>{const ends=[];for(const item of group){const start=minutes(item.time);let lane=ends.findIndex(value=>value<=start);if(lane<0)lane=ends.length;ends[lane]=start+Number(item.duration);result.push({...item,lane});}for(const item of result.slice(result.length-group.length))item.lanes=ends.length;group=[];};
        for(const item of sorted){const start=minutes(item.time);if(group.length&&start>=end)flush();if(!group.length)end=-1;group.push(item);end=Math.max(end,start+Number(item.duration));}if(group.length)flush();return result;
    }
    return {defaults,normalize,read,minutes,time,validDate,addDays,holidays,easter,withinHours,reason,conflict,week,month,layout,dayNames,states};
})();
