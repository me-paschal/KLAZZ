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

// Waitlist form — AJAX submit so page doesn't reload + Duplicate Email Prevention
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
  const emailInput = form.querySelector('input[type="email"]');
  const emailVal = emailInput.value.trim().toLowerCase();

  // Check local storage for duplicate gmail/email submission
  let submittedEmails = [];
  try {
    submittedEmails = JSON.parse(localStorage.getItem('klazz_waitlist_emails') || '[]');
  } catch (err) {
    submittedEmails = [];
  }

  if (submittedEmails.includes(emailVal)) {
    alert('This email address has already been used to join the waitlist!');
    emailInput.focus();
    return;
  }

  const data = new FormData(form);
  try {
    const res = await fetch(form.action, {
      method: 'POST',
      body: data,
      headers: { 'Accept': 'application/json' }
    });
    if (res.ok) {
      // Save email locally to prevent duplicate submissions
      submittedEmails.push(emailVal);
      localStorage.setItem('klazz_waitlist_emails', JSON.stringify(submittedEmails));

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

// Number decode / scramble effect on reveal
function runDecodeEffect(el) {
  const originalText = el.textContent;
  const numericPart = originalText.replace(/[^0-9.]/g, '');
  if (!numericPart) return;
  const prefix = originalText.substring(0, originalText.indexOf(numericPart));
  const suffix = originalText.substring(originalText.indexOf(numericPart) + numericPart.length);
  
  let iterations = 0;
  const maxIterations = 25;
  const interval = setInterval(() => {
    let randomized = '';
    for (let i = 0; i < numericPart.length; i++) {
      if (numericPart[i] === '.') {
        randomized += '.';
      } else {
        randomized += Math.floor(Math.random() * 10);
      }
    }
    el.textContent = prefix + randomized + suffix;
    iterations++;
    if (iterations >= maxIterations) {
      clearInterval(interval);
      el.textContent = originalText;
    }
  }, 60);
}

// Intersection Observer for 1.5s directional section animations & number decodes
const observerOptions = { threshold: 0.15 };

const observer = new IntersectionObserver((entries, observer) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const target = entry.target;

      // Decode effect on stat numbers
      if (target.classList.contains('stat-number') || target.classList.contains('mstat-number')) {
        runDecodeEffect(target);
      }

      // Solution pillars ease-in (1.5s)
      if (target.classList.contains('pillar')) {
        const index = Array.from(target.parentNode.children).indexOf(target);
        setTimeout(() => target.classList.add('sol-animated'), index * 250);
      }

      // How it works slide in from right (1.5s stagger)
      if (target.classList.contains('step-card')) {
        const index = Array.from(target.parentNode.children).indexOf(target);
        setTimeout(() => target.classList.add('how-animated'), index * 300);
      }

      // Product preview phone & right cards (1.5s)
      if (target.classList.contains('phone-preview')) {
        target.classList.add('prod-animated');
      }
      if (target.classList.contains('preview-item')) {
        const index = Array.from(target.parentNode.children).indexOf(target);
        setTimeout(() => target.classList.add('prod-item-animated'), index * 300);
      }

      // Features synchronized row ease-in (1.5s)
      if (target.classList.contains('feature-item')) {
        const items = Array.from(target.parentNode.children);
        const index = items.indexOf(target);
        const rowGroup = Math.floor(index / 2);
        setTimeout(() => target.classList.add('feat-animated'), rowGroup * 300);
      }

      // Pricing cards ease-in from under (1.5s)
      if (target.classList.contains('plan-card')) {
        const index = Array.from(target.parentNode.children).indexOf(target);
        setTimeout(() => target.classList.add('plan-animated'), index * 250);
      }

      // Market stats ease-in (1.5s)
      if (target.classList.contains('mstat')) {
        const index = Array.from(target.parentNode.children).indexOf(target);
        setTimeout(() => target.classList.add('mstat-animated'), index * 300);
      }

      // Launch plan panels ease-in (1.5s)
      if (target.classList.contains('rollout-panel') || target.classList.contains('ambassador-panel')) {
        const isAmbassador = target.classList.contains('ambassador-panel');
        setTimeout(() => target.classList.add('roll-animated'), isAmbassador ? 300 : 0);
      }

      // Team cards ease-in from under (1.5s stagger)
      if (target.classList.contains('team-card')) {
        const index = Array.from(target.parentNode.children).indexOf(target);
        setTimeout(() => target.classList.add('team-animated'), index * 300);
      }

      observer.unobserve(target);
    }
  });
}, observerOptions);

// Observe elements
document.querySelectorAll('.stat-number, .mstat-number, .pillar, .step-card, .phone-preview, .preview-item, .feature-item, .plan-card, .mstat, .rollout-panel, .ambassador-panel, .team-card').forEach(el => {
  observer.observe(el);
});

// Phone preview — idle float + cursor-tilt, just for fun.
const phonePreview = document.querySelector('.phone-preview');
const productGrid = document.querySelector('.product-grid');
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const supportsHoverTilt = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

if (phonePreview && productGrid && !prefersReducedMotion) {
  let targetRotX = 0, targetRotY = 0;
  let currentRotX = 0, currentRotY = 0;
  const startTime = performance.now();

  if (supportsHoverTilt) {
    productGrid.addEventListener('mousemove', (e) => {
      const rect = phonePreview.getBoundingClientRect();
      const relX = (e.clientX - rect.left) / rect.width - 0.5;
      const relY = (e.clientY - rect.top) / rect.height - 0.5;
      targetRotY = relX * 14;
      targetRotX = -relY * 14;
    });
    productGrid.addEventListener('mouseleave', () => {
      targetRotX = 0;
      targetRotY = 0;
    });
  }

  function tickPhone(now) {
    currentRotX += (targetRotX - currentRotX) * 0.08;
    currentRotY += (targetRotY - currentRotY) * 0.08;
    const floatOffset = Math.sin((now - startTime) / 1000) * 8;
    phonePreview.style.transform =
      `perspective(900px) translateY(${floatOffset}px) rotateX(${currentRotX}deg) rotateY(${currentRotY}deg)`;
    requestAnimationFrame(tickPhone);
  }
  requestAnimationFrame(tickPhone);
}