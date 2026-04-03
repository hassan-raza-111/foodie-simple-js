/* ========================================
   App Module - Shared: nav auth state, mobile menu
   ======================================== */

document.addEventListener('DOMContentLoaded', function () {
  updateNavAuth();
  highlightCurrentPage();
  initMobileMenu();
});

/* --- Navigation Auth State --- */
function updateNavAuth() {
  const authContainer = document.querySelector('.nav-auth');
  if (!authContainer) return;

  const user = Auth.getCurrentUser();

  if (user) {
    authContainer.innerHTML = `
      <span style="font-size:0.9rem;font-weight:500;color:var(--dark)">Hi, ${user.name.split(' ')[0]}</span>
      <button class="btn btn-outline btn-sm" onclick="handleSignout()">Sign Out</button>
    `;
  } else {
    authContainer.innerHTML = `
      <a href="signin.html" class="btn btn-outline btn-sm">Sign In</a>
      <a href="signup.html" class="btn btn-primary btn-sm">Sign Up</a>
    `;
  }
}

function handleSignout() {
  Auth.signout();
  window.location.href = 'index.html';
}

/* --- Highlight Current Page --- */
function highlightCurrentPage() {
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  const navLinks = document.querySelectorAll('.nav-links a');

  navLinks.forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPage) {
      link.classList.add('active');
    }
  });
}

/* --- Mobile Hamburger Menu --- */
function initMobileMenu() {
  const hamburger = document.querySelector('.hamburger');
  const navLinks = document.querySelector('.nav-links');

  if (!hamburger || !navLinks) return;

  hamburger.addEventListener('click', function () {
    this.classList.toggle('active');
    navLinks.classList.toggle('open');
  });

  // Close menu on link click
  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', function () {
      hamburger.classList.remove('active');
      navLinks.classList.remove('open');
    });
  });

  // Close on outside click
  document.addEventListener('click', function (e) {
    if (!hamburger.contains(e.target) && !navLinks.contains(e.target)) {
      hamburger.classList.remove('active');
      navLinks.classList.remove('open');
    }
  });
}
