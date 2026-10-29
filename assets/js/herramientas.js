(window.TDPages = window.TDPages || {}).herramientas = function () {
  "use strict";

  var cop = new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP", maximumFractionDigits: 0 });
  var num = new Intl.NumberFormat("es-CO", { maximumFractionDigits: 4 });
  function $(id) { return document.getElementById(id); }
  function val(id) { var v = parseFloat($(id).value); return isFinite(v) && v >= 0 ? v : null; }
  function money(v) { return v === null ? "—" : cop.format(v); }

  // ---------- IVA ----------
  var mode = "add";
  function iva() {
    var v = val("iva-valor");
    var r = parseFloat($("iva-tarifa").value) / 100;
    if (v === null) { $("iva-base").textContent = $("iva-iva").textContent = $("iva-total").textContent = "—"; return; }
    var base, total;
    if (mode === "add") { base = v; total = v * (1 + r); }
    else { total = v; base = v / (1 + r); }
    $("iva-base").textContent = money(base);
    $("iva-iva").textContent = money(total - base);
    $("iva-total").textContent = money(total);
  }
  document.querySelectorAll("#tool-iva .seg button").forEach(function (b) {
    b.addEventListener("click", function () {
      mode = b.dataset.mode;
      document.querySelectorAll("#tool-iva .seg button").forEach(function (x) { x.setAttribute("aria-pressed", String(x === b)); });
      $("iva-valor-label").textContent = mode === "add" ? "Valor base (COP)" : "Valor total con IVA (COP)";
      iva();
    });
  });
  $("iva-valor").addEventListener("input", iva);
  $("iva-tarifa").addEventListener("change", iva);

  // ---------- UVT ----------
  function fromUvt() {
    var u = val("uvt-valor"), x = val("uvt-uvt");
    $("uvt-cop").value = u !== null && x !== null ? Math.round(u * x) : "";
  }
  function fromCop() {
    var u = val("uvt-valor"), c = val("uvt-cop");
    $("uvt-uvt").value = u && c !== null ? Number((c / u).toFixed(4)) : "";
  }
  $("uvt-uvt").addEventListener("input", fromUvt);
  $("uvt-cop").addEventListener("input", fromCop);
  $("uvt-valor").addEventListener("input", fromUvt);

  // ---------- Retención ----------
  function ret() {
    var base = val("ret-base");
    var sel = $("ret-tarifa").value;
    $("ret-custom-wrap").hidden = sel !== "custom";
    var rate = sel === "custom" ? val("ret-custom") : parseFloat(sel);
    if (base === null || rate === null) { $("ret-b").textContent = $("ret-r").textContent = $("ret-n").textContent = "—"; return; }
    var r = base * rate / 100;
    $("ret-b").textContent = money(base);
    $("ret-r").textContent = money(r) + " (" + num.format(rate) + " %)";
    $("ret-n").textContent = money(base - r);
  }
  ["ret-base", "ret-custom"].forEach(function (id) { $(id).addEventListener("input", ret); });
  $("ret-tarifa").addEventListener("change", ret);

  // ---------- fechas ----------
  var DAY = 86400000;
  function parseDate(s) {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(s || "")) return null;
    var p = s.split("-");
    return Date.UTC(+p[0], +p[1] - 1, +p[2]);
  }
  function todayUtc() {
    var n = new Date();
    return Date.UTC(n.getFullYear(), n.getMonth(), n.getDate());
  }

  // ---------- Sanciones ----------
  function monthsLate(dueStr, filedStr) {
    var due = parseDate(dueStr), filed = parseDate(filedStr);
    if (due === null || filed === null) return null;
    if (filed <= due) return 0;
    var a = new Date(due), b = new Date(filed);
    var m = (b.getUTCFullYear() - a.getUTCFullYear()) * 12 + (b.getUTCMonth() - a.getUTCMonth());
    if (b.getUTCDate() > a.getUTCDate()) m += 1;
    return Math.max(m, 1);
  }

  var BASE_LABELS = {
    imp: "Impuesto a cargo (COP)",
    ing: "Ingresos brutos del periodo (COP)",
    pat: "Patrimonio líquido del año anterior (COP)",
    cor: "Mayor valor a pagar o menor saldo a favor (COP)",
    ine: "Diferencia de impuesto por inexactitud (COP)",
  };

  function san() {
    var tipo = $("san-tipo").value;
    var caso = $("san-caso").value;
    $("san-ext").hidden = tipo !== "ext";
    $("san-cor-nivel").hidden = tipo !== "cor";
    $("san-base-label").textContent = BASE_LABELS[tipo === "ext" ? caso : tipo];

    var base = val("san-base");
    var min = 10 * (val("uvt-valor") || 0);
    $("san-min").textContent = money(min);

    var calc = null, detail = "Sanción calculada", none = false;
    if (base !== null) {
      if (tipo === "ext") {
        var m = monthsLate($("san-venc").value, $("san-pres").value);
        if (m === null) { detail = "Escribe las dos fechas"; }
        else if (m === 0) { none = true; calc = 0; detail = "Presentada a tiempo"; }
        else {
          var rate = caso === "imp" ? 0.05 : caso === "ing" ? 0.005 : 0.01;
          var cap = caso === "imp" ? 1 : caso === "ing" ? 0.05 : 0.1;
          calc = base * Math.min(rate * m, cap);
          detail = m + (m === 1 ? " mes" : " meses") + " de retardo";
        }
      } else if (tipo === "cor") {
        var r = parseFloat($("san-momento").value);
        calc = base * r;
        detail = num.format(r * 100) + " % del mayor valor";
      } else {
        calc = base;
        detail = "100 % de la diferencia";
      }
    }
    $("san-detail").textContent = detail;
    $("san-calc").textContent = calc === null ? "—" : money(calc);
    $("san-pay").textContent = calc === null ? "—" : none ? money(0) : money(Math.max(calc, min));
  }
  ["san-tipo", "san-caso", "san-momento", "san-venc", "san-pres"].forEach(function (id) { $(id).addEventListener("change", san); });
  ["san-base", "uvt-valor"].forEach(function (id) { $(id).addEventListener("input", san); });

  // ---------- Intereses de mora ----------
  var tramos = [{ d: "2026-03-12", h: "2026-04-30", r: "25" }];

  function drawTramos() {
    var box = $("int-rows");
    box.replaceChildren();
    tramos.forEach(function (t, i) {
      var row = document.createElement("div");
      row.className = "tramo";
      [["Desde", "date", "d"], ["Hasta", "date", "h"], ["Tasa EA (%)", "number", "r"]].forEach(function (f) {
        var wrap = document.createElement("div");
        wrap.className = "field";
        var lab = document.createElement("label");
        lab.htmlFor = "int-" + f[2] + i;
        lab.textContent = f[0];
        var inp = document.createElement("input");
        inp.type = f[1];
        inp.id = "int-" + f[2] + i;
        if (f[1] === "number") { inp.min = "0"; inp.step = "any"; inp.inputMode = "decimal"; }
        inp.value = t[f[2]];
        inp.addEventListener("input", function () { t[f[2]] = inp.value; interest(); });
        wrap.append(lab, inp);
        row.append(wrap);
      });
      if (tramos.length > 1) {
        var del = document.createElement("button");
        del.type = "button";
        del.className = "btn btn-outline btn-sm";
        del.textContent = "Quitar";
        del.setAttribute("aria-label", "Quitar tramo " + (i + 1));
        del.addEventListener("click", function () { tramos.splice(i, 1); drawTramos(); interest(); });
        row.append(del);
      }
      box.append(row);
    });
  }

  function interest() {
    var cap = val("int-capital");
    var days = 0, total = 0, ok = cap !== null;
    tramos.forEach(function (t) {
      var d = parseDate(t.d), h = parseDate(t.h), r = parseFloat(t.r);
      if (d === null || h === null || !isFinite(r) || r < 0 || h < d) { ok = false; return; }
      var n = Math.round((h - d) / DAY) + 1;
      days += n;
      if (cap !== null) total += cap * (Math.pow(1 + r / 100, 1 / 365) - 1) * n;
    });
    $("int-days").textContent = ok ? String(days) : "—";
    $("int-int").textContent = ok ? money(total) : "—";
    $("int-total").textContent = ok ? money(cap + total) : "—";
  }
  $("int-capital").addEventListener("input", interest);
  $("int-add").addEventListener("click", function () {
    var last = tramos[tramos.length - 1];
    var next = parseDate(last.h);
    var from = next === null ? "" : new Date(next + DAY).toISOString().slice(0, 10);
    tramos.push({ d: from, h: "", r: last.r });
    drawTramos();
    interest();
  });

  // ---------- Calendario de vencimientos ----------
  var K_CAL = "td_vencimientos";
  var storeOk = true;
  function loadCal() {
    try { return JSON.parse(localStorage.getItem(K_CAL)) || []; } catch (e) { storeOk = false; return []; }
  }
  function saveCal(list) {
    try { localStorage.setItem(K_CAL, JSON.stringify(list)); } catch (e) { storeOk = false; }
    if (!storeOk) $("cal-store").textContent = "Este navegador no permite guardar: los vencimientos se perderán al cerrar la página.";
  }
  var venc = loadCal();

  function status(fecha) {
    var diff = Math.round((parseDate(fecha) - todayUtc()) / DAY);
    if (diff < 0) return { cls: "late", text: "Vencido hace " + -diff + (diff === -1 ? " día" : " días") };
    if (diff === 0) return { cls: "soon", text: "Vence hoy" };
    if (diff <= 7) return { cls: "soon", text: "Faltan " + diff + (diff === 1 ? " día" : " días") };
    return { cls: "ok", text: "Faltan " + diff + " días" };
  }

  function drawCal() {
    var ul = $("cal-list");
    ul.replaceChildren();
    if (!venc.length) {
      var empty = document.createElement("li");
      empty.className = "venc-empty";
      empty.textContent = "Todavía no hay vencimientos. Agrega el primero con su fecha límite.";
      ul.append(empty);
      return;
    }
    venc.slice().sort(function (a, b) { return a.f < b.f ? -1 : a.f > b.f ? 1 : 0; }).forEach(function (v) {
      var st = status(v.f);
      var li = document.createElement("li");
      li.className = "venc";
      var main = document.createElement("div");
      main.className = "venc-main";
      var t = document.createElement("strong");
      t.textContent = v.n;
      var s = document.createElement("span");
      s.textContent = (v.c ? v.c + " · " : "") + new Date(parseDate(v.f)).toLocaleDateString("es-CO", { timeZone: "UTC", day: "numeric", month: "long", year: "numeric" });
      main.append(t, s);
      var pill = document.createElement("span");
      pill.className = "pill pill-" + st.cls;
      pill.textContent = st.text;
      var del = document.createElement("button");
      del.type = "button";
      del.className = "btn btn-outline btn-sm";
      del.textContent = "Quitar";
      del.setAttribute("aria-label", "Quitar " + v.n);
      del.addEventListener("click", function () {
        venc = venc.filter(function (x) { return x.id !== v.id; });
        saveCal(venc);
        drawCal();
      });
      li.append(main, pill, del);
      ul.append(li);
    });
  }

  $("cal-obl").addEventListener("change", function () { $("cal-otra-wrap").hidden = $("cal-obl").value !== "otra"; });
  $("cal-form").addEventListener("submit", function (e) {
    e.preventDefault();
    var msg = $("cal-msg");
    var sel = $("cal-obl");
    var name = sel.value === "otra" ? $("cal-otra").value.trim() : sel.value;
    var fecha = $("cal-fecha").value;
    if (!name || parseDate(fecha) === null) {
      msg.textContent = "Escribe el nombre de la obligación y elige la fecha límite.";
      msg.hidden = false;
      return;
    }
    msg.hidden = true;
    venc.push({ id: String(Date.now()) + Math.random().toString(36).slice(2, 6), n: name, c: $("cal-cliente").value.trim(), f: fecha });
    saveCal(venc);
    $("cal-cliente").value = "";
    drawCal();
  });

  // ---------- Calendario DIAN ----------
  var DIAN = window.TD_DIAN;
  var PRESETS = {
    empresa: ["retencion", "iva-bim", "renta-pj"],
    natural: ["renta-pn", "iva-cuat"],
    gran: ["renta-gc", "iva-bim", "retencion"],
  };
  var selected = {};
  PRESETS.empresa.forEach(function (id) { selected[id] = true; });
  var upcoming = [];

  function drawObl() {
    var box = $("dian-obl");
    box.replaceChildren();
    var groups = {};
    DIAN.obligaciones.forEach(function (o) { (groups[o.grupo] = groups[o.grupo] || []).push(o); });
    Object.keys(groups).forEach(function (g) {
      var fs = document.createElement("fieldset");
      fs.className = "oblgroup";
      var lg = document.createElement("legend");
      lg.textContent = g;
      fs.append(lg);
      groups[g].forEach(function (o) {
        var lab = document.createElement("label");
        lab.className = "check";
        var cb = document.createElement("input");
        cb.type = "checkbox";
        cb.checked = !!selected[o.id];
        cb.addEventListener("change", function () { selected[o.id] = cb.checked; dian(); });
        lab.append(cb, " " + o.nombre);
        fs.append(lab);
      });
      box.append(fs);
    });
  }

  function nitParts() {
    var digits = $("dian-nit").value.replace(/\D/g, "");
    if (!digits) return null;
    return { digits: digits, last: parseInt(digits.slice(-1), 10), last2: parseInt(digits.slice(-2), 10) };
  }

  function pick(fechas, n) {
    if (fechas.length === 10) return fechas[n.last === 0 ? 9 : n.last - 1];
    if (fechas.length === 5) return fechas[Math.floor(((n.last === 0 ? 10 : n.last) - 1) / 2)];
    return fechas[Math.floor(((n.last2 === 0 ? 100 : n.last2) - 1) / 2)];
  }

  function dstatus(f) {
    var diff = Math.round((parseDate(f) - todayUtc()) / DAY);
    if (diff < 0) return { cls: "past", text: "Pasó hace " + -diff + (diff === -1 ? " día" : " días"), past: true };
    return status(f);
  }

  function longDate(f) {
    return new Date(parseDate(f)).toLocaleDateString("es-CO", { timeZone: "UTC", weekday: "short", day: "numeric", month: "long", year: "numeric" });
  }

  function clienteLabel(n) { return $("dian-cliente").value.trim() || "NIT " + n.digits; }

  function addVenc(it, n) {
    var name = it.o.nombre + " - " + it.p.periodo;
    var cli = clienteLabel(n);
    var dup = venc.some(function (v) { return v.n === name && v.f === it.f && v.c === cli; });
    if (dup) return false;
    venc.push({ id: String(Date.now()) + Math.random().toString(36).slice(2, 6), n: name, c: cli, f: it.f });
    return true;
  }

  function dian() {
    var n = nitParts();
    var msg = $("dian-msg");
    var ul = $("dian-list");
    var notas = $("dian-notas");
    ul.replaceChildren();
    notas.replaceChildren();
    upcoming = [];
    function emptyRow(text) {
      var li = document.createElement("li");
      li.className = "venc-empty";
      li.textContent = text;
      ul.append(li);
    }
    if (!n) { msg.textContent = "Escribe el NIT o la cédula para ver las fechas."; msg.hidden = false; emptyRow("Escribe el NIT o la cédula."); return; }
    msg.hidden = true;

    var items = [];
    DIAN.obligaciones.forEach(function (o) {
      if (!selected[o.id]) return;
      o.periodos.forEach(function (p) { items.push({ o: o, p: p, f: p.fecha || pick(p.fechas, n) }); });
      var li = document.createElement("li");
      var b = document.createElement("strong");
      b.textContent = o.nombre + ": ";
      li.append(b, o.nota);
      notas.append(li);
    });
    if (!items.length) { emptyRow("Elige al menos una obligación."); return; }

    items.sort(function (a, b) { return a.f < b.f ? -1 : a.f > b.f ? 1 : a.o.nombre < b.o.nombre ? -1 : 1; });
    var showPast = $("dian-pasadas").checked;
    var shown = items.filter(function (it) { return showPast || !dstatus(it.f).past; });
    if (!shown.length) { emptyRow("No quedan fechas pendientes para estas obligaciones en 2026. Marque “Mostrar fechas que ya pasaron” para verlas."); return; }

    shown.forEach(function (it) {
      var st = dstatus(it.f);
      if (!st.past) upcoming.push(it);
      var li = document.createElement("li");
      li.className = "venc";
      var main = document.createElement("div");
      main.className = "venc-main";
      var t = document.createElement("strong");
      t.textContent = it.o.nombre;
      var s = document.createElement("span");
      s.textContent = it.p.periodo + " · " + longDate(it.f);
      main.append(t, s);
      var pill = document.createElement("span");
      pill.className = "pill pill-" + st.cls;
      pill.textContent = st.text;
      var add = document.createElement("button");
      add.type = "button";
      add.className = "btn btn-outline btn-sm";
      var name = it.o.nombre + " - " + it.p.periodo;
      var cli = clienteLabel(n);
      var already = venc.some(function (v) { return v.n === name && v.f === it.f && v.c === cli; });
      add.textContent = already ? "Agregada" : "Agregar";
      add.disabled = already;
      add.setAttribute("aria-label", "Agregar a Mis vencimientos: " + name);
      add.addEventListener("click", function () {
        if (addVenc(it, n)) { saveCal(venc); drawCal(); dian(); }
      });
      li.append(main, pill, add);
      ul.append(li);
    });
  }

  document.querySelectorAll("#tool-dian [data-preset]").forEach(function (b) {
    b.addEventListener("click", function () {
      var k = b.dataset.preset;
      selected = {};
      if (k === "todas") DIAN.obligaciones.forEach(function (o) { selected[o.id] = true; });
      else if (PRESETS[k]) PRESETS[k].forEach(function (id) { selected[id] = true; });
      drawObl();
      dian();
    });
  });
  $("dian-nit").addEventListener("input", dian);
  $("dian-cliente").addEventListener("input", dian);
  $("dian-pasadas").addEventListener("change", dian);
  $("dian-addall").addEventListener("click", function () {
    var n = nitParts();
    if (!n || !upcoming.length) return;
    var added = 0;
    upcoming.forEach(function (it) { if (addVenc(it, n)) added++; });
    if (added) { saveCal(venc); drawCal(); }
    dian();
    var msg = $("dian-msg");
    msg.textContent = added ? added + (added === 1 ? " fecha agregada" : " fechas agregadas") + " a Mis vencimientos." : "Esas fechas ya estaban en Mis vencimientos.";
    msg.hidden = false;
  });

  var src = $("dian-fuente");
  var a = document.createElement("a");
  a.href = DIAN.pdf;
  a.target = "_blank";
  a.rel = "noopener noreferrer";
  a.textContent = "PDF oficial de la DIAN";
  src.append("Fuente: ", a, " (" + DIAN.version + "). Última revisión: 29 de octubre de 2026. Las fechas se copiaron del PDF oficial y se verificaron con la regla de días hábiles del Decreto 2229 de 2023. Si la DIAN publica cambios, confirme en dian.gov.co antes de presentar.");

  iva(); fromUvt(); ret(); san(); drawTramos(); interest(); drawCal(); drawObl(); dian();
};
