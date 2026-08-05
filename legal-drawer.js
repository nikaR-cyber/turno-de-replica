(function () {
  "use strict";

  var footer = document.querySelector(".site-footer");
  if (!footer) return;

  var trigger = document.createElement("button");
  trigger.type = "button";
  trigger.className = "legal-trigger";
  trigger.textContent = "Legal";
  trigger.setAttribute("aria-haspopup", "true");
  trigger.setAttribute("aria-expanded", "false");
  footer.appendChild(trigger);

  var overlay = document.createElement("div");
  overlay.className = "legal-overlay";
  overlay.hidden = true;

  var panel = document.createElement("aside");
  panel.className = "legal-panel";
  panel.hidden = true;
  panel.setAttribute("aria-label", "Información legal");

  panel.innerHTML =
    '<div class="legal-panel-header">' +
    "<h2>Información legal</h2>" +
    '<button type="button" class="legal-close" aria-label="Cerrar">✕</button>' +
    "</div>" +
    '<nav class="legal-panel-list"><p class="legal-panel-loading">Cargando...</p></nav>';

  document.body.appendChild(overlay);
  document.body.appendChild(panel);

  var list = panel.querySelector(".legal-panel-list");
  var closeBtn = panel.querySelector(".legal-close");
  var isOpen = false;

  function openPanel() {
    isOpen = true;
    overlay.hidden = false;
    panel.hidden = false;
    trigger.setAttribute("aria-expanded", "true");
    document.body.classList.add("legal-panel-open");
    closeBtn.focus();
  }

  function closePanel() {
    isOpen = false;
    overlay.hidden = true;
    panel.hidden = true;
    trigger.setAttribute("aria-expanded", "false");
    document.body.classList.remove("legal-panel-open");
    trigger.focus();
  }

  trigger.addEventListener("click", function () {
    isOpen ? closePanel() : openPanel();
  });
  closeBtn.addEventListener("click", closePanel);
  overlay.addEventListener("click", closePanel);
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && isOpen) closePanel();
  });

  fetch("content/legal.json", { cache: "no-store" })
    .then(function (res) {
      if (!res.ok) throw new Error("No se pudo cargar el listado legal");
      return res.json();
    })
    .then(function (data) {
      var entries = data && Array.isArray(data.entries) ? data.entries : [];
      var active = entries
        .filter(function (e) { return e.active === true && e.slug && e.title; })
        .sort(function (a, b) { return (a.order || 0) - (b.order || 0); });

      if (!active.length) {
        list.innerHTML = "<p class=\"legal-panel-empty\">Próximamente.</p>";
        return;
      }

      list.innerHTML = "";
      active.forEach(function (doc) {
        var a = document.createElement("a");
        a.href = "legal-documento.html?slug=" + encodeURIComponent(doc.slug);
        a.textContent = doc.title;
        list.appendChild(a);
      });
    })
    .catch(function () {
      list.innerHTML = "<p class=\"legal-panel-empty\">No se ha podido cargar el listado.</p>";
    });
})();
