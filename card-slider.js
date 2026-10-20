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
