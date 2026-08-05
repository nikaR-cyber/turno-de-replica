(function () {
  "use strict";

  var page = document.querySelector("[data-ecos-de-papel]");
  if (!page) return;

  var src = page.getAttribute("data-content-source");
  var rotations = ["rot-1", "rot-2", "rot-3", "rot-4", "rot-5"];

  fetch(src, { cache: "no-store" })
    .then(function (res) {
      if (!res.ok) throw new Error("No se pudo cargar el contenido");
      return res.json();
    })
    .then(function (data) {
      renderDiscord(data.discord_url);
      renderReading("current-reading", data.current_reading, "Lectura actual");
      renderReading("next-reading", data.next_reading, "Próxima lectura", true);
      renderPreviousReadings(data.previous_readings);
      renderCorkboard(data.announcements);
    })
    .catch(function () {
      renderDiscord(null);
      renderReading("current-reading", null, "Lectura actual");
      renderReading("next-reading", null, "Próxima lectura", true);
      renderPreviousReadings([]);
      renderCorkboard([]);
    });

  function renderDiscord(url) {
    var el = document.getElementById("discord-cta-body");
    if (!el) return;
    if (url) {
      el.innerHTML =
        '<p>Entra en el servidor, preséntate y únete a la lectura de este mes.</p>' +
        '<a class="discord-button" href="' + url + '" target="_blank" rel="noopener noreferrer">Entrar en el Discord →</a>';
    } else {
      el.innerHTML = '<p>El enlace de invitación al Discord se añadirá aquí en cuanto esté listo.</p>';
    }
  }

  function renderReading(elementId, reading, label, isNext) {
    var el = document.getElementById(elementId);
    if (!el) return;

    if (!reading || !reading.title) {
      el.classList.add("is-empty");
      el.innerHTML =
        '<span class="eyebrow">' + label + '</span>' +
        "<p>Próximamente.</p>";
      return;
    }

    var html = '<span class="eyebrow">' + label + '</span>';
    if (reading.cover) {
      html += '<img class="reading-cover" src="' + reading.cover + '" alt="">';
    }
    html += "<h3>" + reading.title + "</h3>";
    if (reading.author) html += "<p>" + reading.author + "</p>";
    if (isNext && reading.date) html += "<p>" + reading.date + "</p>";

    el.innerHTML = html;
  }

  function renderPreviousReadings(list) {
    var container = document.getElementById("previous-readings-list");
    if (!container) return;
    var entries = Array.isArray(list) ? list : [];
    if (!entries.length) {
      container.closest(".previous-readings").hidden = true;
      return;
    }
    container.innerHTML = "";
    entries.forEach(function (item) {
      var li = document.createElement("li");
      li.textContent = item.author ? item.title + " — " + item.author : item.title;
      container.appendChild(li);
    });
  }

  function renderCorkboard(list) {
    var board = document.getElementById("corkboard");
    if (!board) return;
    var entries = Array.isArray(list) ? list : [];

    if (!entries.length) {
      board.innerHTML = '<p class="corkboard-empty">Sin anuncios por ahora. ¡Vuelve pronto!</p>';
      return;
    }

    var colorClass = {
      Rosa: "rot-1",
      Menta: "rot-2",
      Dorado: "rot-3",
      Melocotón: "rot-4"
    };

    board.innerHTML = "";
    entries.forEach(function (note, i) {
      var div = document.createElement("div");
      var rot = colorClass[note.color] || rotations[i % rotations.length];
      div.className = "pin-note " + rot;
      div.textContent = note.text || "";
      if (note.date) {
        var dateSpan = document.createElement("span");
        dateSpan.className = "pin-note-date";
        dateSpan.textContent = note.date;
        div.appendChild(dateSpan);
      }
      board.appendChild(div);
    });
  }
})();
