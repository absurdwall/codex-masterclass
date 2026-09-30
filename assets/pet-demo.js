// Displays the supplied pet atlas. It does not generate, rotate, or redraw artwork.
(() => {
  const demo = document.getElementById('octopus-demo');
  if (!demo) return;
  const stage = demo.querySelector('.pet-playground');
  const sprite = demo.querySelector('.pet-sprite');
  const toggle = demo.querySelector('[data-motion-toggle]');
  const status = demo.querySelector('.pet-demo-status');
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  const idleDurations = [280, 110, 110, 140, 140, 320];
  let paused = reduced.matches;
  let timer = null;
  let idleFrame = 0;
  let pointerInside = false;
  let lastDirection = -1;
  function stopTimer() { clearTimeout(timer); timer = null; }
  function show(row, col, state) {
    sprite.style.backgroundPosition = `${-col * 192}px ${-row * 208}px`;
    sprite.dataset.state = state;
    sprite.dataset.row = String(row);
    sprite.dataset.frame = String(col);
  }
  function idle() {
    stopTimer();
    if (paused || pointerInside) return;
    lastDirection = -1;
    show(0, idleFrame, 'idle');
    const delay = idleDurations[idleFrame];
    idleFrame = (idleFrame + 1) % idleDurations.length;
    timer = setTimeout(idle, delay);
  }
  function look(direction, label, direct = false) {
    if (paused) return;
    stopTimer();
    direction = ((direction % 16) + 16) % 16;
    if (direction !== lastDirection) {
      show(9 + Math.floor(direction / 8), direction % 8, `look-${direction}`);
      lastDirection = direction;
    }
    if (direct) status.textContent = `Octopus is looking ${label}.`;
  }
  function updateToggle() {
    toggle.textContent = paused ? 'Play animation' : 'Pause animation';
    toggle.setAttribute('aria-pressed', String(paused));
    demo.dataset.paused = String(paused);
  }
  stage.addEventListener('pointermove', event => {
    if (event.pointerType === 'touch' || paused) return;
    pointerInside = true;
    const rect = sprite.getBoundingClientRect();
    const dx = event.clientX - (rect.left + rect.width / 2);
    const dy = event.clientY - (rect.top + rect.height / 2);
    if (Math.hypot(dx, dy) < 24) {
      stopTimer(); show(0, 0, 'neutral'); lastDirection = -1; return;
    }
    const angle = (Math.atan2(dx, -dy) + 2 * Math.PI) % (2 * Math.PI);
    look(Math.round(angle / (2 * Math.PI / 16)) % 16);
  });
  stage.addEventListener('pointerleave', () => { pointerInside = false; idle(); });
  stage.addEventListener('keydown', event => {
    const choices = {ArrowUp:[0,'up'],ArrowRight:[4,'right'],ArrowDown:[8,'down'],ArrowLeft:[12,'left']};
    if (!choices[event.key]) return;
    event.preventDefault();
    look(...choices[event.key], true);
  });
  demo.querySelectorAll('[data-look]').forEach(button => {
    button.addEventListener('click', () => {
      look(Number(button.dataset.look), button.textContent.trim().toLowerCase(), true);
    });
  });
  demo.querySelector('[data-idle]').addEventListener('click', () => {
    pointerInside = false;
    status.textContent = paused ? 'Animation is paused.' : 'Octopus is resting.';
    idle();
  });
  toggle.addEventListener('click', () => {
    paused = !paused;
    stopTimer();
    pointerInside = false;
    updateToggle();
    status.textContent = paused ? 'Animation paused.' : 'Animation playing. Move your pointer around Octopus.';
    if (!paused) idle();
  });
  reduced.addEventListener('change', event => {
    paused = event.matches;
    stopTimer();
    pointerInside = false;
    updateToggle();
    status.textContent = paused ? 'Reduced motion is on. Choose Play animation to interact.' : 'Move your pointer around Octopus.';
    if (!paused) idle();
  });
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) stopTimer();
    else if (!paused && !pointerInside) idle();
  });
  const atlas = new Image();
  atlas.onload = () => {
    if (atlas.naturalWidth !== 1536 || atlas.naturalHeight !== 2288) {
      status.textContent = 'This demo needs the verified 16-direction pet atlas.';
      return;
    }
    sprite.style.backgroundImage = `url("${atlas.src}")`;
    demo.dataset.ready = 'true';
    show(0, 0, 'idle');
    updateToggle();
    status.textContent = paused ? 'Reduced motion is on. Choose Play animation to interact.' : 'Move your pointer around Octopus, or use the direction buttons.';
    if (!paused) idle();
  };
  atlas.onerror = () => { status.textContent = 'The pet image could not load. Please reload the page.'; };
  atlas.src = demo.dataset.sprite;
})();
