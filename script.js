document.addEventListener("DOMContentLoaded", function () {

    /* =====================================
       VIDEO: RIPRODUZIONE AUTOMATICA
    ===================================== */

    const video = document.querySelector(".hero-video");

    if (video) {
        video.play().catch(function () {
            console.log("Autoplay bloccato dal browser.");
        });
    }


    /* =====================================
       GALLERIA: ELEMENTI HTML
    ===================================== */

    const carousel = document.querySelector(".gallery-carousel");

    if (!carousel) {
        console.warn("Galleria non trovata nell'HTML.");
        return;
    }

    const viewport = carousel.querySelector(".gallery-viewport");
    const track = carousel.querySelector(".gallery-track");

    const slides = track
        ? Array.from(track.querySelectorAll(".gallery-slide"))
        : [];

    const prevButton =
        carousel.querySelector("#gallery-prev") ||
        carousel.querySelector(".gallery-prev");

    const nextButton =
        carousel.querySelector("#gallery-next") ||
        carousel.querySelector(".gallery-next");

    const progress = document.querySelector(".gallery-progress-bar");

    const counter =
        document.querySelector("#gallery-counter") ||
        document.querySelector("#my-counter");

    if (
        !viewport ||
        !track ||
        slides.length === 0 ||
        !prevButton ||
        !nextButton
    ) {
        console.error(
            "Galleria: controlla gli ID dei pulsanti e le classi nell'HTML."
        );
        return;
    }


    /* =====================================
       STATO DELLA GALLERIA
    ===================================== */

    let currentIndex = 0;

    let startX = 0;
    let startY = 0;
    let deltaX = 0;

    let dragging = false;
    let horizontalGesture = false;


    /* =====================================
       AGGIORNAMENTO DELLA GALLERIA
    ===================================== */

    function updateGallery() {

        track.style.transform =
            `translateX(-${currentIndex * 100}%)`;

        slides.forEach(function (slide, index) {
            slide.setAttribute(
                "aria-hidden",
                index === currentIndex ? "false" : "true"
            );
        });

        prevButton.disabled = currentIndex === 0;
        nextButton.disabled = currentIndex === slides.length - 1;

        prevButton.style.opacity =
            currentIndex === 0 ? "0.4" : "1";

        nextButton.style.opacity =
            currentIndex === slides.length - 1 ? "0.4" : "1";

        if (progress) {
            progress.style.width =
                `${((currentIndex + 1) / slides.length) * 100}%`;
        }

        if (counter) {
            counter.textContent =
                `${currentIndex + 1} / ${slides.length}`;
        }
    }


    /* =====================================
       CAMBIO IMMAGINE
    ===================================== */

    function goTo(newIndex) {

        currentIndex = Math.max(
            0,
            Math.min(newIndex, slides.length - 1)
        );

        updateGallery();
    }


    /* =====================================
       PULSANTI DESTRA E SINISTRA
    ===================================== */

    prevButton.addEventListener("click", function () {
        goTo(currentIndex - 1);
    });

    nextButton.addEventListener("click", function () {
        goTo(currentIndex + 1);
    });


    /* =====================================
       SCORRIMENTO CON MOUSE O DITO
    ===================================== */

    viewport.addEventListener("pointerdown", function (event) {

        if (event.pointerType === "mouse" && event.button !== 0) {
            return;
        }

        startX = event.clientX;
        startY = event.clientY;

        deltaX = 0;
        dragging = true;
        horizontalGesture = false;
    });


    viewport.addEventListener("pointermove", function (event) {

        if (!dragging) {
            return;
        }

        const dx = event.clientX - startX;
        const dy = event.clientY - startY;

        if (
            !horizontalGesture &&
            Math.max(Math.abs(dx), Math.abs(dy)) > 8
        ) {
            horizontalGesture = Math.abs(dx) > Math.abs(dy);
        }

        if (horizontalGesture) {
            deltaX = dx;
        }
    });


    function endDrag() {

        if (!dragging) {
            return;
        }

        dragging = false;

        if (horizontalGesture && Math.abs(deltaX) > 45) {

            if (deltaX < 0) {
                goTo(currentIndex + 1);
            } else {
                goTo(currentIndex - 1);
            }
        }

        deltaX = 0;
        horizontalGesture = false;
    }


    viewport.addEventListener("pointerup", endDrag);
    viewport.addEventListener("pointercancel", endDrag);

    viewport.addEventListener("pointerleave", function (event) {
        if (event.pointerType === "mouse") {
            endDrag();
        }
    });


    /* =====================================
       TASTI FRECCIA DELLA TASTIERA
    ===================================== */

    viewport.setAttribute("tabindex", "0");

    viewport.addEventListener("keydown", function (event) {

        if (event.key === "ArrowRight") {
            event.preventDefault();
            goTo(currentIndex + 1);
        }

        if (event.key === "ArrowLeft") {
            event.preventDefault();
            goTo(currentIndex - 1);
        }
    });


    /* =====================================
       AVVIO
    ===================================== */

    updateGallery();

    console.log("Galleria ARCHÉ inizializzata correttamente.");

});
2. Controlla una cosa fondamentale nell'HTML
Il codice qui sopra cerca una galleria con questa struttura e questi nomi precisi:

html
<div class="gallery-carousel">
  <button id="gallery-prev">←</button>

  <div class="gallery-viewport">
    <div class="gallery-track">
      <article class="gallery-slide">
        ...
      </article>
    </div>
  </div>

  <button id="gallery-next">→</button>
</div>
