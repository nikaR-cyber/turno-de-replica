// destacados-td-loader.js — rellena los 5 huecos destacados de la-trama-y-el-drama.html
// tirando del campo "Destacada (franja superior)" de content/trama-y-drama.json.
(function () {
  var JSON_PATH = 'content/trama-y-drama.json';

  var CATEGORIAS_DRAMA = [
    '☕ El Salseo Literario', '🔥 Arde BookTok', '👀 ¿Pero qué ha pasado aquí?',
    '⚔️ Guerra de Fandoms', '💀 Opiniones que nadie pidió', '🚩 Red Flags literarias',
    '💚 Green Flags', '🫣 Confesionario lector', '⚖️ Se abre el debate',
    '📢 La sentencia de la semana', '🗣️ ¿Soy la única?'
  ];

  var SLOTS = {
    'Hoy está ardiendo': 'td-slot-ardiendo',
    'Todo el mundo está hablando de...': 'td-slot-hablando',
    'El debate': 'td-slot-debate',
    'Lo que viene': 'td-slot-viene',
    'El salseo de la semana': 'td-slot-salseo'
  };

  document.addEventListener('DOMContentLoaded', function () {
    if (!document.getElementById('td-slot-ardiendo')) return; // no estamos en la portada

    ctFetchJSON(JSON_PATH).then(function (data) {
      var all = ctPublishedSorted(data.entries);
      Object.keys(SLOTS).forEach(function (label) {
        var match = all.find(function (e) { return e.featured_banner === label; });
        if (!match) return; // sin ninguna marcada para este hueco: se deja el contenido de ejemplo
        var esDrama = CATEGORIAS_DRAMA.indexOf(match.eyebrow) !== -1;
        var detailPage = esDrama ? 'drama-detalle.html' : 'trama-detalle.html';
        var el = document.getElementById(SLOTS[label]);
        if (!el) return;
        el.href = detailPage + '?i=' + match._index;
        var p = el.querySelector('p');
        if (p) p.textContent = match.title || '';
      });
    }).catch(function (err) {
      console.warn('destacados-td-loader.js:', err.message);
    });
  });
})();
