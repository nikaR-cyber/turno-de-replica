(function () {
  "use strict";

  var container = document.querySelector("[data-entry-detail]");
  if (!container) return;

  var src = container.getAttribute("data-content-source");
  var listPage = container.getAttribute("data-list-page");
  var params = new URLSearchParams(window.location.search);
  var slug = params.get("slug");

  function escapeHtml(str) {
    var div = document.createElement("div");
    div.textContent = str;
    return div.innerHTML;
  }

  // convierte texto plano con la sintaxis ![alt](url) y [texto](url) en HTML seguro
  function renderBody(bodyText) {
    var paragraphs = bodyText
      .split(/\n{2,}/)
      .map(function (p) { return p.trim(); })
      .filter(Boolean);

    return paragraphs
      .map(function (raw) {
        var imageMatch = raw.match(/^!\[([^\]]*)\]\(([^)]+)\)$/);
        if (imageMatch) {
          return (
            '<img class="entry-body-image" src="' +
            escapeHtml(imageMatch[2]) +
            '" alt="' +
            escapeHtml(imageMatch[1]) +
            '" loading="lazy">'
          );
        }
        var escaped = escapeHtml(raw);
        var withLinks = escaped.replace(
          /\[([^\]]+)\]\((https?:\/\/[^)]+)\)/g,
          '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>'
        );
        return "<p>" + withLinks + "</p>";
      })
      .join("");
  }

  function showNotFound() {
    container.innerHTML =
      '<div class="empty-state">' +
      "<p>No hemos encontrado esta entrada.</p>" +
      "<p><a href=\"" + listPage + "\">← Volver a la sección</a></p>" +
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
      var entry = entries.find(function (e) {
        return window.TdRSlug.entrySlug(e) === slug && e.published !== false;
      });

      if (!entry) {
        showNotFound();
        return;
      }

      document.title = entry.title + " · Turno de Réplica";

      var metaLine = [entry.author, entry.date].filter(Boolean).join(" · ");
      var bodyText = entry.body || entry.text || "";

      var html = "";
      html += '<a class="back-home" href="' + listPage + '">← Volver a la sección</a>';
      html += '<article class="entry-detail">';
      if (entry.image) {
        html += '<img class="entry-detail-image" src="' + escapeHtml(entry.image) + '" alt="">';
        if (entry.image_credit) {
          var creditText = escapeHtml(entry.image_credit);
          html += '<p class="entry-image-credit">' +
            (entry.image_credit_url
              ? '<a href="' + escapeHtml(entry.image_credit_url) + '" target="_blank" rel="noopener noreferrer">' + creditText + "</a>"
              : creditText) +
            "</p>";
        }
      }
      var badgeRow = "";
      if (entry.eyebrow) {
        badgeRow += '<span class="badge badge-rose">' + escapeHtml(entry.eyebrow) + "</span>";
      }
      if (entry.featured) {
        badgeRow += '<span class="featured-badge featured-badge-detail">★ Destacada</span>';
      }
      if (badgeRow) html += '<div class="entry-detail-badges">' + badgeRow + "</div>";

      html += "<h1>" + escapeHtml(entry.title) + "</h1>";
      if (entry.subtitle) {
        html += '<p class="entry-detail-subtitle">' + escapeHtml(entry.subtitle) + "</p>";
      }
      if (metaLine) {
        html += '<p class="entry-detail-meta">' + escapeHtml(metaLine) + "</p>";
      }
      html += '<div class="entry-detail-body">';
      html += bodyText.trim()
        ? renderBody(bodyText)
        : "<p>Próximamente. Esta historia está preparando su contenido completo.</p>";
      html += "</div>";

      if (Array.isArray(entry.links) && entry.links.length) {
        html += '<div class="entry-detail-links"><h4>Enlaces relacionados</h4><ul>';
        entry.links.forEach(function (link) {
          if (!link || !link.url) return;
          html +=
            '<li><a href="' +
            escapeHtml(link.url) +
            '" target="_blank" rel="noopener noreferrer">' +
            escapeHtml(link.label || link.url) +
            "</a></li>";
        });
        html += "</ul></div>";
      }

      if (entry.tags) {
        html += '<p class="entry-detail-tags">' + escapeHtml(entry.tags) + "</p>";
      }
      html += "</article>";

      container.innerHTML = html;
    })
    .catch(showNotFound);
})();
