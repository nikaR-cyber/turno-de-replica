(function () {
  "use strict";

  var grid = document.querySelector(".content-grid[data-content-source]");
  if (!grid) return;

  var src = grid.getAttribute("data-content-source");
  var detailPage = grid.getAttribute("data-detail-page");
  var searchInput = grid.id
    ? document.querySelector('[data-search-for="' + grid.id + '"]')
    : null;

  var allPublished = [];

  function normalize(str) {
    return (str || "")
      .toString()
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "");
  }

  function showEmptyState() {
    grid.innerHTML =
      '<div class="empty-state">' +
      "<p>Próximamente.</p>" +
      "<p>Esta sección está preparando nuevas historias.</p>" +
      "</div>";
  }

  function showNoResults() {
    grid.innerHTML =
      '<div class="empty-state">' +
      "<p>No hemos encontrado nada con esa búsqueda.</p>" +
      "</div>";
  }

  function renderList(list) {
    if (!list.length) {
      showNoResults();
      return;
    }

    grid.innerHTML = "";

    list.forEach(function (entry) {
      var slug = window.TdRSlug.entrySlug(entry);
      var isLink = Boolean(detailPage) && Boolean(slug);
      var card = document.createElement(isLink ? "a" : "article");
      card.className = "content-item";
      if (isLink) {
        card.href = detailPage + "?slug=" + encodeURIComponent(slug);
      }

      if (entry.image) {
        var img = document.createElement("img");
        img.className = "content-item-image";
        img.src = entry.image;
        img.alt = entry.title || "";
        img.loading = "lazy";
        card.appendChild(img);
      }

      var eyebrowRow = document.createElement("div");
      eyebrowRow.className = "content-item-eyebrow-row";

      var eyebrow = document.createElement("span");
      eyebrow.className = "eyebrow";
      eyebrow.textContent = entry.eyebrow || "";
      eyebrowRow.appendChild(eyebrow);

      if (entry.featured) {
        var featuredTag = document.createElement("span");
        featuredTag.className = "featured-badge";
        featuredTag.textContent = "★ Destacada";
        eyebrowRow.appendChild(featuredTag);
      }
      card.appendChild(eyebrowRow);

      var h3 = document.createElement("h3");
      h3.textContent = entry.title || "";
      card.appendChild(h3);

      if (entry.subtitle) {
        var subtitle = document.createElement("p");
        subtitle.className = "content-item-subtitle";
        subtitle.textContent = entry.subtitle;
        card.appendChild(subtitle);
      }

      var meta = entry.author || entry.date;
      if (meta) {
        var metaLine = document.createElement("p");
        metaLine.className = "content-item-meta";
        metaLine.textContent = [entry.author, entry.date].filter(Boolean).join(" · ");
        card.appendChild(metaLine);
      }

      var p = document.createElement("p");
      p.textContent = entry.text || "";
      card.appendChild(p);

      if (isLink) {
        var readMore = document.createElement("span");
        readMore.className = "content-item-read";
        readMore.textContent = "Leer →";
        card.appendChild(readMore);
      }

      grid.appendChild(card);
    });
  }

  function applySearch(query) {
    var q = normalize(query).trim();
    if (!q) {
      renderList(allPublished);
      return;
    }
    var filtered = allPublished.filter(function (entry) {
      var haystack = [entry.title, entry.subtitle, entry.text, entry.eyebrow, entry.tags]
        .map(normalize)
        .join(" ");
      return haystack.indexOf(q) !== -1;
    });
    renderList(filtered);
  }

  fetch(src, { cache: "no-store" })
    .then(function (res) {
      if (!res.ok) throw new Error("No se pudo cargar el contenido");
      return res.json();
    })
    .then(function (data) {
      var entries = data && Array.isArray(data.entries) ? data.entries : [];
      allPublished = entries.filter(function (e) {
        return e.published !== false; // por defecto, publicado
      });

      // las destacadas van primero, conservando el orden entre sí
      allPublished.sort(function (a, b) {
        return (b.featured ? 1 : 0) - (a.featured ? 1 : 0);
      });

      if (!allPublished.length) {
        showEmptyState();
        return;
      }

      renderList(allPublished);

      if (searchInput) {
        searchInput.addEventListener("input", function () {
          applySearch(searchInput.value);
        });
      }
    })
    .catch(function () {
      showEmptyState();
    });
})();
