/* Contrato de dados local. Preserva campos legados sem associar alunos por nome. */
const FitData = (() => {
    const version = 7;
    const collections = ['appointments', 'team', 'services', 'clients', 'transactions', 'enrollments'];
    const idPattern = /^[A-Za-z0-9_-]{1,160}$/;
    const references = { appointments: ['clientId','proId','serviceId'], enrollments: ['studentId','planId','instructorId'], transactions: ['clientId','proId','serviceId','enrollmentId','appointmentId'] };
    const object = value => !!value && typeof value === 'object' && !Array.isArray(value);
    const clone = value => JSON.parse(JSON.stringify(value));
    function isDate(value) {
        if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
        const [y, m, d] = value.split('-').map(Number);
        const date = new Date(Date.UTC(y, m - 1, d));
        return y >= 1900 && y <= 9999 && date.getUTCFullYear() === y && date.getUTCMonth() === m - 1 && date.getUTCDate() === d;
    }
    function dateKey(value = new Date()) {
        if (typeof value === 'string' && isDate(value)) return value;
        if (typeof value === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(value)) throw new Error('Data inválida.');
        const date = new Date(value);
        if (!Number.isFinite(date.getTime())) throw new Error('Data inválida.');
        return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
    }
    function formatDate(value) {
        if (!value) return '--/--/--';
        const key = dateKey(value);
        return key.split('-').reverse().join('/');
    }
    function number(value, label, min = 0, max = Number.MAX_SAFE_INTEGER) {
        if (value === null || typeof value === 'string' && !value.trim() || typeof value === 'boolean' || !['number', 'string'].includes(typeof value) || !Number.isFinite(Number(value)) || Number(value) < min || Number(value) > max) throw new Error(label + ' inválido.');
        return Number(value);
    }
    const studentText = ['birthDate','goal','experience','availability','emergencyName','emergencyPhone','contactPreference'];
    const intakeText = ['activityHistory','healthNotes','medications','injuries','professionalGuidance'];
    const measures = {weightKg:1000,heightCm:300,waistCm:500,hipCm:500,chestCm:500,armCm:500,thighCm:500};
    const validTime=value=>typeof value==='string'&&/^([01]\d|2[0-3]):[0-5]\d$/.test(value);
    const minutes=value=>Number(value.slice(0,2))*60+Number(value.slice(3));
    function validateAvailability(value) {
        if(!object(value)||typeof value.enabled!=='boolean'||!Array.isArray(value.slots)||value.slots.length>14)throw new Error('Disponibilidade semanal inválida.');
        const days=new Map();
        for(const slot of value.slots){if(!object(slot)||!Number.isInteger(slot.day)||slot.day<0||slot.day>6||!validTime(slot.start)||!validTime(slot.end)||slot.end<=slot.start)throw new Error('Confira os dias e horários disponíveis.');const previous=days.get(slot.day)||[];if(previous.some(s=>s.start<slot.end&&slot.start<s.end)||previous.length>=2)throw new Error('Os intervalos disponíveis não podem se sobrepor; use até dois por dia.');previous.push(slot);days.set(slot.day,previous);}
    }
    function validateSchedule(item) {
        if(item.schedule===undefined)return;const s=item.schedule;
        if(!object(s)||s.version!==1||!Number.isInteger(s.durationMinutes)||s.durationMinutes<5||s.durationMinutes>720||minutes(item.time)+s.durationMinutes>1440||typeof s.location!=='string'||s.location.length>200||s.notes!==undefined&&(typeof s.notes!=='string'||s.notes.length>2000)||s.history!==undefined&&!Array.isArray(s.history))throw new Error('Duração, local ou histórico do horário inválido.');
        if(s.recurrence!==undefined){const r=s.recurrence;if(!object(r)||r.version!==1||typeof r.seriesId!=='string'||!/^[A-Za-z0-9_-]{1,120}$/.test(r.seriesId)||!Number.isInteger(r.index)||!Number.isInteger(r.count)||r.count<2||r.count>52||r.index<1||r.index>r.count||!Number.isInteger(r.weekInterval)||r.weekInterval<1||r.weekInterval>4||!Array.isArray(r.weekdays)||!r.weekdays.length||r.weekdays.some(d=>!Number.isInteger(d)||d<0||d>6)||new Set(r.weekdays).size!==r.weekdays.length||!isDate(r.originalDate))throw new Error('Identificação de repetição inválida.');}
    }
    function validateScheduleSettings(settings) {
        if(settings.schedule===undefined)return;const s=settings.schedule;
        if(!object(s)||s.version!==1)throw new Error('Configuração da agenda inválida.');
        if(s.availability!==undefined)validateAvailability(s.availability);
        if(s.blocks!==undefined){if(!Array.isArray(s.blocks))throw new Error('Bloqueios inválidos.');const ids=new Set();for(const b of s.blocks){if(!object(b)||typeof b.id!=='string'||!idPattern.test(b.id)||ids.has(b.id)||!isDate(b.date)||!validTime(b.start)||!validTime(b.end)||b.end<=b.start||typeof b.note!=='string'||b.note.length>500||typeof b.active!=='boolean')throw new Error('Bloqueio de horário inválido.');ids.add(b.id);}}
    }
    function validateAttendance(a){
        const value=a.attendance,stamp=v=>typeof v==='string'&&Number.isFinite(Date.parse(v))&&new Date(v).toISOString()===v;
        if(value===undefined){if(a.status==='missed')throw new Error('Falta sem decisão registrada.');return;}
        const actions=['confirmed','confirmation_cleared','confirmation_invalidated','missed','absence_corrected','completed','canceled'];
        if(!object(value)||value.version!==1||!['unconfirmed','confirmed'].includes(value.confirmation)||!Array.isArray(value.history))throw new Error('Histórico de atendimento inválido.');
        for(const entry of value.history)if(!object(entry)||!actions.includes(entry.action)||!stamp(entry.at)||entry.note!==undefined&&(typeof entry.note!=='string'||entry.note.length>2000)||entry.effect!==undefined&&!['waived','consume'].includes(entry.effect))throw new Error('Movimento do atendimento inválido.');
        const absence=value.absence;
        if(a.status==='missed'){
            if(!object(absence)||!['waived','consume'].includes(absence.effect)||typeof absence.reason!=='string'||absence.reason.trim().length<3||absence.reason.length>1000||!stamp(absence.recordedAt)||!value.history.some(h=>h.action==='missed'&&h.at===absence.recordedAt&&h.effect===absence.effect&&h.note===absence.reason))throw new Error('Decisão da falta inválida.');
            if(absence.effect==='consume'&&a.billing?.mode!=='contract')throw new Error('Consumo por falta sem cobertura contratada.');
        }else if(absence!==undefined)throw new Error('Decisão de falta sem falta correspondente.');
    }
    function validateStudent(client) {
        if(client.crm!==undefined){if(typeof FitCRMRules==='undefined')throw new Error('Atualize o sistema antes de abrir este acompanhamento.');FitCRMRules.validate(client);}
        if(client.archived!==undefined&&typeof client.archived!=='boolean')throw new Error('Estado do aluno inválido.');
        for(const field of ['archivedAt','updatedAt'])if(client[field]!==undefined&&client[field]!==null&&(typeof client[field]!=='string'||!Number.isFinite(Date.parse(client[field]))))throw new Error('Data do cadastro inválida.');
        if(client.fitProfile!==undefined){
            const p=client.fitProfile;
            if(!object(p)||p.version!==1)throw new Error('Ficha do aluno incompatível.');
            for(const field of studentText)if(p[field]!==undefined&&(typeof p[field]!=='string'||p[field].length>4000))throw new Error('Campo da ficha inválido: '+field);
            if(p.birthDate&&!isDate(p.birthDate))throw new Error('Nascimento inválido.');
            if(p.contactPreference!==undefined&&!['','whatsapp','phone','email','none'].includes(p.contactPreference))throw new Error('Preferência de contato inválida.');
            if(p.reviewedOn!==undefined&&!isDate(p.reviewedOn))throw new Error('Data da anamnese inválida.');
            if(p.weeklyAvailability!==undefined)validateAvailability(p.weeklyAvailability);
            if(p.intake!==undefined){if(!object(p.intake))throw new Error('Anamnese inválida.');for(const field of intakeText)if(p.intake[field]!==undefined&&(typeof p.intake[field]!=='string'||p.intake[field].length>4000))throw new Error('Informação relatada inválida: '+field);}
        }
        if(client.assessments!==undefined){
            if(!Array.isArray(client.assessments))throw new Error('Avaliações inválidas.');
            const ids=new Set();
            for(const a of client.assessments){
                if(!object(a)||typeof a.id!=='string'||!idPattern.test(a.id)||ids.has(a.id)||!isDate(a.date))throw new Error('Identificação ou data da avaliação inválida.');ids.add(a.id);
                for(const [field,max]of Object.entries(measures))if(a[field]!==undefined&&a[field]!==null)a[field]=number(a[field],'Medida '+field,0.1,max);
                if(a.nextReview&&!isDate(a.nextReview)||a.nextReview&&a.nextReview<a.date)throw new Error('Reavaliação inválida.');
                if(a.notes!==undefined&&(typeof a.notes!=='string'||a.notes.length>4000))throw new Error('Observação da avaliação inválida.');
                if(a.createdAt!==undefined&&(typeof a.createdAt!=='string'||!Number.isFinite(Date.parse(a.createdAt))))throw new Error('Registro da avaliação inválido.');
            }
        }
    }
    function validateCommerce(data) {
        const validId=value=>typeof value==='string'&&idPattern.test(value);
        const money=value=>Number.isSafeInteger(value)&&value>=0&&value<=10000000000;
        const quota=value=>value===null||Number.isInteger(value)&&value>0&&value<=10000;
        function terms(c){if(!object(c)||c.version!==1||!['monthly','package','single'].includes(c.kind)||!quota(c.sessionsIncluded)||c.kind==='package'&&c.sessionsIncluded===null||c.kind==='single'&&c.sessionsIncluded!==1||c.kind==='monthly'&&![1,3,6,12].includes(c.months)||c.kind!=='monthly'&&(!Number.isInteger(c.validityDays)||c.validityDays<1||c.validityDays>3650))throw new Error('Condições comerciais inválidas.');}
        for(const s of data.services)if(s.commercial!==undefined)terms(s.commercial);
        for(const e of data.enrollments){if(e.commercial===undefined)continue;const c=e.commercial;terms(c);
            if(typeof c.planName!=='string'||!c.planName.trim()||!money(c.priceCents)||!Array.isArray(c.periods)||!c.periods.length||!Array.isArray(c.uses))throw new Error('Contrato comercial inválido.');
            const periods=new Map();let lastEnd='';for(const p of c.periods){if(!object(p)||!validId(p.id)||periods.has(p.id)||!isDate(p.startDate)||!isDate(p.endDate)||!isDate(p.dueDate)||p.endDate<=p.startDate||lastEnd&&p.startDate<lastEnd||!money(p.priceCents)||!quota(p.sessionsIncluded))throw new Error('Período contratado inválido.');periods.set(p.id,p);lastEnd=p.endDate;}
            const appointments=new Set(),ids=new Set();for(const u of c.uses){const p=object(u)&&periods.get(u.periodId);if(!object(u)||!validId(u.id)||ids.has(u.id)||!validId(u.appointmentId)||appointments.has(u.appointmentId)||!p||!isDate(u.date)||u.date<p.startDate||u.date>=p.endDate)throw new Error('Movimento de sessões inválido.');ids.add(u.id);appointments.add(u.appointmentId);}
            for(const p of c.periods)if(p.sessionsIncluded!==null&&c.uses.filter(u=>u.periodId===p.id).length>p.sessionsIncluded)throw new Error('Consumo excede as sessões contratadas.');
            if(c.pauses!==undefined&&(!Array.isArray(c.pauses)||c.pauses.some(p=>!object(p)||!isDate(p.from)||p.to!==null&&(!isDate(p.to)||p.to<p.from))))throw new Error('Histórico de pausa inválido.');
        }
        for(const a of data.appointments){if(a.billing===undefined)continue;const b=a.billing;if(!object(b)||b.version!==1||!['contract','standalone','historical'].includes(b.mode)||b.mode==='standalone'&&!money(b.priceCents)||b.mode==='historical'&&(typeof b.note!=='string'||b.note.trim().length<3||b.note.length>500)||b.mode==='contract'&&(!validId(b.enrollmentId)||!validId(b.periodId)))throw new Error('Cobertura de aula inválida.');}
        const keys=new Set();for(const t of data.transactions){if(t.finance!==undefined||t.paymentKey===undefined)continue;if(typeof t.paymentKey!=='string'||keys.has(t.paymentKey)||t.type!=='income')throw new Error('Recebimento repetido ou inválido.');keys.add(t.paymentKey);
            let priceCents,clientId,serviceId,expected;
            if(t.billingPeriodId){const e=data.enrollments.find(e=>e.id===t.enrollmentId),p=e?.commercial?.periods.find(p=>p.id===t.billingPeriodId);if(!p)throw new Error('Período de recebimento indisponível.');priceCents=p.priceCents;clientId=e.studentId;serviceId=e.planId;expected='period:'+e.id+':'+p.id;}
            else {const a=data.appointments.find(a=>a.id===t.appointmentId);if(a?.billing?.mode!=='standalone'||a.status!=='done')throw new Error('Aula do recebimento indisponível.');priceCents=a.billing.priceCents;clientId=a.clientId;serviceId=a.serviceId;expected='appointment:'+a.id;}
            if(t.paymentKey!==expected||t.amount!==priceCents/100||priceCents===0||t.clientId!==clientId||t.serviceId!==serviceId)throw new Error('Recebimento não corresponde à origem contratada.');
        }
        for(const e of data.enrollments.filter(e=>e.commercial))for(const u of e.commercial.uses){const a=data.appointments.find(a=>a.id===u.appointmentId);if(!a||!(a.status==='done'||a.status==='missed'&&a.attendance?.absence?.effect==='consume')||a.date!==u.date||a.billing?.mode!=='contract'||a.billing.enrollmentId!==e.id||a.billing.periodId!==u.periodId||a.clientId!==e.studentId||a.serviceId!==e.planId)throw new Error('Movimento de sessão sem presença ou falta consumida correspondente.');}
        for(const a of data.appointments.filter(a=>a.billing?.mode==='contract')){const e=data.enrollments.find(e=>e.id===a.billing.enrollmentId),p=e?.commercial?.periods.find(p=>p.id===a.billing.periodId),consumes=a.status==='done'||a.status==='missed'&&a.attendance?.absence?.effect==='consume';if(!p||e.studentId!==a.clientId||e.planId!==a.serviceId||consumes&&(a.date<p.startDate||a.date>=p.endDate))throw new Error('Vínculo da cobertura contratada inválido.');if(consumes&&!e.commercial.uses.some(u=>u.appointmentId===a.id&&u.periodId===p.id))throw new Error('Presença ou falta consumida sem movimento de sessão.');}
    }
    function validateTraining(data){
        const t=data.training;if(t===undefined)return;
        const stamp=v=>typeof v==='string'&&Number.isFinite(Date.parse(v))&&new Date(v).toISOString()===v;
        const text=(v,max,min=0)=>typeof v==='string'&&v.trim().length>=min&&v.length<=max;
        const id=v=>typeof v==='string'&&idPattern.test(v);
        if(!object(t)||t.version!==1||!Array.isArray(t.exercises)||!Array.isArray(t.programs))throw new Error('Biblioteca ou fichas de treino inválidas.');
        const exercises=new Set(),programs=new Map(),versionIds=new Set();
        for(const e of t.exercises){if(!object(e)||!id(e.id)||exercises.has(e.id)||!text(e.name,160,2)||!text(e.group,80)||!text(e.equipment,160)||!text(e.instructions,3000)||typeof e.archived!=='boolean'||!Number.isInteger(e.revision)||e.revision<1||!stamp(e.createdAt)||!stamp(e.updatedAt))throw new Error('Exercício da biblioteca inválido.');exercises.add(e.id);}
        for(const p of t.programs){
            if(!object(p)||!id(p.id)||programs.has(p.id)||!['student','template'].includes(p.kind)||p.kind==='template'&&p.studentId!==null||p.kind==='student'&&(!id(p.studentId)||!data.clients.some(c=>c.id===p.studentId))||typeof p.archived!=='boolean'||!stamp(p.createdAt)||!stamp(p.updatedAt)||!Array.isArray(p.versions)||!p.versions.length||!Array.isArray(p.history))throw new Error('Ficha de treino ou vínculo do aluno inválido.');
            for(let index=0;index<p.versions.length;index++){
                const v=p.versions[index];if(!object(v)||!id(v.id)||versionIds.has(v.id)||v.number!==index+1||!text(v.title,160,2)||!text(v.goal,2000)||!text(v.notes,4000)||!isDate(v.startsOn)||v.reviewOn!==''&&(!isDate(v.reviewOn)||v.reviewOn<v.startsOn)||!stamp(v.createdAt)||!Array.isArray(v.blocks)||!v.blocks.length||v.blocks.length>14)throw new Error('Versão da ficha de treino inválida.');versionIds.add(v.id);
                const blocks=new Set(),rows=new Set();let total=0;
                for(const b of v.blocks){if(!object(b)||!id(b.id)||blocks.has(b.id)||!text(b.name,120,1)||!text(b.notes,2000)||!Array.isArray(b.items)||!b.items.length||b.items.length>50)throw new Error('Divisão de treino inválida.');blocks.add(b.id);
                    for(const row of b.items){if(!object(row)||!id(row.id)||rows.has(row.id)||!exercises.has(row.exerciseId)||!text(row.name,160,2)||!text(row.group,80)||!text(row.equipment,160)||!text(row.instructions,3000)||!Number.isInteger(row.sets)||row.sets<1||row.sets>100||!text(row.reps,80,1)||!text(row.load,80)||row.restSeconds!==null&&(!Number.isInteger(row.restSeconds)||row.restSeconds<0||row.restSeconds>3600)||!text(row.notes,2000))throw new Error('Exercício ou prescrição da ficha inválidos.');rows.add(row.id);total++;}
                }
                if(total>200)throw new Error('Use até 200 exercícios por versão da ficha.');
            }
            for(const h of p.history)if(!object(h)||!['created','revised','duplicated','archived','reactivated'].includes(h.action)||!stamp(h.at)||!p.versions.some(v=>v.id===h.versionId))throw new Error('Histórico da ficha de treino inválido.');
            programs.set(p.id,p);
        }
        for(const p of t.programs)if(p.source!==undefined&&(!object(p.source)||p.source.programId===p.id||!programs.get(p.source.programId)?.versions.some(v=>v.id===p.source.versionId)))throw new Error('Origem da ficha duplicada indisponível.');
        if(t.sessions===undefined)return;
        if(!Array.isArray(t.sessions))throw new Error('Histórico de execuções de treino inválido.');
        const sessionIds=new Set(),revisionIds=new Set();
        for(const s of t.sessions){
            const p=programs.get(s?.programId),v=p?.versions.find(v=>v.id===s?.versionId),b=v?.blocks.find(b=>b.id===s?.blockId);
            if(!object(s)||!id(s.id)||sessionIds.has(s.id)||!p||p.kind!=='student'||s.studentId!==p.studentId||!b||!stamp(s.createdAt)||!Array.isArray(s.revisions)||!s.revisions.length)throw new Error('Execução sem vínculo válido com aluno, ficha, versão e divisão.');
            sessionIds.add(s.id);let previousAt=s.createdAt;
            for(let index=0;index<s.revisions.length;index++){
                const r=s.revisions[index];
                if(!object(r)||!id(r.id)||revisionIds.has(r.id)||r.number!==index+1||!isDate(r.date)||r.date<v.startsOn||!stamp(r.createdAt)||r.createdAt<previousAt||index===0&&r.createdAt!==s.createdAt||!text(r.notes,4000)||!text(r.reason,500,index===0?0:5)||index===0&&r.reason!==''||r.effort!==null&&(!Number.isInteger(r.effort)||r.effort<1||r.effort>10)||!Array.isArray(r.items)||r.items.length!==b.items.length)throw new Error('Revisão ou data da execução de treino inválida.');
                // Campo adicional opcional: históricos sem recordedOn continuam válidos, sem inferir seu dia local.
                const utcAt=Date.parse(r.createdAt),executionDay=Date.parse(r.date+'T00:00:00Z');
                if(executionDay-utcAt>86400000)throw new Error('Execução com data posterior à sua gravação.');
                if(r.recordedOn!==undefined&&(!isDate(r.recordedOn)||r.date>r.recordedOn||Math.abs(Date.parse(r.recordedOn+'T12:00:00Z')-utcAt)>36*3600000))throw new Error('Dia local da gravação de treino incompatível.');
                revisionIds.add(r.id);previousAt=r.createdAt;const rows=new Set();let performed=0;
                for(const item of r.items){
                    if(!object(item)||!b.items.some(row=>row.id===item.rowId)||rows.has(item.rowId)||!['done','partial','skipped'].includes(item.status)||!text(item.notes,2000)||!text(item.reps,80,item.status==='skipped'?0:1)||!text(item.load,80)||item.status==='skipped'&&(item.sets!==null||item.reps!==''||item.load!=='')||item.status!=='skipped'&&(!Number.isInteger(item.sets)||item.sets<1||item.sets>100))throw new Error('Resultado de exercício incompatível com a divisão histórica.');
                    rows.add(item.rowId);if(item.status!=='skipped')performed++;
                }
                if(!performed)throw new Error('Execução sem exercício realizado ou parcial.');
            }
            if(s.voided!==null&&(!object(s.voided)||!text(s.voided.reason,500,5)||!stamp(s.voided.at)||s.voided.at<previousAt))throw new Error('Cancelamento da execução inválido.');
        }
    }
    function normalize(source, defaults, strict = false) {
        if (!object(source) || source.format || source.system && source.system !== 'gestao-fit') throw new Error('Este arquivo não é uma base do Gestão Fit.');
        if (source.schemaVersion !== undefined && (!Number.isInteger(source.schemaVersion) || source.schemaVersion < 1 || source.schemaVersion > version)) throw new Error('Versão de dados incompatível. Atualize o Gestão Fit.');
        if (source.settings !== undefined && !object(source.settings)) throw new Error('Configurações inválidas.');
        if (strict && (!object(source.settings) || collections.filter(k => k !== 'enrollments').some(k => !Array.isArray(source[k])))) throw new Error('O backup não contém as coleções obrigatórias do Gestão Fit.');
        const data = clone({ ...defaults, ...source, settings: { ...defaults.settings, ...source.settings } });
        validateScheduleSettings(data.settings);
        for(const field of ['businessName','businessOwner','businessDoc','businessHours'])if(data.settings[field]!==undefined&&typeof data.settings[field]!=='string')throw new Error('Informação profissional inválida: '+field);
        if(data.settings.professional!==undefined){
            const profile=data.settings.professional;
            if(!object(profile))throw new Error('Perfil profissional inválido.');
            for(const field of ['name','email','phone','registration','specialty'])if(profile[field]!==undefined&&(typeof profile[field]!=='string'||profile[field].length>200))throw new Error('Informação do perfil inválida: '+field);
            if(profile.primaryInstructorId!==undefined&&profile.primaryInstructorId!==''&&(typeof profile.primaryInstructorId!=='string'||!idPattern.test(profile.primaryInstructorId)))throw new Error('Vínculo do perfil inválido.');
        }
        for (const name of collections) {
            if (source[name] !== undefined && !Array.isArray(source[name])) throw new Error('Coleção inválida: ' + name);
            data[name] = data[name] || [];
            const ids = new Set();
            for (const item of data[name]) {
                if (!object(item) || typeof item.id !== 'string' || !idPattern.test(item.id) || ids.has(item.id)) throw new Error('Identificador inválido ou repetido: ' + name);
                ids.add(item.id);
                for(const field of references[name]||[])if(item[field]!==undefined&&item[field]!==null&&item[field]!==''&&(typeof item[field]!=='string'||!idPattern.test(item[field])))throw new Error('Referência inválida: '+name+' / '+field);
                for(const field of ['phone','email','notes','clientName','serviceName','proName','category'])if(item[field]!==undefined&&item[field]!==null&&typeof item[field]!=='string')throw new Error('Texto inválido: '+name+' / '+field);
                if (['clients', 'team', 'services'].includes(name) && (typeof item.name !== 'string' || !item.name.trim())) throw new Error('Registro sem nome: ' + name);
                if (name === 'clients') validateStudent(item);
                if (name === 'team') item.commission = number(item.commission ?? 0, 'Comissão', 0, 100);
                if (name === 'services') {
                    item.price = number(item.price, 'Preço');
                    item.billingCycle = item.billingCycle || 'monthly';
                    if (!['monthly', 'quarterly', 'semiannual', 'annual'].includes(item.billingCycle)) throw new Error('Ciclo de plano inválido.');
                    item.sessionsIncluded = item.sessionsIncluded ?? null;
                    if (item.sessionsIncluded !== null && (!Number.isInteger(item.sessionsIncluded) || item.sessionsIncluded < 1)) throw new Error('Quantidade de sessões inválida.');
                }
                if (name === 'transactions') {
                    // Correção restrita ao lançamento de comissão antigo, que não gravava type.
                    if (item.type === undefined && item.category === 'comissao' && typeof item.description === 'string' && item.description.startsWith('Pagamento Comissão:')) {
                        item.type = 'expense'; item.legacyTypeRepaired = true;
                    }
                    if (!['income', 'expense'].includes(item.type) || typeof item.description !== 'string') throw new Error('Lançamento financeiro inválido.');
                    item.amount = number(item.amount, 'Valor');
                    if (item.commission !== undefined) item.commission = number(item.commission, 'Comissão');
                    if (!isDate(item.date)) throw new Error('Data financeira inválida.');
                }
                if (name === 'appointments') {
                    if (!isDate(item.date) || typeof item.time !== 'string' || !/^([01]\d|2[0-3]):[0-5]\d$/.test(item.time) || !['pending', 'done', 'canceled', 'missed'].includes(item.status)) throw new Error('Agendamento inválido.');
                    item.clientName = item.clientName || item.client || '';
                    validateSchedule(item);
                    validateAttendance(item);
                    if (item.price !== undefined) item.price = number(item.price, 'Valor da aula');
                    if (item.commissionVal !== undefined) item.commissionVal = number(item.commissionVal, 'Comissão da aula');
                    if (item.commissionPct !== undefined) item.commissionPct = number(item.commissionPct, 'Percentual da aula', 0, 100);
                }
                if (name === 'enrollments') {
                    if (!isDate(item.startDate) || !isDate(item.dueDate) || !['ativo', 'congelado', 'cancelado'].includes(item.status)) throw new Error('Matrícula inválida.');
                    if (item.history !== undefined && !Array.isArray(item.history)) throw new Error('Histórico da matrícula inválido.');
                    item.history = item.history || [];
                }
            }
        }
        validateCommerce(data);
        validateTraining(data);
        if(data.finance!==undefined||data.transactions.some(t=>t.finance!==undefined)){if(typeof FitFinanceRules==='undefined')throw new Error('Atualize os recursos financeiros antes de abrir esta base.');FitFinanceRules.validate(data);}
        if(data.assistant!==undefined||data.settings.assistant!==undefined){if(typeof FitAssistantRules==='undefined')throw new Error('Atualize os recursos do assistente antes de abrir esta base.');FitAssistantRules.validate(data);}
        if(data.settings.presentation!==undefined){if(typeof FitPersonalizationRules==='undefined')throw new Error('Atualize a apresentação antes de abrir esta base.');FitPersonalizationRules.validate(data);}
        const series=new Map();
        for(const a of data.appointments){const r=a.schedule?.recurrence;if(!r)continue;const signature=JSON.stringify([a.clientId,a.serviceId,a.proId,r.count,r.weekInterval,r.weekdays.slice().sort((a,b)=>a-b)]),previous=series.get(r.seriesId);
            if(previous&&(previous.signature!==signature||previous.indices.has(r.index)))throw new Error('Série de aulas duplicada ou incompatível.');
            if(previous)previous.indices.add(r.index);else series.set(r.seriesId,{signature,indices:new Set([r.index])});
        }
        for (const field of ['graceDays', 'dueSoonDays', 'inactivityDays']) data.settings[field] = number(data.settings[field] ?? defaults.settings[field], 'Prazo', 0, 3650);
        data.schemaVersion = version;
        data.system = 'gestao-fit';
        return data;
    }
    function inspect(data) {
        const sets = Object.fromEntries(collections.map(name => [name, new Set(data[name].map(item => item.id))]));
        const issues = [];
        const links = { appointments: { clientId: 'clients', proId: 'team', serviceId: 'services' }, enrollments: { studentId: 'clients', planId: 'services', instructorId: 'team' }, transactions: { clientId: 'clients', proId: 'team', serviceId: 'services', enrollmentId: 'enrollments', appointmentId: 'appointments' } };
        for (const [name, fields] of Object.entries(links)) for (const item of data[name]) {
            for (const [field, target] of Object.entries(fields)) if (item[field] && !sets[target].has(item[field])) issues.push({ collection: name, id: item.id, field, target });
            if (name === 'appointments' && !item.clientId) issues.push({ collection: name, id: item.id, field: 'clientId', target: 'clients' });
        }
        const professionalId=data.settings.professional?.primaryInstructorId;
        for(const a of data.appointments.filter(a=>a.status==='pending'&&a.billing?.mode==='contract')){
            const e=data.enrollments.find(e=>e.id===a.billing.enrollmentId),p=e?.commercial?.periods.find(p=>p.id===a.billing.periodId);
            if(p&&(a.date<p.startDate||a.date>=p.endDate||(e.commercial.pauses||[]).some(p=>p.from<=a.date&&p.to&&a.date<p.to)))issues.push({collection:'appointments',id:a.id,field:'billing.period (conferir data após pausa)',target:'enrollments'});
        }
        if(professionalId&&!sets.team.has(professionalId))issues.push({collection:'settings',id:'professional',field:'primaryInstructorId',target:'team'});
        const counts=Object.fromEntries(collections.map(name => [name,data[name].length]));if(data.training){counts.trainingExercises=data.training.exercises.length;counts.trainingPrograms=data.training.programs.length;counts.trainingVersions=data.training.programs.reduce((sum,p)=>sum+p.versions.length,0);counts.trainingSessions=(data.training.sessions||[]).length;counts.trainingSessionRevisions=(data.training.sessions||[]).reduce((sum,s)=>sum+s.revisions.length,0);counts.trainingSessionsVoided=(data.training.sessions||[]).filter(s=>s.voided).length;}if(data.finance){counts.financeAccounts=data.finance.accounts.length;counts.financeAdjustments=data.finance.adjustments.length;counts.financeRecurrences=data.finance.recurrences.length;counts.financeReconciliations=data.finance.reconciliations.length;}if(data.assistant)counts.assistantContacts=data.assistant.contacts.length;return {counts,issues};
    }
    return { version, collections, normalize, inspect, clone, isDate, dateKey, formatDate, validateStudent, studentText, intakeText, measures, validTime, minutes, validateAvailability, validateSchedule, validateScheduleSettings, validateTraining };
})();
