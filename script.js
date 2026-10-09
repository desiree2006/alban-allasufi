document.addEventListener("DOMContentLoaded", function () {

    const video = document.querySelector(".hero-video");

    if (video) {
        video.play().catch(() => {
            console.log("Autoplay bloccato dal browser.");
        });
    }

});
/* ================================
CONTROLLI GALLERIA ARCHÉ
================================= */

(() => {
    const carousel = document.querySelector(".gallery-carousel");

    if (!carousel) return;

    const viewport = carousel.querySelector(".gallery-viewport");
    const track = carousel.querySelector(".gallery-track");
    const slides = Array.from(track.querySelectorAll(".gallery-slide"));
    const prevButton = carousel.querySelector(".gallery-prev");
    const nextButton = carousel.querySelector(".gallery-next");
    const progressBar = document.querySelector(".gallery-progress-bar");

    let currentIndex = 0;
    let startX = 0;
    let startY = 0;
    let isDragging = false;
    let dragDistance = 0;

    function updateGallery() {
        track.style.transform = `translateX(-${currentIndex * 100}%)`;

        slides.forEach((slide, index) => {
            slide.setAttribute(
                "aria-hidden",
                index === currentIndex ? "false" : "true"
            );
        });

        prevButton.disabled = currentIndex === 0;
        nextButton.disabled = currentIndex === slides.length - 1;

        prevButton.style.opacity = currentIndex === 0 ? "0.4" : "1";
        nextButton.style.opacity =
            currentIndex === slides.length - 1 ? "0.4" : "1";

        progressBar.style.width =
            `${((currentIndex + 1) / slides.length) * 100}%`;
    }

    function goToSlide(index) {
        currentIndex = Math.max(0, Math.min(index, slides.length - 1));
        updateGallery();
    }

    prevButton.addEventListener("click", () => {
        goToSlide(currentIndex - 1);
    });

    nextButton.addEventListener("click", () => {
        goToSlide(currentIndex + 1);
    });

    viewport.addEventListener("pointerdown", (event) => {
        if (event.pointerType === "mouse" && event.button !== 0) return;

        startX = event.clientX;
        startY = event.clientY;
        dragDistance = 0;
        isDragging = true;
    });

    viewport.addEventListener("pointermove", (event) => {
        if (!isDragging) return;

        const deltaX = event.clientX - startX;
        const deltaY = event.clientY - startY;

        if (Math.abs(deltaX) > Math.abs(deltaY)) {
            dragDistance = deltaX;
        }
    });

    function endDrag() {
        if (!isDragging) return;

        isDragging = false;

        if (Math.abs(dragDistance) > 45) {
            if (dragDistance < 0) {
                goToSlide(currentIndex + 1);
            } else {
                goToSlide(currentIndex - 1);
            }
        }

        dragDistance = 0;
    }

    viewport.addEventListener("pointerup", endDrag);
    viewport.addEventListener("pointercancel", endDrag);
    viewport.addEventListener("pointerleave", endDrag);

    viewport.addEventListener("keydown", (event) => {
        if (event.key === "ArrowRight") {
            goToSlide(currentIndex + 1);
        }

        if (event.key === "ArrowLeft") {
            goToSlide(currentIndex - 1);
        }
    });

    updateGallery();
})();
