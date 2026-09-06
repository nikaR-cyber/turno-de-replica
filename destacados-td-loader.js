// destacados-td-loader.js — rellena los 5 huecos destacados de la-trama-y-el-drama.html
// tirando del campo "Destacada (franja superior)" de las entradas de La Trama y El Drama.
(function () {
  var SLOTS = {
    'Hoy está ardiendo': 'td-slot-ardiendo',
    'Todo el mundo está hablando de...': 'td-slot-hablando',
    'El debate': 'td-slot-debate',
    'Lo que viene': 'td-slot-viene',
    'El salseo de la semana': 'td-slot-salseo'
  };

  document.addEventListener('DOMContentLoaded', function () {
    if (!document.getElementById('td-slot-ardiendo')) return; // no estamos en la portada

    Promise.all([
      ctFetchJSON('content/trama-y-drama.json').then(function (d) { return tagSource(d.entries, 'trama-detalle.html'); }).catch(function () { return []; }),
      ctFetchJSON('content/club-de-la-trama-y-el-drama.json').then(function (d) { return tagSource(d.entries, 'drama-detalle.html'); }).catch(function () { return []; })
    ]).then(function (results) {
      var all = ctPublishedSorted(results[0].concat(results[1]));
      Object.keys(SLOTS).forEach(function (label) {
        var match = all.find(function (e) { return e.featured_banner === label; });
        if (!match) return; // sin ninguna marcada para este hueco: se deja el contenido de ejemplo
        var el = document.getElementById(SLOTS[label]);
        if (!el) return;
        el.href = match._detailPage + '?i=' + match._index;
        var p = el.querySelector('p');
        if (p) p.textContent = match.title || '';
      });
    });
  });

  function tagSource(entries, detailPage) {
    return (entries || []).map(function (e, i) {
      var copy = Object.assign({}, e);
      copy._index = i;
      copy._detailPage = detailPage;
      return copy;
    });
  }
})();
