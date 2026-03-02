/* have-you-seen-this-box — main.js */

(function () {
  'use strict';

  // ----------------------------------------------------------------
  // EMAIL OBFUSCATION
  // The address is never written as a plain string anywhere in the HTML.
  // We read it from split data attributes and assemble it here at runtime.
  // Static scrapers see only data-e and data-d — not a recognisable address.
  // ----------------------------------------------------------------
  document.querySelectorAll('.link-mail[data-e][data-d]').forEach(function (link) {
    var user   = link.getAttribute('data-e');
    var domain = link.getAttribute('data-d');
    if (!user || !domain) return;

    var address = user + '\u0040' + domain; // \u0040 is @
    link.setAttribute('href', 'mailto:' + address);

    // On click: try to copy to clipboard; fall through to mailto on failure
    link.addEventListener('click', function (e) {
      if (!navigator.clipboard) return; // let the mailto: do its thing
      e.preventDefault();
      navigator.clipboard.writeText(address).then(function () {
        var sub = link.querySelector('.link-sub');
        if (!sub) return;
        var original = sub.textContent;
        sub.textContent = 'Address copied to clipboard!';
        setTimeout(function () { sub.textContent = original; }, 2200);
      }).catch(function () {
        window.location.href = 'mailto:' + address;
      });
    });
  });

  // ----------------------------------------------------------------
  // SCROLL-TRIGGERED CARD ANIMATIONS
  // Cards start with animation-play-state: paused (set in CSS).
  // IntersectionObserver releases each one as it enters the viewport.
  // ----------------------------------------------------------------
  if ('IntersectionObserver' in window) {
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.style.animationPlayState = 'running';
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.08 });

    document.querySelectorAll('.card').forEach(function (card, i) {
      card.style.animationDelay = (i * 0.07) + 's';
      observer.observe(card);
    });
  } else {
    // Fallback: just show everything
    document.querySelectorAll('.card').forEach(function (card) {
      card.style.animationPlayState = 'running';
    });
  }

  // ----------------------------------------------------------------
  // POLAROID 3D TILT ON MOUSE MOVE
  // ----------------------------------------------------------------
  var polaroid = document.querySelector('.polaroid');
  if (polaroid) {
    var ticking = false;

    document.addEventListener('mousemove', function (e) {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(function () {
        var cx = window.innerWidth  / 2;
        var cy = window.innerHeight / 2;
        var dx = (e.clientX - cx) / cx;
        var dy = (e.clientY - cy) / cy;
        polaroid.style.transform =
          'rotate(-1.2deg) rotateY(' + (dx * 4) + 'deg) rotateX(' + (-dy * 3) + 'deg)';
        ticking = false;
      });
    });

    document.addEventListener('mouseleave', function () {
      polaroid.style.transform = 'rotate(-1.2deg)';
    });
  }

})();