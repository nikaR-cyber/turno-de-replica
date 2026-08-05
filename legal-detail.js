(function () {
  "use strict";

  var container = document.querySelector("[data-legal-detail]");
  if (!container) return;

  var src = container.getAttribute("data-content-source");
  var params = new URLSearchParams(window.location.search);
  var slug = params.get("slug");

  function escapeHtml(str) {
    var div = document.createElement("div");
    div.textContent = str;
    return div.innerHTML;
  }

  function showNotFound() {
    container.innerHTML =
      '<div class="empty-state">' +
      "<p>No hemos encontrado este documento, o todavía no está publicado.</p>" +
      '<p><a href="index.html">← Volver al Inicio</a></p>' +
      "</div>";
  }

  if (!src || !slug) {
    showNotFound();
    return;
  }

  fetch(src, { cache: "no-store" })
    .then(function (res) {
      if (!res.ok) throw new Error("No se pudo cargar el contenido");
      return res.json();
    })
    .then(function (data) {
      var entries = data && Array.isArray(data.entries) ? data.entries : [];
      var doc = entries.find(function (e) {
        return e.slug === slug && e.active !== false;
      });

      if (!doc) {
        showNotFound();
        return;
      }

      document.title = doc.title + " · Turno de Réplica";

      var metaBits = [];
      if (doc.version) metaBits.push("Versión " + doc.version);
      if (doc.effective_date) metaBits.push("En vigor desde " + doc.effective_date);

      var paragraphs = (doc.content || "")
        .split(/\n{2,}/)
        .map(function (p) { return p.trim(); })
        .filter(Boolean)
        .map(function (p) { return "<p>" + escapeHtml(p) + "</p>"; })
        .join("");

      var html = "";
      html += '<a class="back-home" href="index.html">← Volver al Inicio</a>';
      html += '<article class="entry-detail">';
      html += "<h1>" + escapeHtml(doc.title) + "</h1>";
      if (metaBits.length) {
        html += '<p class="entry-detail-meta">' + escapeHtml(metaBits.join(" · ")) + "</p>";
      }
      html += '<div class="entry-detail-body">' + paragraphs + "</div>";
      html += "</article>";

      container.innerHTML = html;
    })
    .catch(showNotFound);
})();
