// ecos-loader.js
// Lee content/ecos-de-papel.json (editado desde Decap) y rellena la página de Ecos de Papel.
// Si algo falla (archivo no encontrado, dato vacío), la página se queda con el contenido
// de respaldo que ya lleva escrito en el HTML — nunca se rompe ni se queda en blanco.

(function () {
  fetch('content/ecos-de-papel.json')
    .then(function (res) {
      if (!res.ok) throw new Error('No se pudo cargar ecos-de-papel.json');
      return res.json();
    })
    .then(function (data) {
      try { renderLecturaActual(data.current_reading); } catch (e) { console.warn('Ecos: lectura actual', e); }
      try { renderCalendario(data.reading_calendar); } catch (e) { console.warn('Ecos: calendario', e); }
      try { renderBiblioteca(data.biblioteca); } catch (e) { console.warn('Ecos: biblioteca', e); }
      try { renderDiscord(data.discord_url); } catch (e) { console.warn('Ecos: discord', e); }
    })
    .catch(function (err) {
      console.warn('ecos-loader.js: usando contenido de respaldo,', err.message);
    });

  function setText(id, value) {
    if (value === undefined || value === null || value === '') return;
    var el = document.getElementById(id);
    if (el) el.textContent = value;
  }

  function renderLecturaActual(book) {
    if (!book) return;

    setText('ec-book-title', book.title);
    if (book.author) setText('ec-book-author', 'de ' + book.author);
    setText('ec-book-synopsis', book.synopsis);

    if (book.author_bio) {
      var bioEl = document.getElementById('ec-author-bio');
      if (bioEl) { bioEl.textContent = book.author_bio; bioEl.style.display = 'block'; }
    }

    // Portada: si hay imagen, la usamos; si no, dejamos el bloque de texto de respaldo.
    if (book.cover) {
      var coverEl = document.getElementById('ec-book-cover');
      if (coverEl) {
        coverEl.innerHTML = '';
        coverEl.style.backgroundImage = 'url(' + book.cover + ')';
        coverEl.style.backgroundSize = 'cover';
        coverEl.style.backgroundPosition = 'center';
      }
    }

    // Géneros (separados por comas) -> etiquetas
    if (book.genres) {
      var tagsEl = document.getElementById('ec-book-tags');
      if (tagsEl) {
        tagsEl.innerHTML = '';
        book.genres.split(',').forEach(function (g) {
          g = g.trim();
          if (!g) return;
          var span = document.createElement('span');
          span.textContent = g;
          tagsEl.appendChild(span);
        });
      }
    }

    // Progreso
    if (typeof book.progress_percent === 'number') {
      setText('ec-progress-percent', book.progress_percent + '%');
      var fill = document.getElementById('ec-progress-fill');
      if (fill) fill.style.width = book.progress_percent + '%';
    }

    if (book.current_chapters) setText('ec-current-chapters', 'Esta semana: ' + book.current_chapters);
    if (book.spoiler_until) setText('ec-spoiler-warn', '⚠️ Spoilers hasta ' + book.spoiler_until);

    if (book.book_link) {
      var linkEl = document.getElementById('ec-book-link');
      if (linkEl) linkEl.setAttribute('href', book.book_link);
    }
  }

  function renderCalendario(weeks) {
    if (!weeks || !weeks.length) return;
    var list = document.getElementById('ec-calendario-list');
    if (!list) return;
    list.innerHTML = '';

    weeks.forEach(function (w) {
      var li = document.createElement('li');

      var iconSpan = document.createElement('span');
      iconSpan.className = 'ec-cal-icon';
      iconSpan.textContent = w.icon || '📖';
      li.appendChild(iconSpan);

      var textDiv = document.createElement('div');
      var strong = document.createElement('strong');
      strong.textContent = w.label || '';
      var span = document.createElement('span');
      span.textContent = w.chapters || '';
      textDiv.appendChild(strong);
      textDiv.appendChild(span);
      li.appendChild(textDiv);

      var em = document.createElement('em');
      em.textContent = w.dates || '';
      li.appendChild(em);

      if (w.status === 'Completada') {
        var check = document.createElement('span');
        check.className = 'ec-check';
        check.textContent = '✓';
        li.appendChild(check);
      } else if (w.status === 'En curso') {
        var pending = document.createElement('span');
        pending.className = 'ec-check pending';
        pending.textContent = '○';
        li.appendChild(pending);
      }
      // 'Sin marcar' -> no se añade ningún icono de estado

      list.appendChild(li);
    });
  }

  function renderBiblioteca(books) {
    if (!books || !books.length) return;
    var grid = document.getElementById('ec-biblio-grid');
    if (!grid) return;
    grid.innerHTML = '';

    books.forEach(function (b) {
      var item = document.createElement('div');
      item.className = 'ec-biblio-item';

      var cover = document.createElement('div');
      cover.className = 'ec-mini-cover';
      if (b.cover_image) {
        cover.style.backgroundImage = 'url(' + b.cover_image + ')';
        cover.style.backgroundSize = 'cover';
        cover.style.backgroundPosition = 'center';
      } else {
        cover.style.background = b.cover_color || '#C9A6D8';
      }
      item.appendChild(cover);

      var mes = document.createElement('span');
      mes.className = 'ec-mes';
      mes.textContent = b.month_year || '';
      item.appendChild(mes);

      var h4 = document.createElement('h4');
      h4.textContent = b.title || '';
      item.appendChild(h4);

      var p = document.createElement('p');
      p.textContent = b.author || '';
      item.appendChild(p);

      if (b.genre) {
        var badge = document.createElement('span');
        badge.className = 'td-badge trama';
        badge.textContent = b.genre;
        item.appendChild(badge);
      }

      grid.appendChild(item);
    });
  }

  function renderDiscord(url) {
    if (!url) return;
    var link = document.getElementById('ec-discord-link');
    if (link) link.setAttribute('href', url);
  }
})();
