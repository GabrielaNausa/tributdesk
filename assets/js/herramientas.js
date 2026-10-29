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

  iva(); fromUvt(); ret();
};
