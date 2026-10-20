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

(function () {
  var sliders = document.querySelectorAll(".slider");
  if (!sliders.length) return;

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
