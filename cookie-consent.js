(function () {
  "use strict";
  var STORAGE_KEY = "turno-de-replica-cookie-consent";
  var MONTHS_VALID = 12;

  function getSaved() {
    try {
      var raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return null;
      var data = JSON.parse(raw);
      var age = Date.now() - data.savedAt;
      var maxAge = MONTHS_VALID * 30 * 24 * 60 * 60 * 1000;
      if (age > maxAge) return null;
      return data;
    } catch (e) {
      return null;
    }
  }

  function save(analytics) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ analytics: analytics, savedAt: Date.now() }));
    applyConsent(analytics);
  }

  function applyConsent(analytics) {
    // Punto de enganche para cuando se instale una herramienta de analítica:
    // if (analytics) { /* cargar script de analítica aquí */ }
    window.turnoDeReplicaAnalyticsConsent = !!analytics;
  }

  function buildBanner() {
    var banner = document.createElement("div");
    banner.className = "ck-banner";
    banner.innerHTML =
      '<div class="ck-banner-text">' +
      '<strong>Tu privacidad en Turno de Réplica</strong>' +
      '<p>Utilizamos cookies técnicas necesarias para el funcionamiento de la plataforma y, si lo aceptas, cookies opcionales de análisis para mejorar la experiencia. No se instalará nada opcional sin tu consentimiento. <a href="cookies.html">Política de Cookies</a></p>' +
      "</div>" +
      '<div class="ck-banner-actions">' +
      '<button class="ck-btn ck-btn-ghost" data-action="configurar">Configurar</button>' +
      '<button class="ck-btn ck-btn-outline" data-action="rechazar">Rechazar todas</button>' +
      '<button class="ck-btn ck-btn-primary" data-action="aceptar">Aceptar todas</button>' +
      "</div>";
    return banner;
  }

  function buildPanel() {
    var overlay = document.createElement("div");
    overlay.className = "ck-overlay";
    overlay.innerHTML =
      '<div class="ck-panel" role="dialog" aria-modal="true">' +
      "<h3>Configuración de cookies</h3>" +
      '<div class="ck-row">' +
      "<div><strong>Cookies técnicas (obligatorias)</strong><p>Necesarias para el funcionamiento básico del servicio.</p></div>" +
      '<span class="ck-locked">🔒 Siempre activas</span>' +
      "</div>" +
      '<div class="ck-row">' +
      "<div><strong>Cookies de análisis</strong><p>Nos ayudan a entender el uso de la plataforma para mejorar el rendimiento. Aún no tenemos ninguna activa; se guardará tu preferencia para cuando la incorporemos.</p></div>" +
      '<label class="ck-switch"><input type="checkbox" id="ck-analytics-toggle"><span></span></label>' +
      "</div>" +
      '<button class="ck-btn ck-btn-primary ck-save">Guardar configuración</button>' +
      "</div>";
    return overlay;
  }

  function init() {
    var saved = getSaved();
    if (saved) {
      applyConsent(saved.analytics);
    }

    var panelOverlay = buildPanel();
    document.body.appendChild(panelOverlay);
    var toggle = panelOverlay.querySelector("#ck-analytics-toggle");

    function openPanel() {
      if (saved) toggle.checked = !!saved.analytics;
      panelOverlay.classList.add("ck-open");
    }
    function closePanel() {
      panelOverlay.classList.remove("ck-open");
    }
    panelOverlay.addEventListener("click", function (e) {
      if (e.target === panelOverlay) closePanel();
    });
    panelOverlay.querySelector(".ck-save").addEventListener("click", function () {
      save(toggle.checked);
      closePanel();
      removeBanner();
    });

    var settingsLink = document.getElementById("footer-cookie-settings");
    if (settingsLink) {
      settingsLink.addEventListener("click", function (e) {
        e.preventDefault();
        openPanel();
      });
    }

    var banner = null;
    function removeBanner() {
      if (banner && banner.parentNode) banner.parentNode.removeChild(banner);
    }

    if (!saved) {
      banner = buildBanner();
      document.body.appendChild(banner);
      banner.addEventListener("click", function (e) {
        var action = e.target.getAttribute("data-action");
        if (action === "aceptar") {
          save(true);
          removeBanner();
        } else if (action === "rechazar") {
          save(false);
          removeBanner();
        } else if (action === "configurar") {
          openPanel();
        }
      });
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
