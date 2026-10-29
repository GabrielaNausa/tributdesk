(window.TDPages = window.TDPages || {}).normativa = function () {
  "use strict";

  var NORMAS = [
    { t: "Estatuto Tributario", n: "Decreto 624 de 1989", c: "Tributaria", d: "Compila las normas sustanciales y de procedimiento de los impuestos nacionales administrados por la DIAN: renta, IVA, retención en la fuente, procedimiento, sanciones, entre otros." },
    { t: "Reforma tributaria para la igualdad y la justicia social", n: "Ley 2277 de 2022", c: "Tributaria", d: "Modificó el Estatuto Tributario en materia de renta de personas naturales y jurídicas, ganancias ocasionales, impuestos saludables y otros aspectos." },
    { t: "Decreto Único Reglamentario en materia tributaria", n: "Decreto 1625 de 2016", c: "Tributaria", d: "Reúne en un solo texto los decretos reglamentarios del Estatuto Tributario, incluidas las reglas de retención en la fuente y de facturación." },
    { t: "Resolución de facturación electrónica", n: "Resolución DIAN 000042 de 2020", c: "Tributaria", d: "Desarrolla el sistema de facturación electrónica: documentos, habilitación y condiciones para los obligados a facturar." },
    { t: "Convergencia a Normas Internacionales de Información Financiera", n: "Ley 1314 de 2009", c: "Contable", d: "Regula los principios y normas de contabilidad e información financiera y de aseguramiento de la información aceptados en Colombia." },
    { t: "Decreto Único Reglamentario de Normas de Contabilidad, Información Financiera y Aseguramiento", n: "Decreto 2420 de 2015", c: "Contable", d: "Compila los marcos técnicos normativos de contabilidad e información financiera por grupos de preparadores." },
    { t: "Código Sustantivo del Trabajo", n: "Decreto 2663 de 1950", c: "Laboral", d: "Regula las relaciones individuales y colectivas de trabajo: contratos, jornada, prestaciones, terminación y régimen sancionatorio." },
    { t: "Sistema de Seguridad Social Integral", n: "Ley 100 de 1993", c: "Laboral", d: "Crea el sistema de seguridad social en pensiones, salud, riesgos laborales y servicios complementarios." },
    { t: "Código de Comercio", n: "Decreto 410 de 1971", c: "Comercial", d: "Norma base del derecho mercantil: comerciantes, sociedades, contratos mercantiles, títulos valores y obligaciones de llevar contabilidad." },
    { t: "Sociedad por Acciones Simplificada (SAS)", n: "Ley 1258 de 2008", c: "Comercial", d: "Crea la SAS como tipo societario flexible, con constitución por documento privado y libertad estatutaria." },
  ];

  try {
    var propias = JSON.parse(localStorage.getItem("td_normas")) || [];
    NORMAS = NORMAS.concat(propias);
  } catch (e) { /* sin normas propias */ }

  function esc(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }

  var list = document.getElementById("norm-list");
  var empty = document.getElementById("norm-empty");
  var input = document.getElementById("norm-q");
  var chips = document.getElementById("norm-chips");
  var cat = "Todas";

  function fold(s) {
    return String(s).normalize("NFD").replace(/\p{Diacritic}/gu, "").toLowerCase();
  }

  function render() {
    var q = fold(input.value.trim());
    var rows = NORMAS.filter(function (x) {
      return (cat === "Todas" || x.c === cat) && (!q || fold(x.t + " " + x.n + " " + x.c + " " + x.d).indexOf(q) !== -1);
    });
    list.innerHTML = rows
      .map(function (x, i) {
        return (
          '<article class="norm"><div class="norm-row">' +
          '<span class="tile">' + TD.svg("file-text", 20) + "</span>" +
          '<div class="norm-main"><strong>' + esc(x.t) + "</strong><span>" + esc(x.n) + "</span></div>" +
          '<span class="badge">' + esc(x.c) + "</span>" +
          '<button class="norm-more" type="button" aria-expanded="false" aria-controls="nd-' + i + '">Ver más</button></div>' +
          '<div class="norm-detail" id="nd-' + i + '" hidden>' + esc(x.d) + "</div></article>"
        );
      })
      .join("");
    empty.hidden = rows.length > 0;
  }

  list.addEventListener("click", function (e) {
    var btn = e.target.closest(".norm-more");
    if (!btn) return;
    var panel = document.getElementById(btn.getAttribute("aria-controls"));
    var open = btn.getAttribute("aria-expanded") === "true";
    btn.setAttribute("aria-expanded", String(!open));
    btn.textContent = open ? "Ver más" : "Ver menos";
    panel.hidden = open;
  });

  chips.addEventListener("click", function (e) {
    var b = e.target.closest(".chip");
    if (!b) return;
    cat = b.dataset.cat;
    chips.querySelectorAll(".chip").forEach(function (c) { c.setAttribute("aria-pressed", String(c === b)); });
    render();
  });
  input.addEventListener("input", render);

  render();
};
