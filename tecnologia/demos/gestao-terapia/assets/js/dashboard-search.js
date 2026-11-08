/* Busca local de identificação; o histórico é aberto na ficha existente. */
const TherapyDashboardSearch = (() => {
    const el=id=>document.getElementById('dashboard-search-'+id);
    let rows=[],selected=-1,timer;
    const ready=()=>typeof TherapyVault!=='undefined'&&TherapyVault.isOpen()&&!document.getElementById('view-dashboard').classList.contains('hide');
    function close(){clearTimeout(timer);timer=null;el('popup').hidden=true;el('input').setAttribute('aria-expanded','false');el('input').removeAttribute('aria-activedescendant');}
    function reset(){close();rows=[];selected=-1;el('input').value='';el('archived').checked=false;el('clear').hidden=true;el('results').replaceChildren();el('status').textContent='';el('selected').textContent='';el('actions').hidden=true;}
    function select(index,scroll=false){
        if(!rows.length)return;
        selected=index;
        const options=[...el('results').children];options.forEach((node,i)=>node.setAttribute('aria-selected',String(i===index)));
        el('input').setAttribute('aria-activedescendant',options[index].id);
        el('selected').textContent='Selecionado: '+rows[index].name;
        el('actions').querySelector('[data-search-action=schedule]').disabled=!!rows[index].archived;
        if(scroll)options[index].scrollIntoView({block:'nearest'});
    }
    function render(){
        clearTimeout(timer);timer=null;if(!ready())return reset();
        const R=TherapyPatientRules,query=R.fold(el('input').value).trim(),tokens=query.split(/\s+/),digits=R.phone(query);
        el('clear').hidden=!el('input').value;el('results').replaceChildren();el('actions').hidden=true;
        rows=[];selected=-1;el('input').removeAttribute('aria-activedescendant');
        el('popup').hidden=false;el('input').setAttribute('aria-expanded','true');
        if(query.length<2){el('status').textContent='Digite pelo menos 2 caracteres do nome, telefone ou e-mail.';return;}
        const matches=db.patients.filter(patient=>{
            if(patient.archived&&!el('archived').checked)return false;
            const identity=R.fold([patient.name,patient.crm?.preferredName,patient.phone,patient.email].join(' '));
            return tokens.every(token=>identity.includes(token))||digits.length>=3&&R.phone(patient.phone).includes(digits);
        }).sort((a,b)=>{
            const score=p=>R.fold(p.name)===query||R.fold(p.crm?.preferredName)===query?0:R.fold(p.name).startsWith(query)?1:2;
            return score(a)-score(b)||a.name.localeCompare(b.name,'pt-BR');
        });
        rows=matches.slice(0,6);
        el('status').textContent=matches.length?(matches.length===1?'1 paciente encontrado':matches.length+' pacientes encontrados')+(matches.length>6?' · exibindo 6; refine a busca.':'.'):'Nenhum paciente encontrado. Confira o termo ou inclua os arquivados.';
        rows.forEach((patient,index)=>{
            const option=document.createElement('button');option.type='button';option.tabIndex=-1;option.id='dashboard-search-option-'+index;
            option.className='dashboard-search-result';option.dataset.searchIndex=String(index);option.setAttribute('role','option');
            const name=document.createElement('strong'),contact=document.createElement('small');
            name.textContent=patient.crm?.preferredName?patient.crm.preferredName+' · '+patient.name:patient.name;
            contact.textContent=[patient.phone,patient.email,patient.archived?'Arquivado':''].filter(Boolean).join(' · ')||'Contato não informado';
            option.append(name,contact);el('results').appendChild(option);
        });
        el('actions').hidden=!rows.length;if(rows.length)select(0);
    }
    function open(action='overview',index=selected){
        if(!ready())return reset();
        const patient=rows[index];if(!patient||!db.patients.some(p=>p.id===patient.id))return;
        if(action==='schedule'){
            if(patient.archived)return;
            const id=patient.id;reset();TherapyPatients.schedule(id);return;
        }
        const id=patient.id;reset();TherapyPatients.open(id);
        if(action==='timeline')TherapyPatients.tab('timeline');
    }
    function boot(){
        const root=document.getElementById('dashboard-search'),input=el('input');
        input.addEventListener('input',()=>{close();rows=[];selected=-1;el('results').replaceChildren();el('actions').hidden=true;el('clear').hidden=!input.value;timer=setTimeout(render,120);});
        input.addEventListener('focus',render);el('archived').addEventListener('change',render);
        el('clear').addEventListener('click',()=>{reset();input.focus();});
        root.addEventListener('click',event=>{
            const option=event.target.closest('[data-search-index]'),action=event.target.closest('[data-search-action]');
            if(option)open('overview',Number(option.dataset.searchIndex));else if(action)open(action.dataset.searchAction);
        });
        root.addEventListener('keydown',event=>{
            if(event.isComposing)return;
            if(event.key==='Escape'){event.preventDefault();event.stopPropagation();const wasClosed=el('popup').hidden;input.focus({preventScroll:true});if(wasClosed)reset();else close();return;}
            if(event.target!==input)return;
            if(['ArrowDown','ArrowUp'].includes(event.key)){
                event.preventDefault();const wasClosed=el('popup').hidden;if(wasClosed)render();
                if(rows.length)select(wasClosed?(event.key==='ArrowDown'?0:rows.length-1):(selected+(event.key==='ArrowDown'?1:-1)+rows.length)%rows.length,true);
            } else if(event.key==='Enter'){event.preventDefault();if(timer)render();if(!el('popup').hidden&&rows.length)open();}
        });
        root.addEventListener('focusout',event=>{if(!root.contains(event.relatedTarget))close();});
        document.addEventListener('pointerdown',event=>{if(!root.contains(event.target))close();});
        document.addEventListener('therapy-vault-locked',reset);
        new MutationObserver(()=>{if(!ready())reset();}).observe(document.getElementById('view-dashboard'),{attributes:true,attributeFilter:['class']});
    }
    document.addEventListener('DOMContentLoaded',boot);
    return {reset};
})();
