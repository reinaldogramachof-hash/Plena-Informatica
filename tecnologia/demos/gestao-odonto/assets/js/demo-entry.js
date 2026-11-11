/* Entradas da vitrine comercial, disponíveis somente na demonstração. */
(function (root) {
    function open(search, api) {
        const view = new URLSearchParams(search).get('view');
        if (!['schedule', 'patients', 'financial'].includes(view)) return false;
        if (view === 'patients') {
            if (typeof api.openPatient === 'function' && api.openPatient('pat_1') !== false) return true;
        }
        if (api.navigate(view) === false) return false;
        return true;
    }
    const entry = { open };
    if (typeof module !== 'undefined' && module.exports) module.exports = entry;
    else root.OdontoDemoEntry = entry;
})(globalThis);
