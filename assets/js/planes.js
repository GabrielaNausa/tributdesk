(window.TDPages = window.TDPages || {}).planes = function () {
  "use strict";

  var buttons = document.querySelectorAll("[data-plan]");
  var note = document.querySelector(".container > .hint");

  function paint() {
    var me = TDAuth.me();
    buttons.forEach(function (b) {
      var current = me && me.plan === b.dataset.plan;
      b.textContent = current ? "Tu plan actual" : "Comenzar";
      b.disabled = !!current;
      b.style.opacity = current ? "0.6" : "";
    });
  }

  buttons.forEach(function (b) {
    b.addEventListener("click", function () {
      var me = TDAuth.me();
      if (!me) { TD.openAuth("signup"); return; }
      TDAuth.update(me.email, { plan: b.dataset.plan });
      paint();
      if (note) note.textContent = "Plan " + b.dataset.plan + " seleccionado. Es una simulación: todavía no hay cobro.";
    });
  });
  paint();
};
