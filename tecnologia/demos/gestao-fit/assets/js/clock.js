/* Data e hora do computador, sem consulta externa nem acesso aos dados. */
const FitClock = (() => {
    let timer;
    const dateFormat=new Intl.DateTimeFormat('pt-BR',{weekday:'short',day:'2-digit',month:'2-digit',year:'numeric'});
    const timeFormat=new Intl.DateTimeFormat('pt-BR',{hour:'2-digit',minute:'2-digit',hour12:false});
    function update(now=new Date()){
        const node=document.getElementById('fit-app-clock');if(!node)return;
        node.dateTime=now.toISOString();
        const date=document.getElementById('fit-app-date'),time=document.getElementById('fit-app-time');
        if(date)date.textContent=dateFormat.format(now);if(time)time.textContent=timeFormat.format(now);
    }
    function setup(){if(timer)return;update();timer=setInterval(update,15000);}
    document.addEventListener('DOMContentLoaded',setup);
    document.addEventListener('visibilitychange',()=>{if(!document.hidden)update();});
    document.addEventListener('fullscreenchange',()=>update());
    return {update};
})();
