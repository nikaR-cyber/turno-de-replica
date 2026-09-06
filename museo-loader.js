// museo-loader.js — rellena museo-literario.html con las entradas reales de content/museo-literario.json
(function () {
  var JSON_PATH = 'content/museo-literario.json';

  document.addEventListener('DOMContentLoaded', function () {
    var grid = document.getElementById('ml-recientes');
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
        console.warn('museo-loader.js: usando contenido de respaldo,', err.message);
      });
  });

  function buildCard(e) {
    var a = document.createElement('a');
    a.className = 'tl-card';
    a.href = 'museo-detalle.html?i=' + e._index;
    a.style.textDecoration = 'none';
    a.style.color = 'inherit';
    a.style.display = 'block';

    var img = document.createElement('div');
    img.className = 'tl-card-img';
    if (e.image) {
      img.style.backgroundImage = 'url(' + e.image + ')';
      img.style.backgroundSize = 'cover';
      img.style.backgroundPosition = 'center';
    }
    a.appendChild(img);

    var badge = document.createElement('span');
    badge.className = 'td-badge trama';
    badge.textContent = e.eyebrow || '';
    a.appendChild(badge);

    var h4 = document.createElement('h4');
    h4.textContent = e.title || '';
    a.appendChild(h4);

    var desc = document.createElement('p');
    desc.className = 'tl-desc';
    desc.textContent = e.text || '';
    a.appendChild(desc);

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
