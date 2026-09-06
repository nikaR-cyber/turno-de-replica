// corcho-loader.js — rellena el-corcho.html con los anuncios reales de content/el-corcho.json
(function () {
  var JSON_PATH = 'content/el-corcho.json';

  document.addEventListener('DOMContentLoaded', function () {
    var grid = document.getElementById('corcho-grid');
    if (!grid) return;

    ctFetchJSON(JSON_PATH)
      .then(function (data) {
        var entries = ctPublishedSorted(data.entries);
        if (!entries.length) return; // sin anuncios activados: se deja el contenido de ejemplo
        grid.innerHTML = '';
        entries.forEach(function (e) {
          grid.appendChild(buildCard(e));
        });
      })
      .catch(function (err) {
        console.warn('corcho-loader.js: usando contenido de ejemplo,', err.message);
      });
  });

  function buildCard(e) {
    var a = document.createElement('a');
    a.className = 'corcho-card';
    a.href = 'corcho-detalle.html?i=' + e._index;
    a.style.textDecoration = 'none';
    a.style.color = 'inherit';
    a.style.display = 'block';

    var tag = document.createElement('span');
    tag.className = 'corcho-tag';
    tag.textContent = e.category || '';
    a.appendChild(tag);

    var h3 = document.createElement('h3');
    h3.textContent = e.title || '';
    a.appendChild(h3);

    var p = document.createElement('p');
    p.textContent = e.message || '';
    a.appendChild(p);

    var meta = document.createElement('div');
    meta.className = 'corcho-meta';
    var span1 = document.createElement('span');
    span1.textContent = e.author || '';
    var span2 = document.createElement('span');
    span2.textContent = ctFormatDate(e.date);
    meta.appendChild(span1);
    meta.appendChild(span2);
    a.appendChild(meta);

    return a;
  }
})();
