document.addEventListener("DOMContentLoaded", function () {

    /* =====================================
       1. VIDEO: RIPRODUZIONE AUTOMATICA
    ===================================== */

    const video = document.querySelector(".hero-video");

    if (video) {
        video.play().catch(function () {
            console.log("Autoplay bloccato dal browser.");
        });
    }


    /* =====================================
       2. GALLERIA ARCHÉ: ELEMENTI HTML
    ===================================== */

    const carousel = document.querySelector(".gallery-carousel");

    if (!carousel) {
        console.warn("ARCHÉ: galleria non trovata.");
        return;
    }

    const viewport = carousel.querySelector("#gallery-viewport");
    const track = carousel.querySelector("#gallery-track");
    const prevButton = carousel.querySelector("#gallery-prev");
    const nextButton = carousel.querySelector("#gallery-next");
    const progress = document.querySelector("#gallery-progress-bar");

    if (!viewport || !track || !prevButton || !nextButton) {
        console.error(
            "ARCHÉ: controlla gli ID della galleria nell'HTML."
        );
        return;
    }

    const slides = Array.from(
        track.querySelectorAll(".gallery-slide")
    );

    if (slides.length === 0) {
        console.error("ARCHÉ: nessuna immagine trovata.");
        return;
    }

    console.log("ARCHÉ: trovate", slides.length, "immagini.");


    /* =====================================
       3. STATO DELLA GALLERIA
    ===================================== */

    let currentIndex = 0;

    let startX = 0;
    let startY = 0;
    let deltaX = 0;

    let dragging = false;
    let horizontalGesture = false;


    /* =====================================
       4. AGGIORNAMENTO IMMAGINE E DESCRIZIONE
    ===================================== */

    function updateGallery() {

        // Sposta immagini e descrizioni insieme.
        track.style.transform =
            "translateX(-" + (currentIndex * 100) + "%)";

        // Indica quale progetto è attualmente visibile.
        slides.forEach(function (slide, index) {
            const isCurrent = index === currentIndex;

            slide.setAttribute(
                "aria-hidden",
                isCurrent ? "false" : "true"
            );
        });

        // Aggiorna lo stato delle frecce.
        prevButton.disabled = currentIndex === 0;
        nextButton.disabled = currentIndex === slides.length - 1;

        prevButton.style.opacity =
            currentIndex === 0 ? "0.4" : "1";

        nextButton.style.opacity =
            currentIndex === slides.length - 1 ? "0.4" : "1";

        // Aggiorna la barra di avanzamento.
        if (progress) {
            progress.style.width =
                ((currentIndex + 1) / slides.length * 100) + "%";
        }

        // Aggiorna il contatore, se presente nell'HTML.
        const counter =
            document.querySelector("#gallery-counter") ||
            document.querySelector("#my-counter");

        if (counter) {
            counter.textContent =
                (currentIndex + 1) + " / " + slides.length;
        }
    }


    /* =====================================
       5. CAMBIO PROGETTO
    ===================================== */

    function goTo(newIndex) {

        // Impedisce di superare la prima e l'ultima immagine.
        currentIndex = Math.max(
            0,
            Math.min(newIndex, slides.length - 1)
        );

        updateGallery();
    }


    /* =====================================
       6. FRECCIA SINISTRA E DESTRA
    ===================================== */

    prevButton.addEventListener("click", function () {
        goTo(currentIndex - 1);
    });

    nextButton.addEventListener("click", function () {
        goTo(currentIndex + 1);
    });


    /* =====================================
       7. INIZIO DEL TRASCINAMENTO
    ===================================== */

    viewport.addEventListener("pointerdown", function (event) {

        // Ignora i pulsanti secondari del mouse.
        if (event.pointerType === "mouse" && event.button !== 0) {
            return;
        }

        startX = event.clientX;
        startY = event.clientY;

        deltaX = 0;
        dragging = true;
        horizontalGesture = false;
    });


    /* =====================================
       8. MOVIMENTO DEL MOUSE O DEL DITO
    ===================================== */

    viewport.addEventListener("pointermove", function (event) {

        if (!dragging) {
            return;
        }

        const dx = event.clientX - startX;
        const dy = event.clientY - startY;

        // Distingue uno scorrimento orizzontale da uno verticale.
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


    /* =====================================
       9. FINE DEL TRASCINAMENTO
    ===================================== */

    function endDrag() {

        if (!dragging) {
            return;
        }

        dragging = false;

        // Cambia progetto solo se il movimento è sufficiente.
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
       10. FRECCE DELLA TASTIERA
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
       11. AVVIO DELLA GALLERIA
    ===================================== */

    updateGallery();

    console.log("ARCHÉ: galleria inizializzata correttamente.");

});
