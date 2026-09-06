// detalle-loader.js — script compartido por las páginas de detalle (trama, drama, museo, taller, corcho).
// Cada página de detalle define window.CT_DETALLE = { json, type, backHref } antes de cargar este script.
(function () {
  document.addEventListener('DOMContentLoaded', function () {
    var cfg = window.CT_DETALLE || {};
    if (!cfg.json) return;

    var i = parseInt(ctQueryParam('i'), 10);

    ctFetchJSON(cfg.json)
      .then(function (data) {
        var entries = data.entries || [];
        var e = entries[i];
        if (!e || e.published === false) { showNotFound(cfg); return; }
        render(e, cfg);
      })
      .catch(function (err) {
        console.warn('detalle-loader.js:', err.message);
        showNotFound(cfg);
      });
  });

  function showNotFound(cfg) {
    var main = document.getElementById('detalle-main');
    if (main) {
      main.innerHTML = '<p style="padding:60px 0;text-align:center;">No se ha encontrado esta entrada.<br><a href="' + (cfg.backHref || '#') + '">← Volver</a></p>';
    }
  }

  function render(e, cfg) {
    setText('detalle-badge', e.eyebrow || e.category || '');
    setText('detalle-title', e.title || '');

    var metaParts = [];
    if (e.author) metaParts.push('Por ' + e.author);
    if (e.date) metaParts.push(ctFormatDate(e.date));
    setText('detalle-meta', metaParts.join(' · '));

    var imgWrap = document.getElementById('detalle-img-wrap');
    if (imgWrap) {
      if (e.image) {
        var creditHtml = '';
        if (e.image_credit) {
          creditHtml = e.image_credit_url
            ? '<p class="td-meta" style="margin-top:6px;"><a href="' + e.image_credit_url + '" target="_blank" rel="noopener">' + ctEscapeHtml(e.image_credit) + '</a></p>'
            : '<p class="td-meta" style="margin-top:6px;">' + ctEscapeHtml(e.image_credit) + '</p>';
        }
        imgWrap.innerHTML = '<img src="' + e.image + '" alt="' + ctEscapeHtml(e.title || '') + '">' + creditHtml;
      } else {
        imgWrap.style.display = 'none';
      }
    }

    var bodyEl = document.getElementById('detalle-body');
    if (bodyEl) {
      if (cfg.type === 'museo' && isPiezaDelMes(e)) {
        bodyEl.innerHTML = buildPiezaGrid(e);
      } else if (cfg.type === 'corcho') {
        bodyEl.innerHTML = buildCorchoBody(e);
      } else {
        var text = e.body || e.text || '';
        bodyEl.innerHTML = paragraphsHtml(text);
      }
    }

    var tagsEl = document.getElementById('detalle-tags');
    if (tagsEl) {
      tagsEl.innerHTML = '';
      if (e.tags) {
        e.tags.split(',').forEach(function (t) {
          t = t.trim();
          if (!t) return;
          var span = document.createElement('span');
          span.textContent = '#' + t.replace(/\s+/g, '');
          tagsEl.appendChild(span);
        });
      }
    }

    var linksEl = document.getElementById('detalle-links');
    if (linksEl) {
      if (e.links && e.links.length) {
        var html = '<h3 class="heading" style="font-size:16px;margin:24px 0 8px;">Enlaces</h3><ul>';
        e.links.forEach(function (l) {
          html += '<li><a href="' + ctEscapeHtml(l.url) + '" target="_blank" rel="noopener">' + ctEscapeHtml(l.label || l.url) + '</a></li>';
        });
        html += '</ul>';
        linksEl.innerHTML = html;
      } else {
        linksEl.innerHTML = '';
      }
    }
  }

  function isPiezaDelMes(e) {
    return !!(e.pieza_la_obra || e.pieza_el_contexto || e.pieza_lo_que_hay_detras || e.pieza_su_legado);
  }

  function buildPiezaGrid(e) {
    var parts = [
      ['La obra', e.pieza_la_obra],
      ['El contexto', e.pieza_el_contexto],
      ['Lo que hay detrás', e.pieza_lo_que_hay_detras],
      ['Su legado', e.pieza_su_legado]
    ];
    var html = '<div class="pieza-grid">';
    parts.forEach(function (p) {
      if (!p[1]) return;
      html += '<div class="pieza-card"><h3 class="heading">' + ctEscapeHtml(p[0]) + '</h3><p>' + ctEscapeHtml(p[1]) + '</p></div>';
    });
    html += '</div>';
    if (e.text) html += '<div class="art-body">' + paragraphsHtml(e.text) + '</div>';
    return html;
  }

  function buildCorchoBody(e) {
    var html = '<div class="art-box"><p>' + ctEscapeHtml(e.message || '') + '</p><div class="art-contact">';
    html += '<div><strong>Publicado por</strong>' + ctEscapeHtml(e.author || '') + '</div>';
    html += '<div><strong>Contacto</strong>' + ctEscapeHtml(e.contact || '') + '</div>';
    html += '</div></div>';
    return html;
  }

  function paragraphsHtml(text) {
    if (!text) return '';
    return text.split(/\n\s*\n/).map(function (p) {
      return '<p>' + ctEscapeHtml(p).replace(/\n/g, '<br>') + '</p>';
    }).join('');
  }

  function setText(id, value) {
    var el = document.getElementById(id);
    if (el) el.textContent = value || '';
  }
})();
