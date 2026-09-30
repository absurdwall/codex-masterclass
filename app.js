// Progressive enhancement only. The complete session works without JavaScript.
const links = [...document.querySelectorAll('.session-nav nav a')];
const sections = links.map(link => document.querySelector(link.getAttribute('href'))).filter(Boolean);
function updateActiveSection() {
  const threshold = Math.min(window.innerHeight * 0.3, 220);
  let active = sections[0];
  for (const section of sections) {
    if (section.getBoundingClientRect().top <= threshold) active = section;
  }
  for (const link of links) {
    const selected = link.hash === `#${active.id}`;
    link.classList.toggle('active', selected);
    if (selected) link.setAttribute('aria-current', 'location');
    else link.removeAttribute('aria-current');
  }
}
let scheduled = false;
window.addEventListener('scroll', () => {
  if (!scheduled) {
    scheduled = true;
    requestAnimationFrame(() => { updateActiveSection(); scheduled = false; });
  }
}, { passive: true });
window.addEventListener('resize', updateActiveSection);
updateActiveSection();
