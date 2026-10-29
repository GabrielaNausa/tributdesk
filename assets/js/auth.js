(function () {
  "use strict";

  var K_USERS = "td_users";
  var K_SESSION = "td_session";
  var PLANS = ["Básico", "Profesional", "Premium"];

  function read(key, fallback) {
    try {
      var v = JSON.parse(localStorage.getItem(key));
      return v === null || v === undefined ? fallback : v;
    } catch (e) {
      return fallback;
    }
  }
  function write(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (e) {
      throw new Error("Este navegador no permite guardar datos. Prueba fuera de una ventana privada.");
    }
  }

  function randomSalt() {
    var a = new Uint8Array(12);
    crypto.getRandomValues(a);
    return Array.from(a, function (b) { return b.toString(16).padStart(2, "0"); }).join("");
  }

  async function hash(password, salt) {
    var data = new TextEncoder().encode(salt + ":" + password);
    if (window.crypto && crypto.subtle) {
      var buf = await crypto.subtle.digest("SHA-256", data);
      return Array.from(new Uint8Array(buf), function (b) { return b.toString(16).padStart(2, "0"); }).join("");
    }
    var h = 5381;
    data.forEach(function (b) { h = ((h << 5) + h + b) >>> 0; });
    return "f" + h.toString(16);
  }

  function users() { return read(K_USERS, []); }
  function save(list) { write(K_USERS, list); }
  function find(email) {
    email = String(email || "").trim().toLowerCase();
    return users().filter(function (u) { return u.email === email; })[0] || null;
  }

  function validate(data) {
    var name = String(data.name || "").trim();
    var email = String(data.email || "").trim().toLowerCase();
    var password = String(data.password || "");
    if (name.length < 2) throw new Error("Escribe tu nombre.");
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) throw new Error("Escribe un correo válido.");
    if (password.length < 8) throw new Error("La contraseña debe tener al menos 8 caracteres.");
    if (find(email)) throw new Error("Ya existe una cuenta con ese correo.");
    return { name: name, email: email, password: password };
  }

  async function create(data, role) {
    var v = validate(data);
    var salt = randomSalt();
    var user = {
      name: v.name,
      email: v.email,
      salt: salt,
      hash: await hash(v.password, salt),
      role: role,
      plan: "Básico",
      createdAt: new Date().toISOString(),
    };
    var list = users();
    list.push(user);
    save(list);
    write(K_SESSION, user.email);
    return user;
  }

  window.TDAuth = {
    PLANS: PLANS,
    users: users,
    hasCreator: function () { return users().some(function (u) { return u.role === "creador"; }); },
    me: function () {
      var email = read(K_SESSION, null);
      return email ? find(email) : null;
    },
    signup: function (data) { return create(data, "usuario"); },
    createCreator: async function (data) {
      if (window.TDAuth.hasCreator()) throw new Error("Ya existe una cuenta de creador.");
      return create(data, "creador");
    },
    login: async function (email, password) {
      var u = find(email);
      if (!u || (await hash(String(password || ""), u.salt)) !== u.hash) {
        throw new Error("Correo o contraseña incorrectos.");
      }
      write(K_SESSION, u.email);
      return u;
    },
    logout: function () {
      try { localStorage.removeItem(K_SESSION); } catch (e) { /* nada que borrar */ }
    },
    update: function (email, patch) {
      var list = users().map(function (u) {
        if (u.email !== email) return u;
        var next = Object.assign({}, u);
        if (patch.plan && PLANS.indexOf(patch.plan) !== -1) next.plan = patch.plan;
        if (patch.role === "usuario" || patch.role === "creador") next.role = patch.role;
        return next;
      });
      save(list);
    },
    remove: function (email) {
      save(users().filter(function (u) { return u.email !== email; }));
    },
  };
})();
