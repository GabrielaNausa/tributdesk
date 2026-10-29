(window.TDPages = window.TDPages || {}).admin = function () {
  "use strict";

  var root = document.getElementById("admin-root");
  var K_NORMAS = "td_normas";
  var CATS = ["Tributaria", "Contable", "Laboral", "Comercial"];

  function h(tag, props) {
    var el = document.createElement(tag);
    Object.keys(props || {}).forEach(function (k) {
      var v = props[k];
      if (k === "class") el.className = v;
      else if (k.indexOf("on") === 0) el.addEventListener(k.slice(2), v);
      else if (v !== false && v !== null && v !== undefined) el.setAttribute(k, v === true ? "" : v);
    });
    Array.prototype.slice.call(arguments, 2).forEach(function add(c) {
      if (c === null || c === undefined || c === false) return;
      if (Array.isArray(c)) c.forEach(add);
      else el.append(c instanceof Node ? c : document.createTextNode(c));
    });
    return el;
  }

  function normas() {
    try { return JSON.parse(localStorage.getItem(K_NORMAS)) || []; } catch (e) { return []; }
  }
  function saveNormas(list) {
    try { localStorage.setItem(K_NORMAS, JSON.stringify(list)); } catch (e) { /* sin almacenamiento disponible */ }
  }

  function field(id, label, input) {
    return h("div", { class: "field" }, h("label", { for: id }, label), input);
  }

  function showError(form, text) {
    var box = form.querySelector(".form-msg");
    box.textContent = text;
    box.hidden = false;
  }

  function setup() {
    var form = h("form", { novalidate: true },
      field("s-name", "Nombre", h("input", { type: "text", id: "s-name", autocomplete: "name" })),
      field("s-email", "Correo", h("input", { type: "email", id: "s-email", autocomplete: "email" })),
      field("s-pass", "Contraseña (mínimo 8 caracteres)", h("input", { type: "password", id: "s-pass", autocomplete: "new-password" })),
      h("button", { class: "btn btn-teal btn-block", type: "submit" }, "Crear cuenta de creador"),
      h("p", { class: "form-msg", role: "alert", hidden: true })
    );
    form.addEventListener("submit", async function (e) {
      e.preventDefault();
      try {
        await TDAuth.createCreator({
          name: form.querySelector("#s-name").value,
          email: form.querySelector("#s-email").value,
          password: form.querySelector("#s-pass").value,
        });
        TD.refresh();
      } catch (err) { showError(form, err.message); }
    });
    return h("div", { class: "card narrow" },
      h("h2", { style: "margin-bottom:8px" }, "Primera configuración"),
      h("p", { class: "hint", style: "margin-bottom:18px" }, "Todavía no hay una cuenta de creador. Crea la primera: desde ahí podrás dar acceso de creador a otras cuentas."),
      form);
  }

  function locked(me) {
    return h("div", { class: "card narrow", style: "text-align:center" },
      h("h2", { style: "margin-bottom:8px" }, me ? "Sin permisos" : "Acceso para creadores"),
      h("p", { class: "hint", style: "margin-bottom:18px" },
        me ? "Esta cuenta no tiene permisos de creador." : "Inicia sesión con una cuenta de creador para entrar."),
      me ? null : h("button", { class: "btn btn-teal", type: "button", "data-auth": "login" }, "Iniciar sesión"));
  }

  function confirmButton(label, onConfirm, extra) {
    var b = h("button", { class: "btn btn-danger btn-sm", type: "button", disabled: extra && extra.disabled }, label);
    var armed = false;
    b.addEventListener("click", function () {
      if (!armed) {
        armed = true;
        b.textContent = "¿Seguro?";
        setTimeout(function () { armed = false; b.textContent = label; }, 3000);
        return;
      }
      onConfirm();
    });
    return b;
  }

  function usersTable(me) {
    var list = TDAuth.users();
    var creators = list.filter(function (u) { return u.role === "creador"; }).length;
    var body = list.map(function (u) {
      var isMe = u.email === me.email;
      var isCreator = u.role === "creador";
      var sel = h("select", { "aria-label": "Plan de " + u.name },
        TDAuth.PLANS.map(function (p) { return h("option", { value: p, selected: p === u.plan }, p); }));
      sel.addEventListener("change", function () { TDAuth.update(u.email, { plan: sel.value }); render(); });
      return h("tr", null,
        h("td", null, u.name, isMe ? h("span", { class: "hint" }, " (tú)") : null),
        h("td", null, u.email),
        h("td", null, h("span", { class: "badge" + (isCreator ? " badge-creator" : "") }, isCreator ? "Creador" : "Usuario")),
        h("td", null, sel),
        h("td", null, new Date(u.createdAt).toLocaleDateString("es-CO")),
        h("td", null, h("div", { class: "row-actions" },
          h("button", {
            class: "btn btn-outline btn-sm", type: "button",
            disabled: isMe || (isCreator && creators <= 1),
            onclick: function () { TDAuth.update(u.email, { role: isCreator ? "usuario" : "creador" }); render(); },
          }, isCreator ? "Quitar creador" : "Hacer creador"),
          confirmButton("Eliminar", function () { TDAuth.remove(u.email); render(); }, { disabled: isMe })
        )));
    });
    return h("div", { class: "table-wrap" }, h("table", { class: "tbl" },
      h("thead", null, h("tr", null, ["Nombre", "Correo", "Rol", "Plan", "Alta", ""].map(function (t) { return h("th", null, t); }))),
      h("tbody", null, body)));
  }

  function normasSection() {
    var form = h("form", { novalidate: true, class: "form-grid" },
      h("div", { class: "field full" }, h("label", { for: "n-t" }, "Título"), h("input", { type: "text", id: "n-t" })),
      h("div", { class: "field" }, h("label", { for: "n-n" }, "Número o referencia"), h("input", { type: "text", id: "n-n", placeholder: "Ej: Decreto 000 de 2024" })),
      h("div", { class: "field" }, h("label", { for: "n-c" }, "Categoría"),
        h("select", { id: "n-c" }, CATS.map(function (c) { return h("option", { value: c }, c); }))),
      h("div", { class: "field full" }, h("label", { for: "n-d" }, "Resumen"), h("textarea", { id: "n-d" })),
      h("div", { class: "full" }, h("button", { class: "btn btn-teal", type: "submit" }, "Agregar norma"),
        h("p", { class: "form-msg", role: "alert", hidden: true }))
    );
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var t = form.querySelector("#n-t").value.trim();
      var n = form.querySelector("#n-n").value.trim();
      var d = form.querySelector("#n-d").value.trim();
      if (!t || !n || !d) { showError(form, "Completa título, referencia y resumen."); return; }
      var list = normas();
      list.push({ t: t, n: n, c: form.querySelector("#n-c").value, d: d });
      saveNormas(list);
      render();
    });

    var list = normas();
    var rows = list.length
      ? list.map(function (x, i) {
          return h("tr", null,
            h("td", null, x.t), h("td", null, x.n), h("td", null, h("span", { class: "badge" }, x.c)),
            h("td", null, confirmButton("Eliminar", function () {
              var l = normas(); l.splice(i, 1); saveNormas(l); render();
            })));
        })
      : [h("tr", null, h("td", { colspan: "4", class: "hint" }, "Todavía no hay normas propias."))];

    return h("div", null,
      form,
      h("div", { class: "table-wrap", style: "margin-top:20px" }, h("table", { class: "tbl", style: "min-width:520px" },
        h("thead", null, h("tr", null, ["Título", "Referencia", "Categoría", ""].map(function (t) { return h("th", null, t); }))),
        h("tbody", null, rows))));
  }

  function dashboard(me) {
    var list = TDAuth.users();
    var regular = list.filter(function (u) { return u.role === "usuario"; });
    var stat = function (label, value) { return h("div", { class: "stat" }, h("span", null, label), h("b", null, String(value))); };

    return h("div", null,
      h("div", { class: "stats" },
        stat("Usuarios", regular.length),
        stat("Creadores", list.length - regular.length),
        TDAuth.PLANS.map(function (p) {
          return stat("Plan " + p, regular.filter(function (u) { return u.plan === p; }).length);
        }),
        stat("Normas propias", normas().length)),
      h("div", { class: "card admin-section" }, h("h2", null, "Cuentas"), usersTable(me)),
      h("div", { class: "card admin-section" }, h("h2", null, "Normas propias"),
        h("p", { class: "hint", style: "margin-bottom:14px" }, "Aparecen en la sección Normativa junto a las normas base."),
        normasSection()),
      h("p", { class: "hint" }, "Los datos se guardan solo en este navegador de este computador. Si borras los datos del navegador, se pierden.")
    );
  }

  function render() {
    var me = TDAuth.me();
    root.replaceChildren(
      me && me.role === "creador" ? dashboard(me) : (!TDAuth.hasCreator() ? setup() : locked(me))
    );
  }
  render();
};
