(function () {
  var hero = document.querySelector(".hero");
  if (!hero) return;

  var slides = Array.prototype.slice.call(hero.querySelectorAll(".slide"));
  var bars = Array.prototype.slice.call(hero.querySelectorAll(".hero-progress .bar"));
  if (slides.length < 2 || bars.length !== slides.length) return;

  var current = 0;

  function show(index) {
    current = (index + slides.length) % slides.length;
    slides.forEach(function (slide, i) {
      var active = i === current;
      slide.classList.toggle("is-active", active);
      slide.setAttribute("aria-hidden", active ? "false" : "true");
      slide.inert = !active;
    });
    bars.forEach(function (bar, i) {
      var active = i === current;
      // Re-adding the class restarts the CSS progress animation from zero.
      bar.classList.remove("is-active");
      if (active) {
        void bar.offsetWidth;
        bar.classList.add("is-active");
        bar.setAttribute("aria-current", "true");
      } else {
        bar.removeAttribute("aria-current");
      }
    });
  }

  bars.forEach(function (bar, i) {
    bar.addEventListener("click", function () {
      show(i);
    });
    // Autoplay is driven by the progress bar's animation, so pausing it on hover pauses the slider too.
    bar.querySelector("i").addEventListener("animationend", function () {
      if (i === current) show(current + 1);
    });
  });

  show(0);
})();
