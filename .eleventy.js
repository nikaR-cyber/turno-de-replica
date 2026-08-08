module.exports = function (eleventyConfig) {
  // Copiar tal cual, sin tocar: estilos, scripts, contenido, imagenes y el panel de Decap
  eleventyConfig.addPassthroughCopy("style.css");
  eleventyConfig.addPassthroughCopy("*.js");
  eleventyConfig.addPassthroughCopy("content");
  eleventyConfig.addPassthroughCopy("images");
  eleventyConfig.addPassthroughCopy("admin");
  eleventyConfig.addPassthroughCopy("_redirects");

  return {
    dir: {
      input: ".",
      output: "_site"
    }
  };
};
