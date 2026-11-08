/* Contrato local da Terapia. Não contém dados de demonstração. */
const TherapyData = (() => {
    const collections = ['patients','appointments','treatments','sessions','sessionDrafts','assessments','prescriptions','emergencies','financial','packages','packageMovements','documents'];
    function normalize(source, defaults, strict = false, legacy = null) {
        if (!source || typeof source !== 'object' || Array.isArray(source)) throw new Error('Arquivo de dados inválido.');
        if (source.system && source.system !== 'gestao-terapia') throw new Error('O arquivo pertence a outro sistema.');
        if(source.settings!==undefined&&(!source.settings||typeof source.settings!=='object'||Array.isArray(source.settings)))throw new Error('Configurações inválidas.');
        if (strict && (!Array.isArray(source.patients) || !Array.isArray(source.appointments) || !source.settings || !Array.isArray(source.sessions))) throw new Error('Este arquivo não é um backup da Terapia.');
        const data = JSON.parse(JSON.stringify({...defaults, ...source, settings:{...defaults.settings,...source.settings}}));
        if(data.settings.coverage!==undefined)data.settings.coverage=TherapyCoverageRules.settings(data.settings.coverage);
        if(data.settings.agenda!==undefined)data.settings.agenda=TherapyAgendaRules.normalize(data.settings.agenda);
        if(data.settings.security!==undefined)data.settings.security=TherapySystemRules.security(data.settings.security);
        if(data.settings.assistant!==undefined){if(typeof TherapyAssistantRules==='undefined')throw new Error('Atualize o sistema para abrir as preferências do assistente.');data.settings.assistant=TherapyAssistantRules.settings(data.settings.assistant);}
        for (const name of collections) {
            if (source[name] !== undefined && !Array.isArray(source[name])) throw new Error('Coleção inválida: '+name);
            data[name] = data[name] || [];
            const ids = new Set();
            for (const item of data[name]) {
                if (!item || typeof item !== 'object' || typeof item.id !== 'string' || !/^[a-zA-Z0-9_-]+$/.test(item.id) || ids.has(item.id)) throw new Error('Registro inválido ou repetido: '+name);
                ids.add(item.id);
                if (name === 'patients' && (typeof item.name !== 'string' || !item.name.trim())) throw new Error('Paciente sem nome.');
                if(item.coverage!==undefined){
                    if(name==='patients'){
                        item.coverage=TherapyCoverageRules.preference(item.coverage);
                        if(item.coverage.kind==='insurance'&&!TherapyCoverageRules.read(data).plans.some(p=>p.id===item.coverage.planId))throw new Error('Convênio do paciente não encontrado no backup.');
                    }else item.coverage=TherapyCoverageRules.validate(item.coverage);
                }
                if(name==='patients'&&item.crm!==undefined)item.crm=TherapyPatientRules.normalize(item.crm);
                if(name==='documents')TherapyDocumentRules.validate(item);
                if(name==='sessions')TherapySessionRules.validateHistory(item);
                if(name==='assessments'&&item.evaluation!==undefined)TherapyAssessmentRules.validate(item);
                if(name==='prescriptions'&&item.guidance!==undefined)TherapyGuidanceRules.meta(item.guidance);
                if(name==='treatments'&&item.plan!==undefined)TherapyTreatmentRules.plan(item.plan);
                if(['financial','packages'].includes(name)&&item.managementHistory!==undefined)TherapyManagementRules.history(item);
                if(name==='sessionDrafts')Object.assign(item,TherapySessionRules.draft(item));
                if (name === 'financial' && (item.amount===null||item.amount===''||!Number.isFinite(Number(item.amount)) || Number(item.amount) < 0 || !['income','expense'].includes(item.type))) throw new Error('Lançamento financeiro inválido.');
                if(name==='appointments'&&item.meetUrl!==undefined){if(typeof TherapyExternalRules==='undefined')throw new Error('Atualize o sistema para abrir links de videochamada.');item.meetUrl=TherapyExternalRules.meet(item.meetUrl);}
                if(name==='appointments'&&item.duration===undefined)item.duration=Number(data.settings.sessionDuration)||50;
                if (name === 'appointments' && (!/^\d{4}-\d{2}-\d{2}$/.test(item.date || '') || !/^\d{2}:\d{2}$/.test(item.time || '') || !Number.isFinite(Number(item.duration)) || Number(item.duration)<=0)) throw new Error('Agendamento inválido.');
                if(name==='appointments'&&(Number(item.time.slice(0,2))>23||Number(item.time.slice(3))>59||dateKey(new Date(item.date+'T12:00:00'))!==item.date))throw new Error('Data ou horário inválido.');
                if(name==='packages'&&(!Number.isInteger(item.totalSessions)||item.totalSessions<1||!Number.isFinite(Number(item.amount))||Number(item.amount)<0))throw new Error('Pacote inválido.');
                if(name==='packageMovements'&&(!Number.isInteger(item.quantity)||item.quantity<1))throw new Error('Consumo de pacote inválido.');
            }
        }
        if(data.documents.length)TherapyDocumentRules.validateAll(data);
        if(legacy&&legacy!==true&&(legacy.documents?.length||data.documents.length))TherapyDocumentRules.guard(legacy.documents,data.documents);
        const patients=new Set(data.patients.map(p=>p.id));
        for(const name of collections.filter(name=>!['patients','packageMovements'].includes(name))){
            for(const item of data[name]){
                // Registros antigos já presentes no cofre podem ser lidos e preservados,
                // mas arquivos importados e registros novos precisam ser consistentes.
                const unchanged=legacy===true||legacy&&legacy[name]?.some(old=>old.id===item.id&&JSON.stringify(old)===JSON.stringify(item));
                if(unchanged)continue;
                const hasPatient=item.patientId!==undefined&&item.patientId!==null&&item.patientId!=='';
                if(!['financial','packages'].includes(name)&&!hasPatient||hasPatient&&(typeof item.patientId!=='string'||!patients.has(item.patientId)))throw new Error('Registro sem paciente válido: '+name+'. Nenhum dado foi substituído.');
                const care=name==='assessments'?item.evaluation?.care:name==='prescriptions'?item.guidance?.care:null;
                if(care)for(const [key,collection]of [['sessionId','sessions'],['treatmentId','treatments']]){const linked=data[collection].find(record=>record.id===care[key]);if(linked&&linked.patientId!==item.patientId)throw new Error('Vínculo de acompanhamento pertence a outro paciente. Nenhum dado foi substituído.');}
                if(name==='sessions'&&item.evolution?.treatmentId){const linked=data.treatments.find(plan=>plan.id===item.evolution.treatmentId);if(linked&&linked.patientId!==item.patientId)throw new Error('O plano da sessão pertence a outro paciente.');}
                if(name==='emergencies')validateEmergency(item);
            }
        }
        const sessions=new Set();
        for(const movement of data.packageMovements){const pack=data.packages.find(p=>p.id===movement.packageId),session=data.sessions.find(s=>s.id===movement.sessionId);if(!pack||!session||pack.patientId&&session.patientId&&pack.patientId!==session.patientId||sessions.has(movement.sessionId))throw new Error('Consumo sem pacote ou sessão válida do mesmo paciente, ou repetido.');sessions.add(movement.sessionId);}
        for(const pack of data.packages)if(data.packageMovements.filter(m=>m.packageId===pack.id).reduce((sum,m)=>sum+m.quantity,0)>pack.totalSessions)throw new Error('O consumo excede o saldo do pacote.');
        return data;
    }
    function dateKey(value = new Date()) {
        if (typeof value === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(value)) return value;
        const d = new Date(value);
        return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
    }
    function dateTimeLocal(){const d=new Date();return dateKey(d)+'T'+String(d.getHours()).padStart(2,'0')+':'+String(d.getMinutes()).padStart(2,'0');}
    const emergencyTypes={suicidio:'Risco de Suicídio',autoagressao:'Autoagressão',crise_ansiedade:'Crise de Ansiedade',crise_panico:'Crise de Pânico',psicose:'Episódio Psicótico',mania:'Episódio Maníaco',depressao:'Crise Depressiva',agressao:'Agressão a Outros'};
    function validateEmergency(item){
        const date=item.date,day=typeof date==='string'?date.slice(0,10):'';
        const validDay=/^\d{4}-\d{2}-\d{2}$/.test(day)&&dateKey(new Date(day+'T12:00:00'))===day;
        const validTime=typeof date==='string'&&/^\d{4}-\d{2}-\d{2}(?:T\d{2}:\d{2}(?::\d{2}(?:\.\d{1,3})?)?(?:Z|[+-]\d{2}:\d{2})?)?$/.test(date)&&Number.isFinite(Date.parse(date))&&(date.length===10||Number(date.slice(11,13))<24&&Number(date.slice(14,16))<60);
        if(!Object.hasOwn(emergencyTypes,item.type)||!['baixo','medio','alto'].includes(item.riskLevel)||typeof item.intervention!=='string'||!item.intervention.trim()||item.intervention.length>20000||item.referrals!=null&&(typeof item.referrals!=='string'||item.referrals.length>20000)||!validDay||!validTime||item.duration!=null&&(!Number.isInteger(item.duration)||item.duration<0||item.duration>1440))throw new Error('Emergência inválida: confira tipo, risco, intervenção, data e duração de 0 a 1440 minutos.');
        return item;
    }
    return {normalize, dateKey, dateTimeLocal, collections,emergencyTypes,validateEmergency};
})();
