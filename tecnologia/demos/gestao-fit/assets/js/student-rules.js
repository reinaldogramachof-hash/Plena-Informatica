/* Ficha individual e medidas registradas. Sem diagnóstico ou classificação automática. */
const FitStudentRules = (() => {
    const archived = c => !!(c.archived || c.archivedAt);
    const text=(value,label,max=4000)=>{if(typeof value!=='string'||value.trim().length>max)throw new Error(label+' inválido.');return value.trim();};
    function student(data,id,active=false) {
        const c=data.clients.find(c=>c.id===id);if(!c)throw new Error('Aluno não encontrado.');if(active&&archived(c))throw new Error('Reative o aluno antes de registrar novas atividades.');return c;
    }
    function identity(id,records) {if(!/^[A-Za-z0-9_-]{1,160}$/.test(id||'')||records.some(c=>c.id===id))throw new Error('Identificador indisponível.');}
    function contact(data,input,newId,now=new Date()) {
        const next=FitData.clone(data),existing=input.id?student(next,input.id):null;
        const name=text(input.name,'Nome',160),phone=text(input.phone||'','Telefone',40),email=text(input.email||'','E-mail',200),notes=text(input.notes||'','Observações');
        if(name.length<2)throw new Error('Informe o nome completo do aluno.');
        if(email&&!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))throw new Error('Confira o e-mail do aluno.');
        if(!existing)identity(newId,next.clients);
        const c={...existing,id:existing?.id||newId,name,phone:phone||null,email:email||null,notes:notes||null,createdAt:existing?.createdAt||now.toISOString(),updatedAt:now.toISOString()};
        if(existing)next.clients[next.clients.findIndex(item=>item.id===c.id)]=c;else next.clients.push(c);
        return next;
    }
    function profile(data,id,input,now=new Date()) {
        const next=FitData.clone(data),c=student(next,id,true),today=FitData.dateKey(now),previous=c.fitProfile||{};
        const p={...previous,version:1,intake:{...previous.intake},reviewedOn:today};
        for(const field of FitData.studentText)p[field]=text(input[field]||'',field);
        if(p.birthDate&&(!FitData.isDate(p.birthDate)||p.birthDate>today))throw new Error('Confira a data de nascimento.');
        for(const field of FitData.intakeText)p.intake[field]=text(input.intake?.[field]||'',field);
        c.fitProfile=p;c.updatedAt=now.toISOString();FitData.validateStudent(c);return next;
    }
    function assess(data,id,input,newId,now=new Date()) {
        const next=FitData.clone(data),c=student(next,id,true),today=FitData.dateKey(now);
        c.assessments=c.assessments||[];identity(newId,c.assessments);
        if(!FitData.isDate(input.date)||input.date>today)throw new Error('A avaliação deve ter uma data válida até hoje.');
        const a={id:newId,date:input.date,notes:text(input.notes||'','Observações'),nextReview:input.nextReview||'',createdAt:now.toISOString()};
        for(const field of Object.keys(FitData.measures)){
            const raw=input[field];if(raw===undefined||raw===null||raw==='')a[field]=null;
            else {if(typeof raw==='boolean'||!['number','string'].includes(typeof raw)||typeof raw==='string'&&!/^\d+(?:[.,]\d+)?$/.test(raw.trim()))throw new Error('Confira a medida: '+field);a[field]=Number(typeof raw==='string'?raw.trim().replace(',','.'):raw);}
        }
        if(!a.notes&&!Object.keys(FitData.measures).some(field=>a[field]!==null))throw new Error('Registre pelo menos uma medida ou observação da avaliação.');
        c.assessments.push(a);c.updatedAt=now.toISOString();FitData.validateStudent(c);return next;
    }
    function archive(data,id,now=new Date()) {
        const next=FitData.clone(data),c=student(next,id);c.archived=!archived(c);c.archivedAt=c.archived?now.toISOString():null;c.updatedAt=now.toISOString();return next;
    }
    function list(data,query='',status='active') {
        const fold=s=>String(s||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase();const q=fold(query).trim();
        return data.clients.filter(c=>(status==='all'||(status==='archived'?archived(c):!archived(c)))&&(!q||[c.name,c.phone,c.email,c.id].some(value=>fold(value).includes(q)))).slice().sort((a,b)=>a.name.localeCompare(b.name,'pt-BR')||a.id.localeCompare(b.id));
    }
    // IDs são a única entrada aceita para criar vínculos novos. Nunca cria nem associa pelo nome.
    function resolve(data,id) {return student(data,id,true).id;}
    function history(data,id) {
        const c=student(data,id),events=[];
        for(const a of c.assessments||[])events.push({kind:'assessment',id:a.id,date:a.date,title:'Avaliação registrada',detail:a.notes||'Medidas disponíveis nas avaliações'});
        for(const a of data.appointments.filter(a=>a.clientId===id))events.push({kind:'appointment',id:a.id,date:a.date,title:({pending:'Aula agendada',done:'Aula concluída',canceled:'Aula cancelada',missed:'Falta registrada'})[a.status],detail:a.time+' · '+(a.serviceName||'Serviço anterior')});
        const labels={confirmed:'Aula confirmada pelo aluno',confirmation_cleared:'Confirmação removida',confirmation_invalidated:'Nova confirmação necessária',missed:'Decisão sobre falta',absence_corrected:'Correção da falta',completed:'Registro do atendimento',canceled:'Cancelamento registrado'};
        for(const a of data.appointments.filter(a=>a.clientId===id))for(const h of a.attendance?.history||[])events.push({kind:'appointment',id:a.id,date:FitData.dateKey(h.at),title:labels[h.action],detail:a.time+' · '+(h.effect?(h.effect==='consume'?'Com consumo de sessão':'Sem consumo de sessão')+' · ':'')+(h.note||a.serviceName||'Aula')});
        for(const e of data.enrollments.filter(e=>e.studentId===id))events.push({kind:'enrollment',id:e.id,date:e.startDate,title:'Matrícula · '+e.status,detail:data.services.find(p=>p.id===e.planId)?.name||'Plano anterior'});
        for(const t of data.transactions.filter(t=>t.clientId===id))events.push({kind:'transaction',id:t.id,date:t.date,title:t.type==='income'?'Entrada registrada':'Saída registrada',detail:t.description,amount:t.amount});
        if(c.archivedAt)events.push({kind:'archive',id:c.id,date:FitData.dateKey(c.archivedAt),title:'Cadastro arquivado',detail:'Histórico preservado'});
        return events.sort((a,b)=>b.date.localeCompare(a.date)||a.kind.localeCompare(b.kind)||a.id.localeCompare(b.id));
    }
    function comparison(client) {
        const sorted=(client.assessments||[]).slice().sort((a,b)=>a.date.localeCompare(b.date)||(a.createdAt||'').localeCompare(b.createdAt||'')||a.id.localeCompare(b.id));
        return Object.keys(FitData.measures).map(field=>{
            const values=sorted.filter(a=>a[field]!==null&&a[field]!==undefined),first=values[0],last=values.at(-1);
            return {field,first:first?{date:first.date,value:first[field]}:null,last:last?{date:last.date,value:last[field]}:null,change:values.length>1?Math.round((last[field]-first[field])*100)/100:null};
        });
    }
    return {archived,student,contact,profile,assess,archive,list,resolve,history,comparison};
})();
