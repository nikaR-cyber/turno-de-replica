(function (global) {
  "use strict";

  function slugify(text) {
    return (text || "")
      .toString()
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "")
      .slice(0, 80);
  }

  function entrySlug(entry) {
    return (entry && entry.slug && entry.slug.trim()) || slugify(entry && entry.title);
  }

  global.TdRSlug = { slugify: slugify, entrySlug: entrySlug };
})(window);
