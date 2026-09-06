// drama-loader.js — rellena el-drama.html con las entradas reales de content/club-de-la-trama-y-el-drama.json
(function () {
  var JSON_PATH = 'content/club-de-la-trama-y-el-drama.json';

  document.addEventListener('DOMContentLoaded', function () {
    var grid = document.getElementById('lt-grid');
    if (!grid) return;

    ctFetchJSON(JSON_PATH)
      .then(function (data) {
        var entries = ctPublishedSorted(data.entries);
        if (!entries.length) return;
        grid.innerHTML = '';
        entries.forEach(function (e) {
          grid.appendChild(buildCard(e));
        });
      })
      .catch(function (err) {
        console.warn('drama-loader.js: usando contenido de respaldo,', err.message);
      });
  });

  function buildCard(e) {
    var a = document.createElement('a');
    a.className = 'td-card';
    a.href = 'drama-detalle.html?i=' + e._index;
    a.style.textDecoration = 'none';
    a.style.color = 'inherit';
    a.style.display = 'block';

    var img = document.createElement('div');
    img.className = 'td-card-img';
    if (e.image) {
      img.style.backgroundImage = 'url(' + e.image + ')';
      img.style.backgroundSize = 'cover';
      img.style.backgroundPosition = 'center';
    } else {
      img.style.background = '#E7B8C4';
    }
    a.appendChild(img);

    var badge = document.createElement('span');
    badge.className = 'td-badge drama';
    badge.textContent = e.eyebrow || '';
    a.appendChild(badge);

    var h4 = document.createElement('h4');
    h4.textContent = e.title || '';
    a.appendChild(h4);

    var meta = document.createElement('p');
    meta.className = 'td-meta';
    var parts = [];
    if (e.date) parts.push(ctFormatDate(e.date));
    if (e.author) parts.push('Por ' + e.author);
    meta.textContent = parts.join(' · ');
    a.appendChild(meta);

    return a;
  }
})();
