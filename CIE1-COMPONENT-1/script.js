const menuToggle = document.querySelector('.menu-toggle');
const mainNav = document.querySelector('.main-nav');
const navActions = document.querySelector('.nav-actions');

if (menuToggle && mainNav && navActions) {
  menuToggle.addEventListener('click', () => {
    const isOpen = mainNav.classList.toggle('mobile-open');
    navActions.style.display = isOpen ? 'flex' : '';
    mainNav.style.display = isOpen ? 'flex' : '';
    mainNav.style.flexDirection = 'column';
    mainNav.style.position = 'absolute';
    mainNav.style.top = '78px';
    mainNav.style.left = '16px';
    mainNav.style.right = '16px';
    mainNav.style.background = '#fff';
    mainNav.style.border = '1px solid rgba(17,24,39,0.12)';
    mainNav.style.borderRadius = '16px';
    mainNav.style.padding = '18px';
    mainNav.style.boxShadow = '0 16px 30px rgba(15, 23, 42, 0.12)';
  });
}

const heroButton = document.querySelector('.play-cta, .video-button');
if (heroButton) {
  heroButton.addEventListener('click', () => {
    alert('Video preview would open here in the complete version of this landing page.');
  });
}
