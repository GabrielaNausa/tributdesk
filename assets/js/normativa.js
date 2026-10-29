(window.TDPages = window.TDPages || {}).normativa = function () {
  "use strict";

  var FP = "https://www.funcionpublica.gov.co/eva/gestornormativo/";
  var DIAN = "https://normograma.dian.gov.co/dian/compilacion/docs/";
  function fp(id) { return { pdf: FP + "norma_pdf.php?i=" + id, web: FP + "norma.php?i=" + id, webLabel: "Ficha en el Gestor Normativo" }; }
  function dian(name) { return { web: DIAN + name + ".htm", webLabel: "Texto en el normograma de la DIAN" }; }
  function both(id, name) {
    var o = fp(id);
    o.web2 = DIAN + name + ".htm";
    o.web2Label = "Texto en el normograma de la DIAN";
    return o;
  }
  function norma(t, n, c, d, links, extra) { return Object.assign({ t: t, n: n, c: c, d: d }, links, extra || {}); }

  var NORMAS = [
    norma("Estatuto Tributario", "Decreto 624 de 1989", "Tributaria",
      "Compila las normas sustanciales y de procedimiento de los impuestos nacionales administrados por la DIAN: renta, IVA, retención en la fuente, procedimiento, sanciones, entre otros.",
      both(6533, "estatuto_tributario")),
    norma("Reforma tributaria para la igualdad y la justicia social", "Ley 2277 de 2022", "Tributaria",
      "Modificó el Estatuto Tributario en materia de renta de personas naturales y jurídicas, ganancias ocasionales, impuestos saludables y otros aspectos.",
      both(199883, "ley_2277_2022"), { r: true }),
    norma("Ley de Inversión Social", "Ley 2155 de 2021", "Tributaria",
      "Expidió la ley de inversión social e incluyó medidas tributarias que modificaron el Estatuto Tributario, entre ellas ajustes al Régimen Simple de Tributación.",
      dian("ley_2155_2021"), { r: true }),
    norma("Ley de crecimiento económico", "Ley 2010 de 2019", "Tributaria",
      "Adoptó normas para la promoción del crecimiento económico, el empleo, la inversión y el fortalecimiento de las finanzas públicas, con medidas de progresividad, equidad y eficiencia del sistema tributario.",
      dian("ley_2010_2019"), { r: true }),
    norma("Ley de financiamiento", "Ley 1943 de 2018", "Tributaria",
      "Reforma tributaria de 2018. La Corte Constitucional la declaró inexequible (Sentencia C-481 de 2019) y fue reemplazada por la Ley 2010 de 2019. Se conserva como referencia histórica.",
      dian("ley_1943_2018"), { r: true, aviso: "Inexequible" }),
    norma("Reforma tributaria estructural", "Ley 1819 de 2016", "Tributaria",
      "Adoptó una reforma tributaria estructural y fortaleció los mecanismos contra la evasión y la elusión fiscales.",
      dian("ley_1819_2016"), { r: true }),
    norma("Modificación del Estatuto Tributario y lucha contra la evasión", "Ley 1739 de 2014", "Tributaria",
      "Modificó el Estatuto Tributario y la Ley 1607 de 2012, y creó mecanismos de lucha contra la evasión.",
      dian("ley_1739_2014"), { r: true }),
    norma("Reforma tributaria de 2012", "Ley 1607 de 2012", "Tributaria",
      "Expidió normas en materia tributaria. Incluyó el impuesto sobre la renta para la equidad (CREE), que normas posteriores derogaron.",
      dian("ley_1607_2012"), { r: true }),
    norma("Decreto Único Reglamentario en materia tributaria", "Decreto 1625 de 2016", "Tributaria",
      "Reúne en un solo texto los decretos reglamentarios del Estatuto Tributario, incluidas las reglas de retención en la fuente y de facturación. Se modifica con frecuencia: revise la versión vigente.",
      both(83233, "decreto_1625_2016")),
    norma("Resolución de facturación electrónica", "Resolución DIAN 000042 de 2020", "Tributaria",
      "Desarrolla el sistema de facturación electrónica: documentos, habilitación y condiciones para los obligados a facturar.",
      dian("resolucion_dian_0042_2020")),

    norma("Convergencia a Normas Internacionales de Información Financiera", "Ley 1314 de 2009", "Contable",
      "Regula los principios y normas de contabilidad e información financiera y de aseguramiento de la información aceptados en Colombia.",
      fp(36833)),
    norma("Decreto Único Reglamentario de Normas de Contabilidad, Información Financiera y Aseguramiento", "Decreto 2420 de 2015", "Contable",
      "Compila los marcos técnicos normativos de contabilidad e información financiera por grupos de preparadores. Tiene varias modificaciones posteriores.",
      fp(76745)),
    norma("Reglamentación de la profesión de Contador Público", "Ley 43 de 1990", "Contable",
      "Adiciona la Ley 145 de 1960, reglamentaria de la profesión de Contador Público: inscripción, fe pública y ejercicio profesional.",
      fp(66148)),

    norma("Código Sustantivo del Trabajo", "Decreto 2663 de 1950", "Laboral",
      "Regula las relaciones individuales y colectivas de trabajo: contratos, jornada, prestaciones, terminación y régimen sancionatorio. Tiene modificaciones y sentencias posteriores.",
      fp(199983)),
    norma("Sistema de Seguridad Social Integral", "Ley 100 de 1993", "Laboral",
      "Crea el sistema de seguridad social en pensiones, salud, riesgos laborales y servicios complementarios.",
      fp(5248)),
    norma("Reforma laboral", "Ley 2466 de 2025", "Laboral",
      "Adopta una reforma laboral que modifica el Código Sustantivo del Trabajo, la Ley 50 de 1990, la Ley 789 de 2002 y otras normas laborales.",
      fp(260676), { r: true }),

    norma("Código de Comercio", "Decreto 410 de 1971", "Comercial",
      "Norma base del derecho mercantil: comerciantes, sociedades, contratos mercantiles, títulos valores y obligaciones de llevar contabilidad. Algunas partes fueron declaradas inexequibles: revise la versión vigente.",
      fp(41102)),
    norma("Sociedad por Acciones Simplificada (SAS)", "Ley 1258 de 2008", "Comercial",
      "Crea la SAS como tipo societario flexible, con constitución por documento privado y libertad estatutaria.",
      fp(34130)),
    norma("Régimen de sociedades", "Ley 222 de 1995", "Comercial",
      "Modifica el Libro II del Código de Comercio, que trata de las sociedades comerciales.",
      fp(6739)),
    norma("Régimen de insolvencia empresarial", "Ley 1116 de 2006", "Comercial",
      "Establece los procesos de reorganización y de liquidación judicial para la protección del crédito y la recuperación de la empresa.",
      fp(22657)),
    norma("Protección de datos personales", "Ley 1581 de 2012", "Comercial",
      "Desarrolla el derecho a conocer, actualizar y rectificar la información recogida en bases de datos. Aplica a toda empresa que trate datos de clientes, empleados o proveedores.",
      fp(49981)),
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
  function link(url, text) {
    return '<a href="' + esc(url) + '" target="_blank" rel="noopener noreferrer">' + esc(text) + "</a>";
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
      var inCat = cat === "Todas" || x.c === cat || (cat === "Reformas" && x.r);
      return inCat && (!q || fold(x.t + " " + x.n + " " + x.c + " " + x.d).indexOf(q) !== -1);
    });
    list.innerHTML = rows
      .map(function (x, i) {
        var quick = x.pdf ? link(x.pdf, "PDF") : x.web ? link(x.web, "Texto") : "";
        var details = esc(x.d);
        var links = [];
        if (x.pdf) links.push(link(x.pdf, "Abrir PDF oficial"));
        if (x.web) links.push(link(x.web, x.webLabel || "Ver texto oficial"));
        if (x.web2) links.push(link(x.web2, x.web2Label));
        if (links.length) details += '<p class="norm-links">' + links.join(" · ") + "</p>";
        return (
          '<article class="norm"><div class="norm-row">' +
          '<span class="tile">' + TD.svg("file-text", 20) + "</span>" +
          '<div class="norm-main"><strong>' + esc(x.t) + "</strong><span>" + esc(x.n) + "</span></div>" +
          '<span class="badges"><span class="badge">' + esc(x.c) + "</span>" +
          (x.r ? '<span class="badge badge-reform">Reforma</span>' : "") +
          (x.aviso ? '<span class="badge badge-warn">' + esc(x.aviso) + "</span>" : "") + "</span>" +
          (quick ? '<span class="norm-pdf">' + quick + "</span>" : "") +
          '<button class="norm-more" type="button" aria-expanded="false" aria-controls="nd-' + i + '">Ver más</button></div>' +
          '<div class="norm-detail" id="nd-' + i + '" hidden>' + details + "</div></article>"
        );
      })
      .join("");
    empty.hidden = rows.length > 0;
    var count = document.getElementById("norm-count");
    if (count) count.textContent = rows.length + (rows.length === 1 ? " norma" : " normas");
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
