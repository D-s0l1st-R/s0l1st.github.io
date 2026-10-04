import './styles/main.scss';

document.addEventListener('DOMContentLoaded', () => {
  const menuToggle = document.getElementById('menu-toggle');
  const menu = document.getElementById('menu');
  const overlay = document.getElementById('menu-overlay');
  const header = document.getElementById('header');

  if (menuToggle && menu && overlay) {
    menuToggle.addEventListener('change', () => {
      if (menuToggle.checked) {
        menu.classList.add('menu--open');
        overlay.classList.add('menu-overlay--visible');
        header.classList.add('header--open');
        document.body.classList.add('menu-open');
      } else {
        menu.classList.remove('menu--open');
        overlay.classList.remove('menu-overlay--visible');
        header.classList.remove('header--open');
        document.body.classList.remove('menu-open');
      }
    });

    overlay.addEventListener('click', () => {
      menuToggle.checked = false;
      menuToggle.dispatchEvent(new Event('change'));
    });
  }

  hideIncompleteLastRow();
  window.addEventListener('resize', hideIncompleteLastRow);
});

function hideIncompleteLastRow() {
  const grid = document.getElementById('card-grid');
  if (!grid) return;

  const cards = Array.from(grid.children);
  if (cards.length === 0) return;

  const style = getComputedStyle(grid);
  const cols = style.gridTemplateColumns.split(' ').length;
  const remainder = cards.length % cols;

  cards.forEach((card, i) => {
    card.style.display =
      remainder > 0 && i >= cards.length - remainder ? 'none' : '';
  });
}