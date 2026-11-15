(() => {
  const carousel = document.querySelector('[data-fooly-carousel]');
  if (!carousel) return;

  const slides = [...carousel.querySelectorAll('[data-slide]')];
  const thumbs = [...carousel.querySelectorAll('[data-thumb]')];
  const rail = carousel.querySelector('[data-thumbs]');
  const stage = carousel.querySelector('[data-stage]');
  const prev = carousel.querySelector('[data-prev]');
  const next = carousel.querySelector('[data-next]');
  const position = carousel.querySelector('[data-position]');
  const announcement = carousel.querySelector('[data-announcement]');
  let active = 0;
  let touchOrigin = null;

  function show(index) {
    active = (index + slides.length) % slides.length;
    slides.forEach((slide, slideIndex) => {
      slide.hidden = slideIndex !== active;
    });
    thumbs.forEach((thumb, thumbIndex) => {
      if (thumbIndex === active) thumb.setAttribute('aria-current', 'true');
      else thumb.removeAttribute('aria-current');
    });

    const count = String(active + 1).padStart(2, '0');
    position.textContent = count + ' / ' + String(slides.length).padStart(2, '0');
    announcement.textContent = 'Slide ' + (active + 1) + ' of ' + slides.length + '. ' +
      slides[active].querySelector('h3').textContent;
    const selected = thumbs[active];
    const thumbBounds = selected.getBoundingClientRect();
    const railBounds = rail.getBoundingClientRect();
    if (thumbBounds.left < railBounds.left) rail.scrollLeft -= railBounds.left - thumbBounds.left + 5;
    if (thumbBounds.right > railBounds.right) rail.scrollLeft += thumbBounds.right - railBounds.right + 5;
  }

  prev.addEventListener('click', () => show(active - 1));
  next.addEventListener('click', () => show(active + 1));
  thumbs.forEach((thumb, index) => thumb.addEventListener('click', () => show(index)));
  carousel.addEventListener('keydown', (event) => {
    if (event.target.closest('.fc-slide')) return;
    if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return;
    event.preventDefault();
    const focusedThumbnail = thumbs.includes(event.target);
    show(active + (event.key === 'ArrowRight' ? 1 : -1));
    if (focusedThumbnail) thumbs[active].focus({ preventScroll: true });
  });

  stage.addEventListener('touchstart', (event) => {
    touchOrigin = event.touches.length === 1 ? event.touches[0] : null;
  }, { passive: true });
  stage.addEventListener('touchcancel', () => { touchOrigin = null; }, { passive: true });
  stage.addEventListener('touchend', (event) => {
    const start = touchOrigin;
    touchOrigin = null;
    if (!start || event.changedTouches.length !== 1) return;
    const end = event.changedTouches[0];
    const dx = end.clientX - start.clientX;
    const dy = end.clientY - start.clientY;
    if (Math.abs(dx) > 48 && Math.abs(dx) > Math.abs(dy) * 1.4) {
      show(active + (dx < 0 ? 1 : -1));
    }
  }, { passive: true });

  carousel.dataset.ready = '';
  carousel.querySelector('[data-controls]').hidden = false;
  show(0);
})();
