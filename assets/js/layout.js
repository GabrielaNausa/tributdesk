(function () {
  "use strict";

  var ICONS = {
    "file-text": '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6"/><path d="M16 13H8"/><path d="M16 17H8"/><path d="M10 9H8"/>',
    calculator: '<rect width="16" height="20" x="4" y="2" rx="2"/><line x1="8" x2="16" y1="6" y2="6"/><line x1="16" x2="16" y1="14" y2="18"/><path d="M16 10h.01M12 10h.01M8 10h.01M12 14h.01M8 14h.01M12 18h.01M8 18h.01"/>',
    wrench: '<path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94z"/>',
    "message-circle": '<path d="M7.9 20A9 9 0 1 0 4 16.1L2 22z"/>',
    "shield-check": '<path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"/><path d="m9 12 2 2 4-4"/>',
    clock: '<circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>',
    "bar-chart": '<line x1="12" x2="12" y1="20" y2="10"/><line x1="18" x2="18" y1="20" y2="4"/><line x1="6" x2="6" y1="20" y2="16"/>',
    users: '<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>',
    search: '<circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>',
    send: '<path d="m22 2-7 20-4-9-9-4Z"/><path d="M22 2 11 13"/>',
    check: '<path d="M20 6 9 17l-5-5"/>',
    "arrow-right": '<path d="M5 12h14"/><path d="m12 5 7 7-7 7"/>',
    bot: '<path d="M12 8V4H8"/><rect width="16" height="12" x="4" y="8" rx="2"/><path d="M2 14h2M20 14h2M15 13v2M9 13v2"/>',
    scale: '<path d="m16 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z"/><path d="m2 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z"/><path d="M7 21h10"/><path d="M12 3v18"/><path d="M3 7h2c2 0 5-1 7-2 2 1 5 2 7 2h2"/>',
    menu: '<line x1="4" x2="20" y1="12" y2="12"/><line x1="4" x2="20" y1="6" y2="6"/><line x1="4" x2="20" y1="18" y2="18"/>',
    x: '<path d="M18 6 6 18"/><path d="m6 6 12 12"/>',
  };

  function svg(name, size) {
    var s = size || 24;
    return (
      '<svg class="icon" width="' + s + '" height="' + s + '" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
      (ICONS[name] || "") +
      "</svg>"
    );
  }

  function hydrateIcons(root) {
    (root || document).querySelectorAll("[data-icon]").forEach(function (el) {
      el.insertAdjacentHTML("afterbegin", svg(el.dataset.icon, el.dataset.size));
      el.removeAttribute("data-icon");
    });
  }
  var TD = (window.TD = { svg: svg, hydrateIcons: hydrateIcons });

  var NAV = [
    ["#home", "Inicio", "home"],
    ["#servicios", "Servicios", "servicios"],
    ["#normativa", "Normativa", "normativa"],
    ["#herramientas", "Herramientas", "herramientas"],
    ["#asistente", "Desk", "asistente"],
    ["#planes", "Planes", "planes"],
  ];

  var MARK =
    '<svg class="brand-mark" viewBox="0 0 40 40" aria-hidden="true"><rect width="40" height="40" rx="10" fill="#103557"/>' +
    '<path d="M9 11h13v4h-4.5v14h-4V15H9z" fill="#fff"/>' +
    '<path fill="#008080" fill-rule="evenodd" d="M23 11h4.5c5 0 8 3 8 9s-3 9-8 9H23zM27 15v10c2.6 0 4-1.7 4-5s-1.4-5-4-5z"/></svg>';

  var header = document.getElementById("site-header");
  if (header) {
    header.outerHTML =
      '<header class="site-header"><div class="container header-inner">' +
      '<a class="brand" href="#home" aria-label="TributDesk, inicio">' + MARK +
      '<span class="brand-name">Tribut<strong>Desk</strong></span></a>' +
      '<nav class="main-nav" id="main-nav" aria-label="Principal">' +
      NAV.map(function (n) { return '<a href="' + n[0] + '" data-page="' + n[2] + '">' + n[1] + "</a>"; }).join("") +
      "</nav>" +
      '<div class="header-actions"></div></div></header>';
  }

  var footer = document.getElementById("site-footer");
  if (footer) {
    footer.outerHTML =
      '<footer class="site-footer"><div class="container">' +
      '<div class="footer-grid"><div>' +
      '<a class="brand" href="#home">' + MARK + '<span class="brand-name">Tribut<strong>Desk</strong></span></a>' +
      "<p>Todo lo tributario y contable, en un solo lugar.</p></div>" +
      '<div><h4>Plataforma</h4><ul><li><a href="#servicios">Servicios</a></li><li><a href="#normativa">Normativa</a></li><li><a href="#herramientas">Herramientas</a></li></ul></div>' +
      '<div><h4>Asistencia</h4><ul><li><a href="#asistente">Desk, asistente IA</a></li><li><a href="#planes">Planes</a></li></ul></div>' +
      '<div><h4>Cuenta</h4><ul><li><a href="#" data-auth="login">Iniciar sesión</a></li><li><a href="#" data-auth="signup">Crear cuenta</a></li></ul></div></div>' +
      '<p class="footer-note">TributDesk ofrece información de apoyo y no reemplaza la asesoría profesional. Verifique siempre las normas y tarifas vigentes en las fuentes oficiales (DIAN, Congreso, Presidencia).</p>' +
      "</div></footer>";
  }

  document.body.insertAdjacentHTML(
    "beforeend",
    '<dialog id="auth-dialog" aria-labelledby="auth-title"><div class="dialog-body">' +
      '<div class="dialog-top"><h2 id="auth-title">Iniciar sesión</h2>' +
      '<button class="icon-btn" type="button" id="auth-close" aria-label="Cerrar" data-icon="x"></button></div>' +
      '<form id="auth-form" novalidate>' +
      '<div class="field" id="auth-name-field" hidden><label for="auth-name">Nombre</label><input type="text" id="auth-name" autocomplete="name"></div>' +
      '<div class="field"><label for="auth-email">Correo</label><input type="email" id="auth-email" autocomplete="email"></div>' +
      '<div class="field"><label for="auth-pass">Contraseña</label><input type="password" id="auth-pass" autocomplete="current-password"></div>' +
      '<button class="btn btn-teal btn-block" type="submit" id="auth-submit">Entrar</button>' +
      '<p class="form-msg" id="auth-msg" role="alert" hidden></p>' +
      "</form></div></dialog>"
  );

  function button(cls, text, attrs) {
    var b = document.createElement("button");
    b.type = "button";
    b.className = "btn " + cls;
    b.textContent = text;
    Object.keys(attrs || {}).forEach(function (k) { b.setAttribute(k, attrs[k]); });
    return b;
  }

  function renderActions() {
    var actions = document.querySelector(".header-actions");
    var me = TDAuth.me();
    actions.replaceChildren();
    if (me) {
      var chip = document.createElement("span");
      chip.className = "user-chip";
      chip.textContent = me.name.split(" ")[0];
      actions.append(chip);
      if (me.role === "creador") {
        var panel = document.createElement("a");
        panel.className = "btn btn-teal";
        panel.href = "#admin";
        panel.textContent = "Panel";
        actions.append(panel);
      }
      actions.append(button("btn-amber", "Salir", { "data-logout": "" }));
    } else {
      actions.append(button("btn-outline", "Iniciar sesión", { "data-auth": "login" }));
      actions.append(button("btn-amber", "Crear cuenta", { "data-auth": "signup" }));
    }
    var toggle = document.createElement("button");
    toggle.type = "button";
    toggle.className = "nav-toggle";
    toggle.setAttribute("aria-label", "Abrir menú");
    toggle.setAttribute("aria-expanded", "false");
    toggle.setAttribute("aria-controls", "main-nav");
    toggle.dataset.icon = "menu";
    actions.append(toggle);
    hydrateIcons(actions);
  }

  TD.setActive = function (page) {
    document.querySelectorAll("#main-nav a").forEach(function (a) {
      if (a.dataset.page === page) a.setAttribute("aria-current", "page");
      else a.removeAttribute("aria-current");
    });
    var nav = document.getElementById("main-nav");
    nav.classList.remove("open");
    var t = document.querySelector(".nav-toggle");
    if (t) t.setAttribute("aria-expanded", "false");
  };

  TD.refresh = function () {
    renderActions();
    if (TD.render) TD.render();
  };

  var dlg = document.getElementById("auth-dialog");
  var title = document.getElementById("auth-title");
  var nameField = document.getElementById("auth-name-field");
  var passInput = document.getElementById("auth-pass");
  var submit = document.getElementById("auth-submit");
  var msg = document.getElementById("auth-msg");
  var mode = "login";

  function openAuth(m) {
    mode = m === "signup" ? "signup" : "login";
    var signup = mode === "signup";
    title.textContent = signup ? "Crear cuenta" : "Iniciar sesión";
    submit.textContent = signup ? "Crear cuenta" : "Entrar";
    nameField.hidden = !signup;
    passInput.setAttribute("autocomplete", signup ? "new-password" : "current-password");
    msg.hidden = true;
    if (typeof dlg.showModal === "function") dlg.showModal();
  }
  TD.openAuth = openAuth;

  document.addEventListener("click", function (e) {
    var t = e.target.closest("[data-auth]");
    if (t) {
      e.preventDefault();
      openAuth(t.dataset.auth);
      return;
    }
    if (e.target.closest("[data-logout]")) {
      TDAuth.logout();
      TD.refresh();
      return;
    }
    var tg = e.target.closest(".nav-toggle");
    if (tg) {
      var open = document.getElementById("main-nav").classList.toggle("open");
      tg.setAttribute("aria-expanded", String(open));
    }
  });
  document.getElementById("auth-close").addEventListener("click", function () { dlg.close(); });
  dlg.addEventListener("click", function (e) { if (e.target === dlg) dlg.close(); });
  document.getElementById("auth-form").addEventListener("submit", async function (e) {
    e.preventDefault();
    msg.hidden = true;
    var email = document.getElementById("auth-email").value;
    var password = passInput.value;
    try {
      if (mode === "signup") {
        await TDAuth.signup({ name: document.getElementById("auth-name").value, email: email, password: password });
      } else {
        await TDAuth.login(email, password);
      }
      document.getElementById("auth-form").reset();
      dlg.close();
      TD.refresh();
    } catch (err) {
      msg.textContent = err.message;
      msg.hidden = false;
    }
  });

  renderActions();
  hydrateIcons();
})();
