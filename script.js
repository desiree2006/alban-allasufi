document.addEventListener("DOMContentLoaded", function () {

    const video = document.querySelector(".hero-video");

    if (video) {
        video.play().catch(() => {
            console.log("Autoplay bloccato dal browser.");
        });
    }

});
