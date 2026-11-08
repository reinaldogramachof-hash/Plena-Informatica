// Relógio do dispositivo; não consulta serviços externos nem altera registros.
(() => {
    let dateNode, timeNode, dateFormat, timeFormat, offset;
    function formats() {
        dateFormat = new Intl.DateTimeFormat('pt-BR', {weekday:'short', day:'2-digit', month:'2-digit', year:'numeric'});
        timeFormat = new Intl.DateTimeFormat('pt-BR', {hour:'2-digit', minute:'2-digit', second:'2-digit', hourCycle:'h23'});
    }
    function render(refresh = false) {
        if (document.hidden || !dateNode || !timeNode) return;
        const now = new Date();
        if (refresh || offset !== now.getTimezoneOffset()) { formats(); offset = now.getTimezoneOffset(); }
        const date = dateFormat.format(now), time = timeFormat.format(now);
        if (dateNode.textContent !== date) {
            dateNode.textContent = date;
            dateNode.dateTime = now.getFullYear() + '-' + String(now.getMonth()+1).padStart(2,'0') + '-' + String(now.getDate()).padStart(2,'0');
        }
        if (timeNode.textContent !== time) { timeNode.textContent = time; timeNode.dateTime = now.toISOString(); }
    }
    document.addEventListener('DOMContentLoaded', () => {
        dateNode = document.getElementById('therapy-header-date');
        timeNode = document.getElementById('therapy-header-time');
        render(true);
        setInterval(render, 1000);
        document.addEventListener('visibilitychange', () => render(true));
        document.addEventListener('fullscreenchange', () => render(true));
        window.addEventListener('focus', () => render(true));
        window.addEventListener('pageshow', () => render(true));
    });
})();
