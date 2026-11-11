/* Entradas da vitrine comercial, disponíveis somente na demonstração. */
(function (root) {
    function open(search, api) {
        const view = new URLSearchParams(search).get('view');
        if (!['schedule', 'patients', 'financial'].includes(view)) return false;
        if (api.navigate(view) === false) return false;
        if (view === 'patients') api.openPatient('demo_patient_13');
        return true;
    }
    const entry = { open };
    if (typeof module !== 'undefined' && module.exports) module.exports = entry;
    else root.TherapyDemoEntry = entry;
})(globalThis);
