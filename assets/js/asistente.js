(window.TDPages = window.TDPages || {}).asistente = function () {
  "use strict";

  var KB = [
    { k: ["plazo", "calendario", "vencimiento", "cuando declarar", "fecha"],
      a: "Los plazos para declarar y pagar los fija el Gobierno Nacional por decreto, normalmente según el último dígito del NIT o de la cédula. Consulta el calendario tributario vigente en dian.gov.co y confirma tu fecha antes de presentar." },
    { k: ["renta", "declaracion de renta", "declarar renta"],
      a: "La declaración de renta se presenta anualmente. Quiénes deben declarar depende de topes de ingresos, patrimonio, consumos y otras condiciones expresados en UVT. Revisa los topes del año gravable en el Estatuto Tributario y en el decreto de plazos vigente." },
    { k: ["iva", "valor agregado"],
      a: "El IVA es un impuesto nacional sobre la venta de bienes, la prestación de servicios y las importaciones. La tarifa general es del 19 % (art. 468 del Estatuto Tributario); existen tarifas diferenciales como el 5 % y bienes o servicios excluidos o exentos. Puedes estimar valores en Herramientas > Calculadora de IVA." },
    { k: ["retencion", "retefuente", "rete fuente"],
      a: "La retención en la fuente es un mecanismo de recaudo anticipado: quien paga descuenta una parte del impuesto del beneficiario. La tarifa depende del concepto (compras, servicios, honorarios, etc.) y de bases mínimas expresadas en UVT. Revisa el Decreto 1625 de 2016 y simula en Herramientas > Retención en la fuente." },
    { k: ["sancion", "extemporane", "inexactitud"],
      a: "Las sanciones tributarias (por extemporaneidad, corrección, inexactitud, entre otras) están en el Estatuto Tributario y tienen un valor mínimo expresado en UVT. Puedes estimar las más comunes en Herramientas > Liquidador de sanciones. Es una estimación: confirma reducciones y casos especiales en la norma vigente." },
    { k: ["mora", "intereses"],
      a: "Los intereses de mora se calculan sobre el valor adeudado por cada día de retraso, con la tasa que corresponda a cada periodo según la Superfinanciera y el Estatuto Tributario. Puedes simular el cálculo por tramos en Herramientas > Intereses de mora." },
    { k: ["uvt", "unidad de valor tributario"],
      a: "La UVT (Unidad de Valor Tributario) es la medida que usa la DIAN para expresar topes, bases y sanciones. Se actualiza cada año. Puedes convertir entre UVT y pesos en Herramientas > Conversor UVT." },
    { k: ["factura electronica", "facturacion", "factura"],
      a: "La facturación electrónica la regula la DIAN (por ejemplo, la Resolución 000042 de 2020). Los obligados deben habilitarse ante la DIAN y expedir los documentos electrónicos con los requisitos que fija la norma. Verifica si tu cliente es obligado y las condiciones vigentes." },
    { k: ["nomina", "seguridad social", "pila"],
      a: "La nómina involucra salario, aportes a seguridad social y parafiscales, y prestaciones. Las reglas base están en el Código Sustantivo del Trabajo y la Ley 100 de 1993. Confirma las tarifas y topes vigentes para el periodo." },
  ];

  function fold(s) { return String(s).normalize("NFD").replace(/\p{Diacritic}/gu, "").toLowerCase(); }

  function answer(q) {
    var f = fold(q);
    for (var i = 0; i < KB.length; i++) {
      for (var j = 0; j < KB[i].k.length; j++) {
        if (f.indexOf(KB[i].k[j]) !== -1) return KB[i].a;
      }
    }
    return "Todavía no tengo una respuesta preparada para esa consulta en este modo de demostración. Puedes buscar la norma relacionada en la sección Normativa o preguntarme sobre IVA, retención en la fuente, UVT, plazos, factura electrónica o renta.";
  }

  var log = document.getElementById("chat-log");
  var form = document.getElementById("chat-form");
  var input = document.getElementById("chat-input");
  var suggest = document.getElementById("chat-suggest");

  function add(cls, text) {
    var d = document.createElement("div");
    d.className = "msg " + cls;
    d.textContent = text;
    log.appendChild(d);
    log.scrollTop = log.scrollHeight;
    return d;
  }

  function ask(q) {
    q = q.trim();
    if (!q) return;
    add("me", q);
    suggest.hidden = true;
    var typing = add("bot", "…");
    setTimeout(function () {
      typing.textContent = answer(q);
      log.scrollTop = log.scrollHeight;
    }, 500);
  }

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    var q = input.value;
    input.value = "";
    ask(q);
  });
  suggest.addEventListener("click", function (e) {
    var b = e.target.closest("button");
    if (b) ask(b.textContent);
  });
};
