(function () {
  "use strict";

  var grid = document.querySelector(".content-grid[data-content-source]");
  if (!grid) return;

  var src = grid.getAttribute("data-content-source");

  fetch(src, { cache: "no-store" })
    .then(function (res) {
      if (!res.ok) throw new Error("No se pudo cargar el contenido");
      return res.json();
    })
    .then(function (data) {
      var entries = data && Array.isArray(data.entries) ? data.entries : [];
      if (!entries.length) return; // si aún no hay entradas, se dejan las tarjetas de ejemplo

      grid.innerHTML = "";

      entries.forEach(function (entry) {
        var article = document.createElement("article");
        article.className = "content-item";

        var eyebrow = document.createElement("span");
        eyebrow.className = "eyebrow";
        eyebrow.textContent = entry.eyebrow || "";

        var h3 = document.createElement("h3");
        h3.textContent = entry.title || "";

        var p = document.createElement("p");
        p.textContent = entry.text || "";

        article.appendChild(eyebrow);
        article.appendChild(h3);
        article.appendChild(p);
        grid.appendChild(article);
      });
    })
    .catch(function () {
      // si falla la carga, se mantienen las tarjetas de ejemplo ya presentes en el HTML
    });
})();
