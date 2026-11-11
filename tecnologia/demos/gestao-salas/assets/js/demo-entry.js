/* Entradas da vitrine comercial, disponíveis somente na demonstração. */
(function (root) {
    function open(search, api) {
        const view = new URLSearchParams(search).get('view');
        if (!['bookings', 'vistoria', 'finances'].includes(view)) return false;
        if (view === 'bookings') {
            if (api.navigate('bookings') === false) return false;
            if (typeof api.showGrid === 'function') api.showGrid();
            return true;
        }
        if (view === 'vistoria') {
            if (api.navigate('bookings') === false) return false;
            if (typeof api.openVistoria === 'function') api.openVistoria('bk_001');
            return true;
        }
        if (api.navigate(view) === false) return false;
        return true;
    }
    const entry = { open };
    if (typeof module !== 'undefined' && module.exports) module.exports = entry;
    else root.SalasDemoEntry = entry;
})(globalThis);
