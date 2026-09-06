// content-common.js
// Funciones compartidas por los loaders de todas las secciones (La Trama, El Drama,
// Museo Literario, Taller de Escritura, El Corcho). No hace nada por sí solo.

function ctFetchJSON(path) {
  return fetch(path).then(function (res) {
    if (!res.ok) throw new Error('No se pudo cargar ' + path);
    return res.json();
  });
}

function ctQueryParam(name) {
  var params = new URLSearchParams(window.location.search);
  return params.get(name);
}

function ctEscapeHtml(str) {
  if (str === undefined || str === null) return '';
  var div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

// Convierte "2026-09-06" o un ISO datetime en algo legible tipo "6 sept 2026".
function ctFormatDate(raw) {
  if (!raw) return '';
  var d = new Date(raw);
  if (isNaN(d.getTime())) return raw; // si no es una fecha reconocible, se muestra tal cual
  var meses = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sept', 'oct', 'nov', 'dic'];
  return d.getDate() + ' ' + meses[d.getMonth()] + ' ' + d.getFullYear();
}

// Devuelve solo las entradas publicadas, ordenadas por fecha descendente (más reciente primero).
function ctPublishedSorted(entries) {
  return (entries || [])
    .map(function (e, i) { return Object.assign({}, e, { _index: i }); })
    .filter(function (e) { return e.published !== false; }) // por defecto se consideran publicadas
    .sort(function (a, b) {
      var da = a.date ? new Date(a.date).getTime() : 0;
      var db = b.date ? new Date(b.date).getTime() : 0;
      return db - da;
    });
}
