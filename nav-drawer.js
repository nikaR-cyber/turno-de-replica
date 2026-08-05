(function () {
  "use strict";

  var header = document.querySelector(".site-header");
  var oldNav = document.querySelector(".site-nav");
  if (!header || !oldNav) return;

  // Mapa de secciones: título, página índice y (si tiene) su contenido para las subsecciones
  var SECTIONS = [
    { title: "Inicio", href: "index.html" },
    {
      title: "La Trama y el Drama",
      href: "la-trama-y-el-drama.html",
      source: "content/trama-y-drama.json",
      detailPage: "la-trama-y-el-drama-entrada.html"
    },
    {
      title: "El Club de la Trama y el Drama",
      href: "club-de-la-trama-y-el-drama.html",
      source: "content/club-de-la-trama-y-el-drama.json",
      detailPage: "club-de-la-trama-y-el-drama-entrada.html"
    },
    {
      title: "Museo Literario",
      href: "museo-literario.html",
      source: "content/museo-literario.json",
      detailPage: "museo-literario-entrada.html"
    },
    {
      title: "Taller de Escritura",
      href: "taller-de-escritura.html",
      source: "content/taller-escritura.json",
      detailPage: "taller-de-escritura-entrada.html"
    },
    { title: "Ecos de Papel", href: "ecos-de-papel.html" }
  ];

  var currentFile = document.body.getAttribute("data-filename") || "";

  // ---------- botón que abre el menú (sustituye a la barra horizontal) ----------
  var trigger = document.createElement("button");
  trigger.type = "button";
  trigger.className = "nav-drawer-trigger";
  trigger.innerHTML = "☰ <span>Menú</span>";
  trigger.setAttribute("aria-haspopup", "true");
  trigger.setAttribute("aria-expanded", "false");

  oldNav.hidden = true; // se mantiene en el HTML por si falla JS, pero se oculta
  oldNav.parentNode.insertBefore(trigger, oldNav);

  // ---------- overlay + panel ----------
  var overlay = document.createElement("div");
  overlay.className = "nav-drawer-overlay";
  overlay.hidden = true;

  var drawer = document.createElement("nav");
  drawer.className = "nav-drawer";
  drawer.hidden = true;
  drawer.setAttribute("aria-label", "Navegación principal");

  var header_html =
    '<div class="nav-drawer-header">' +
    "<p class=\"nav-drawer-title\">Turno de Réplica</p>" +
    '<button type="button" class="nav-drawer-close" aria-label="Cerrar menú">✕</button>' +
    "</div>";

  var list = document.createElement("ul");
  list.className = "nav-drawer-list";

  SECTIONS.forEach(function (section) {
    var li = document.createElement("li");
    li.className = "nav-drawer-section";

    var row = document.createElement("div");
    row.className = "nav-drawer-row";

    var link = document.createElement("a");
    link.href = section.href;
    link.textContent = section.title;
    if (section.href === currentFile) link.setAttribute("aria-current", "page");
    row.appendChild(link);

    if (section.source) {
      var toggle = document.createElement("button");
      toggle.type = "button";
      toggle.className = "nav-drawer-toggle";
      toggle.setAttribute("aria-expanded", "false");
      toggle.setAttribute("aria-label", "Ver publicaciones de " + section.title);
      toggle.textContent = "▸";
      row.appendChild(toggle);

      var sub = document.createElement("ul");
      sub.className = "nav-drawer-sub";
      sub.hidden = true;

      var loaded = false;
      toggle.addEventListener("click", function () {
        var expanded = toggle.getAttribute("aria-expanded") === "true";
        toggle.setAttribute("aria-expanded", String(!expanded));
        toggle.textContent = expanded ? "▸" : "▾";
        sub.hidden = expanded;

        if (!loaded && !expanded) {
          loaded = true;
          sub.innerHTML = '<li class="nav-drawer-sub-empty">Cargando...</li>';
          fetch(section.source, { cache: "no-store" })
            .then(function (res) {
              if (!res.ok) throw new Error("no source");
              return res.json();
            })
            .then(function (data) {
              var entries = (data && Array.isArray(data.entries) ? data.entries : []).filter(
                function (e) { return e.published !== false; }
              );
              sub.innerHTML = "";
              if (!entries.length) {
                sub.innerHTML = '<li class="nav-drawer-sub-empty">Próximamente</li>';
                return;
              }
              entries.forEach(function (entry) {
                var slug = window.TdRSlug ? window.TdRSlug.entrySlug(entry) : "";
                if (!slug) return;
                var subLi = document.createElement("li");
                var subLink = document.createElement("a");
                subLink.href = section.detailPage + "?slug=" + encodeURIComponent(slug);
                subLink.textContent = entry.title || "";
                subLi.appendChild(subLink);
                sub.appendChild(subLi);
              });
            })
            .catch(function () {
              sub.innerHTML = '<li class="nav-drawer-sub-empty">No se ha podido cargar</li>';
            });
        }
      });

      li.appendChild(row);
      li.appendChild(sub);
    } else {
      li.appendChild(row);
    }

    list.appendChild(li);
  });

  drawer.innerHTML = header_html;
  drawer.appendChild(list);

  document.body.appendChild(overlay);
  document.body.appendChild(drawer);

  var closeBtn = drawer.querySelector(".nav-drawer-close");
  var isOpen = false;

  function openDrawer() {
    isOpen = true;
    overlay.hidden = false;
    drawer.hidden = false;
    trigger.setAttribute("aria-expanded", "true");
    document.body.classList.add("nav-drawer-open");
    closeBtn.focus();
  }
  function closeDrawer() {
    isOpen = false;
    overlay.hidden = true;
    drawer.hidden = true;
    trigger.setAttribute("aria-expanded", "false");
    document.body.classList.remove("nav-drawer-open");
    trigger.focus();
  }

  trigger.addEventListener("click", function () {
    isOpen ? closeDrawer() : openDrawer();
  });
  closeBtn.addEventListener("click", closeDrawer);
  overlay.addEventListener("click", closeDrawer);
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && isOpen) closeDrawer();
  });
})();
