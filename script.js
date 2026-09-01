// Navbar scroll effect
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 40);
});

// Hamburger toggle
const hamburger = document.getElementById('hamburger');
const navLinks  = document.getElementById('nav-links');
hamburger.addEventListener('click', () => {
  navLinks.classList.toggle('open');
});
// Close menu when a link is clicked
navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => navLinks.classList.remove('open'));
});

// Waitlist form — AJAX submit so page doesn't reload
const form = document.getElementById('waitlist-form');
const successMsg = document.getElementById('form-success');
const interest = document.getElementById('interest');
const ambassadorLink = document.getElementById('ambassador-link');
const submitButton = form.querySelector('button[type="submit"]');

if (window.lucide) {
  window.lucide.createIcons();
}

ambassadorLink.addEventListener('click', () => {
  interest.value = 'ambassador';
  submitButton.textContent = 'Apply as Ambassador';
  window.setTimeout(() => form.querySelector('input[type="email"]').focus(), 0);
});

interest.addEventListener('change', () => {
  submitButton.textContent = interest.value === 'ambassador'
    ? 'Apply as Ambassador'
    : 'Join Waitlist';
});

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  const data = new FormData(form);
  try {
    const res = await fetch(form.action, {
      method: 'POST',
      body: data,
      headers: { 'Accept': 'application/json' }
    });
    if (res.ok) {
      form.style.display = 'none';
      successMsg.textContent = interest.value === 'ambassador'
        ? "Your campus ambassador application has been received. We'll be in touch soon."
        : "You're on the waitlist! We'll be in touch soon.";
      successMsg.style.display = 'block';
    } else {
      alert('Something went wrong. Please try again or email us directly.');
    }
  } catch {
    alert('Something went wrong. Please try again.');
  }
});
