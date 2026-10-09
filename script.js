document.addEventListener("DOMContentLoaded", function () {

    const video = document.querySelector(".hero-video");

    if (video) {
        video.play().catch(() => {
            console.log("Autoplay bloccato dal browser.");
        });
    }

});

orm = `translateX(-${currentIndex * 100}%)`;

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
(() => {
    const carousel = document.querySelector(".gallery-carousel");
    if (!carousel) return;

    const viewport = carousel.querySelector(".gallery-viewport");
    const track = carousel.querySelector(".gallery-track");
    const slides = Array.from(track.children);
    const prev = carousel.querySelector(".gallery-prev");
    const next = carousel.querySelector(".gallery-next");
    const progress = document.querySelector(".gallery-progress-bar");

    let index = 0;
    let startX = 0;
    let startY = 0;
    let deltaX = 0;
    let dragging = false;
    let horizontalGesture = false;

    function update() {
        track.style.transform = `translateX(-${index * 100}%)`;

        slides.forEach((slide, i) => {
            slide.setAttribute("aria-hidden", String(i !== index));
        });

        prev.disabled = index === 0;
        next.disabled = index === slides.length - 1;

        progress.style.width =
            `${((index + 1) / slides.length) * 100}%`;
    }

    function goTo(newIndex) {
        index = Math.max(0, Math.min(newIndex, slides.length - 1));
        update();
    }

    prev.addEventListener("click", () => goTo(index - 1));
    next.addEventListener("click", () => goTo(index + 1));

    viewport.addEventListener("pointerdown", (event) => {
        if (event.pointerType === "mouse" && event.button !== 0) return;

        startX = event.clientX;
        startY = event.clientY;
        deltaX = 0;
        dragging = true;
        horizontalGesture = false;
    });

    viewport.addEventListener("pointermove", (event) => {
        if (!dragging) return;

        const dx = event.clientX - startX;
        const dy = event.clientY - startY;

        if (!horizontalGesture && Math.max(Math.abs(dx), Math.abs(dy)) > 8) {
            horizontalGesture = Math.abs(dx) > Math.abs(dy);
        }

        if (horizontalGesture) {
            deltaX = dx;
        }
    });

    function endDrag() {
        if (!dragging) return;
        dragging = false;

        if (horizontalGesture && Math.abs(deltaX) > 45) {
            if (deltaX < 0) {
                goTo(index + 1);
            } else {
                goTo(index - 1);
            }
        }

        deltaX = 0;
        horizontalGesture = false;
    }

    viewport.addEventListener("pointerup", endDrag);
    viewport.addEventListener("pointercancel", endDrag);
    viewport.addEventListener("pointerleave", (event) => {
        if (event.pointerType === "mouse") endDrag();
    });

    viewport.addEventListener("keydown", (event) => {
        if (event.key === "ArrowRight") {
            event.preventDefault();
            goTo(index + 1);
        }

        if (event.key === "ArrowLeft") {
            event.preventDefault();
            goTo(index - 1);
        }
    });

    update();
})();
