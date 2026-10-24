document.addEventListener("DOMContentLoaded", function () {
  document.querySelectorAll(".slider").forEach(function (slider) {
    var imgs = slider.querySelectorAll("img");
    if (imgs.length < 2) return;

    var interval = parseInt(slider.dataset.interval, 10) || 4000;
    var i = 0;
    var timer;

    function show(n) {
      imgs[i].classList.remove("active");
      i = n % imgs.length;
      imgs[i].classList.add("active");
    }

    function start() {
      timer = setInterval(function () { show(i + 1); }, interval);
    }

    function stop() { clearInterval(timer); }

    start();
    slider.addEventListener("mouseenter", stop);
    slider.addEventListener("mouseleave", start);
  });
});

(function () {
  var stage = document.getElementById("v3d-stage");
  if (!stage) return;

  // Pulsante "Apri" al posto del modello
  var openBtn = document.createElement("button");
  openBtn.type = "button";
  openBtn.className = "v3d-open";
  openBtn.textContent = "Apri modello 3D →";
  stage.parentNode.insertBefore(openBtn, stage);

  // Pulsante "Chiudi" dentro il modello
  var closeBtn = document.createElement("button");
  closeBtn.type = "button";
  closeBtn.className = "v3d-close";
  closeBtn.textContent = "Chiudi 3D";
  stage.appendChild(closeBtn);

  function apri() {
    stage.classList.add("aperto");
    openBtn.classList.add("nascosto");
    // avvisa il modello che ora ha una dimensione
    setTimeout(function () {
      window.dispatchEvent(new Event("resize"));
    }, 50);
  }

  function chiudi() {
    stage.classList.remove("aperto");
    openBtn.classList.remove("nascosto");
  }

  openBtn.addEventListener("click", apri);
  closeBtn.addEventListener("click", chiudi);

  // Il link "3D EXPERIENCE" nel menu apre il modello
  document.querySelectorAll('.nav a[href="#v3d-stage"]').forEach(function (link) {
    link.addEventListener("click", function () {
      if (window.matchMedia("(max-width: 600px)").matches) {
        apri();
        setTimeout(function () {
          stage.scrollIntoView({ behavior: "smooth", block: "start" });
        }, 100);
      }
    });
  });
})();


  /* =====================================
   VISUALIZZATORE IMMAGINI A SCHERMO INTERO
===================================== */
(function () {
  var sliders = document.querySelectorAll(".slider");
  if (!sliders.length) return;

  // Crea il visualizzatore una sola volta
  var lb = document.createElement("div");
  lb.className = "lb";
  lb.innerHTML =
    '<button class="lb-close" type="button" aria-label="Chiudi">&#10005;</button>' +
    '<button class="lb-prev" type="button" aria-label="Precedente">&#8592;</button>' +
    '<button class="lb-next" type="button" aria-label="Successiva">&#8594;</button>' +
    '<div class="lb-stage"><img alt=""></div>' +
    '<div class="lb-count"></div>';
  document.body.appendChild(lb);

  var stage = lb.querySelector(".lb-stage");
  var img = stage.querySelector("img");
  var count = lb.querySelector(".lb-count");
  var prev = lb.querySelector(".lb-prev");
  var next = lb.querySelector(".lb-next");
  var closeBtn = lb.querySelector(".lb-close");

  var lista = [];
  var i = 0;

  function mostra(n) {
    i = Math.max(0, Math.min(n, lista.length - 1));

    img.classList.remove("zoom");
    img.src = lista[i].src;
    img.alt = lista[i].alt;

    stage.scrollTop = 0;
    stage.scrollLeft = 0;

    var molte = lista.length > 1;
    count.textContent = molte ? (i + 1) + " / " + lista.length : "";
    prev.style.display = molte ? "" : "none";
    next.style.display = molte ? "" : "none";
    prev.disabled = i === 0;
    next.disabled = i === lista.length - 1;
  }

  function apri(slider) {
    lista = Array.prototype.slice.call(slider.querySelectorAll("img"));
    var attiva = slider.querySelector("img.active");
    var indice = lista.indexOf(attiva);

    mostra(indice >= 0 ? indice : 0);
    lb.classList.add("aperto");
    document.body.classList.add("lb-aperto");
  }

  function chiudi() {
    lb.classList.remove("aperto");
    document.body.classList.remove("lb-aperto");
  }

  // Click su un'immagine di una card: apre il visualizzatore
  sliders.forEach(function (slider) {
    slider.addEventListener("click", function () {
      apri(slider);
    });
  });

  // Pulsanti
  closeBtn.addEventListener("click", chiudi);
  prev.addEventListener("click", function () { mostra(i - 1); });
  next.addEventListener("click", function () { mostra(i + 1); });

  // Tocco sullo sfondo scuro: chiude
  lb.addEventListener("click", function (e) {
    if (e.target === lb || e.target === stage) chiudi();
  });

  // Tocco sull'immagine: ingrandisce / riduce
  img.addEventListener("click", function () {
    img.classList.toggle("zoom");
  });

  // Tastiera
  document.addEventListener("keydown", function (e) {
    if (!lb.classList.contains("aperto")) return;

    if (e.key === "Escape") chiudi();
    if (e.key === "ArrowRight") mostra(i + 1);
    if (e.key === "ArrowLeft") mostra(i - 1);
  });

  // Swipe sul telefono (solo se l'immagine non è ingrandita)
  var x0 = null;

  stage.addEventListener("touchstart", function (e) {
    x0 = img.classList.contains("zoom") ? null : e.touches[0].clientX;
  }, { passive: true });

  stage.addEventListener("touchend", function (e) {
    if (x0 === null) return;

    var dx = e.changedTouches[0].clientX - x0;
    if (Math.abs(dx) > 50) {
      mostra(dx < 0 ? i + 1 : i - 1);
    }
    x0 = null;
  }, { passive: true });
})();
/* =====================================
   PROGETTI IN EVIDENZA: PIANTA CHE SI ALZA (solo telefono)
   Legge immagini e testi dalle schede in .cards
===================================== */
(function () {

  var mq = window.matchMedia("(max-width: 700px)");
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var SCROLL = 0.62;   // più alto = scroll più lungo (più lento)
  var CHARS = 3;       // lettere scritte a ogni passo
  var DELAY = 16;      // millisecondi tra un passo e l'altro

  var section = document.getElementById("progetti");
  if (!section) return;

  var cards = section.querySelectorAll(".card-slider");
  if (!cards.length) return;

  /* ---------- costruzione dei blocchi dalle schede ---------- */

  var old = section.querySelector(".pj-story");
  if (old) old.remove();

  var story = document.createElement("div");
  story.className = "pj-story";

  Array.prototype.forEach.call(cards, function (card, idx) {

    var imgs = card.querySelectorAll(".slider img");
    var textEl = card.querySelector(".card-text");
    var text = textEl ? textEl.textContent.replace(/\s+/g, " ").trim() : "";

    var block = document.createElement("div");
    block.className = "pj-block";

    var stg = document.createElement("div");
    stg.className = "pj-stage";

    var view = document.createElement("div");
    view.className = "pj-view";

    Array.prototype.forEach.call(imgs, function (im) {
      var s = document.createElement("img");
      s.className = "pj-slide";
      s.src = im.currentSrc || im.src;     // funziona anche con spazi e parentesi nel nome
      s.alt = im.getAttribute("alt") || "";
      view.appendChild(s);
    });

    var box = document.createElement("div");
    box.className = "pj-text";

    var label = document.createElement("span");
    label.className = "pj-label";
    label.textContent = "PROGETTO 0" + (idx + 1);

    var body = document.createElement("p");
    body.className = "pj-body";
    body.setAttribute("data-text", text);

    box.appendChild(label);
    box.appendChild(body);
    stg.appendChild(view);
    stg.appendChild(box);
    block.appendChild(stg);
    story.appendChild(block);
  });

  section.appendChild(story);

  /* ---------- effetto allo scroll ---------- */

  var blocks = Array.prototype.slice.call(story.querySelectorAll(".pj-block"));

  function cl(v, a, b) { return Math.min(b, Math.max(a, v)); }
  function sm(x) { x = cl(x, 0, 1); return x * x * (3 - 2 * x); }
  function ease(f) { return sm((f - 0.2) / 0.6); }   // breve pausa su ogni immagine

  blocks.forEach(function (b) {
    b.slides = Array.prototype.slice.call(b.querySelectorAll(".pj-slide"));
    b.stage = b.querySelector(".pj-stage");
    b.body = b.querySelector(".pj-body");
    b.token = 0;
    b.typed = false;
  });

  // Altezza del blocco = quanto devi scorrere per vedere tutto
  function size(b) {
    b.style.height =
      (b.stage.offsetHeight + window.innerHeight * (b.slides.length + 1.6) * SCROLL) + "px";
  }

  // d = distanza dell'immagine dalla posizione "in piedi davanti a te"
  //  d > 0: è ancora distesa a terra, lontana
  //  d < 0: si è alzata e sale sopra di te
  function effect(d, S) {
    var z = -d * 560, rx, y, op, bl = 0;

    if (d >= 0) {
      var k = sm(d / 1.4);
      rx = 82 * k;
      y = k * S * 0.26;
      op = 1 - cl((d - 1.7) * 0.6, 0, 1);
      bl = Math.min(3, d * 1.2);
    } else {
      var q = sm(-d / 0.9);
      rx = -85 * q;
      y = -q * S * 0.34;
      op = 1 - sm((-d - 0.25) / 0.6);
    }

    return {
      transform: "translate3d(0," + y + "px," + z + "px) rotateX(" + rx + "deg)",
      opacity: op,
      blur: bl
    };
  }

  // Scrittura lettera per lettera (veloce)
  function typeText(b) {
    var my = ++b.token;
    b.typed = true;
    var full = b.body.getAttribute("data-text") || "";
    var k = 0;
    b.body.classList.add("typing");

    (function step() {
      if (my !== b.token) return;
      k = reduce ? full.length : k + CHARS;
      b.body.textContent = full.slice(0, k);
      if (k < full.length) {
        setTimeout(step, DELAY);
      } else {
        b.body.classList.remove("typing");
      }
    })();
  }

  function clearText(b) {
    b.token++;
    b.typed = false;
    b.body.textContent = "";
    b.body.classList.remove("typing");
  }

  function update(b) {
    var n = b.slides.length;
    if (!n) return;

    var top = parseFloat(getComputedStyle(b.stage).top) || 0;
    var dist = b.offsetHeight - b.stage.offsetHeight;
    if (dist <= 0) return;

    var p = cl((top - b.getBoundingClientRect().top) / dist, 0, 1);
    var u = p * (n - 1 + 0.9);
    var t = Math.min(u, n - 1);
    var base = Math.floor(t);
    var te = t >= n - 1 ? n - 1 : base + ease(t - base);
    var S = b.stage.offsetHeight;

    b.slides.forEach(function (s, i) {
      var d = i - te;
      var f = reduce
        ? { transform: "none", opacity: 1 - cl(Math.abs(d), 0, 1), blur: 0 }
        : effect(d, S);

      s.style.transform = f.transform;
      s.style.opacity = Math.max(0, f.opacity);
      s.style.filter = f.blur > 0.4 ? "blur(" + f.blur.toFixed(1) + "px)" : "none";
      s.style.visibility = f.opacity <= 0.01 ? "hidden" : "visible";
      s.style.zIndex = 100 - i;
    });

    var textOn = u > n - 1 + 0.35;
    if (textOn && !b.typed) typeText(b);
    else if (!textOn && b.typed) clearText(b);
  }

  var ticking = false;

  function onScroll() {
    if (ticking || !mq.matches) return;
    ticking = true;
    requestAnimationFrame(function () {
      ticking = false;
      blocks.forEach(update);
    });
  }

  function init() {
    blocks.forEach(function (b) {
      if (mq.matches) {
        size(b);
        update(b);
      } else {
        b.style.height = "";
        clearText(b);
      }
    });
  }

  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", init);
  window.addEventListener("load", init);
  init();

})();
