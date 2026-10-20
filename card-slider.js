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
