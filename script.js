(function () {
  "use strict";

  var btn = document.createElement("button");
  btn.type = "button";
  btn.id = "edit-toggle";
  btn.className = "edit-toggle-btn";
  btn.textContent = "✏️ Editar textos";
  document.body.appendChild(btn);

  var hint = document.createElement("div");
  hint.className = "edit-hint";
  hint.textContent = "Modo edición activo: toca cualquier frase marcada y escribe encima.";
  hint.hidden = true;
  document.body.appendChild(hint);

  var editing = false;

  btn.addEventListener("click", function () {
    editing = !editing;
    var editableEls = document.querySelectorAll("[data-editable]");
    for (var i = 0; i < editableEls.length; i++) {
      editableEls[i].contentEditable = editing ? "true" : "false";
    }
    document.body.classList.toggle("edit-mode", editing);
    hint.hidden = !editing;
    btn.textContent = editing ? "💾 Guardar cambios" : "✏️ Editar textos";

    if (!editing) {
      downloadEditedPage();
    }
  });

  function downloadEditedPage() {
    var clone = document.documentElement.cloneNode(true);

    var editableClones = clone.querySelectorAll("[data-editable]");
    for (var i = 0; i < editableClones.length; i++) {
      editableClones[i].removeAttribute("contenteditable");
    }

    var btnClone = clone.querySelector("#edit-toggle");
    if (btnClone) btnClone.parentNode.removeChild(btnClone);

    var hintClone = clone.querySelector(".edit-hint");
    if (hintClone) hintClone.parentNode.removeChild(hintClone);

    var bodyClone = clone.querySelector("body");
    if (bodyClone) bodyClone.classList.remove("edit-mode");

    var html = "<!DOCTYPE html>\n" + clone.outerHTML;
    var blob = new Blob([html], { type: "text/html" });
    var url = URL.createObjectURL(blob);
    var a = document.createElement("a");
    a.href = url;
    a.download = document.body.getAttribute("data-filename") || "pagina.html";
    document.body.appendChild(a);
    a.click();
    a.parentNode.removeChild(a);
    URL.revokeObjectURL(url);

    window.setTimeout(function () {
      window.alert(
        "Se ha descargado el archivo con tus cambios: " +
          (document.body.getAttribute("data-filename") || "pagina.html") +
          "\n\nSúbelo a Netlify (pestaña Deploys, arrastra el archivo) para publicar los cambios en la web."
      );
    }, 200);
  }
})();
