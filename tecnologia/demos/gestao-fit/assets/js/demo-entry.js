(function (root, factory) {
  if (typeof module === 'object' && module.exports) {
    module.exports = factory();
  } else {
    root.FitDemoEntry = factory();
  }
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  'use strict';

  var DEMO_STUDENT_ID = 'cli-01';
  var ALLOWED_VIEWS = [
    'dashboard',
    'schedule',
    'clients',
    'training',
    'services',
    'finance',
    'assistant',
    'reports',
    'settings',
    'profile',
    'instructions',
    'about',
  ];

  function resolveRoute(search) {
    var params = new URLSearchParams(search || '');
    var requested = params.get('view');
    if (!requested || ALLOWED_VIEWS.indexOf(requested) === -1) return null;

    if (requested === 'clients') {
      return { view: 'clients', studentId: DEMO_STUDENT_ID };
    }

    return { view: requested, studentId: null };
  }

  function open(search, actions) {
    var route = resolveRoute(search);
    if (!route || !actions || typeof actions.navigate !== 'function') return false;

    actions.navigate(route.view);
    if (route.studentId && typeof actions.openStudent === 'function') {
      actions.openStudent(route.studentId);
    }
    return true;
  }

  return {
    DEMO_STUDENT_ID: DEMO_STUDENT_ID,
    resolveRoute: resolveRoute,
    open: open,
  };
});
