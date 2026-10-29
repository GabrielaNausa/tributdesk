(function () {
  "use strict";

  var PAGES = ["home", "servicios", "normativa", "herramientas", "asistente", "planes", "admin"];
  var app = document.getElementById("app");

  function current() {
    var name = (window.location.hash || "").replace("#", "");
    return PAGES.indexOf(name) !== -1 ? name : "home";
  }

  function show() {
    var name = current();
    var tpl = document.getElementById("page-" + name);
    app.replaceChildren(tpl.content.cloneNode(true));
    TD.hydrateIcons(app);
    document.body.dataset.page = name;
    TD.setActive(name);
    window.scrollTo(0, 0);
    var init = (window.TDPages || {})[name];
    if (init) init();
  }

  TD.render = show;
  window.addEventListener("hashchange", show);
  show();
})();
