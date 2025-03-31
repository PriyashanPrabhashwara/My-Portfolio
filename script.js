// ===== TYPING ANIMATION WITH TAB AWARENESS =====
const textElement = document.getElementById("dynamic-text");
const words = [
  "UI/UX Designer 🎨", 
  "Front-end Developer 💻", 
  "Tech Enthusiast ⚡", 
  "Problem Solver 🔍"
];
let wordIndex = 0;
let charIndex = 0;
let isDeleting = false;
let animationFrame = null;
let lastAnimationTime = 0;

// Animation timing controls
const typeSpeed = 100;    // ms per character typing
const deleteSpeed = 50;   // ms per character deleting
const pauseBetweenWords = 1500; // ms pause between words

function typeEffect(timestamp) {
  if (!lastAnimationTime) lastAnimationTime = timestamp;
  const elapsed = timestamp - lastAnimationTime;
  const speed = isDeleting ? deleteSpeed : typeSpeed;
  
  if (elapsed >= speed) {
    const currentWord = words[wordIndex];
    
    // Update text content
    textElement.textContent = isDeleting 
      ? currentWord.substring(0, charIndex - 1)
      : currentWord.substring(0, charIndex + 1);
    
    // Update counters
    isDeleting ? charIndex-- : charIndex++;
    lastAnimationTime = timestamp;

    // State transitions
    if (!isDeleting && charIndex === currentWord.length) {
      // Pause at end of word
      setTimeout(() => {
        isDeleting = true;
        animationFrame = window.requestAnimationFrame(typeEffect);
      }, pauseBetweenWords);
      return;
    } else if (isDeleting && charIndex === 0) {
      // Move to next word
      isDeleting = false;
      wordIndex = (wordIndex + 1) % words.length;
    }
  }

  // Continue animation
  animationFrame = window.requestAnimationFrame(typeEffect);
}

// ===== TAB VISIBILITY CONTROL =====
function handleVisibilityChange() {
  if (document.hidden) {
    // Pause when tab is inactive
    cancelAnimationFrame(animationFrame);
    animationFrame = null;
  } else {
    // Resume when tab becomes active
    if (!animationFrame) {
      lastAnimationTime = 0;
      animationFrame = window.requestAnimationFrame(typeEffect);
    }
  }
}

// ===== SMOOTH SCROLLING =====
function setupSmoothScrolling() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      // Skip if it's an external link or mailto
      if (this.getAttribute('href').startsWith('#') === false) return;
      
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (!target) return;
      
      target.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    });
  });
}

// ===== FORM HANDLING =====
function setupForm() {
  const contactForm = document.getElementById('contactForm');
  if (!contactForm) return;
  
  contactForm.addEventListener('submit', function(e) {
    e.preventDefault();
    const submitBtn = this.querySelector('button[type="submit"]');
    const name = this.querySelector('#name').value;
    const email = this.querySelector('#email').value;
    const message = this.querySelector('#message').value;
    
    // Visual feedback
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
    
    // Create mailto link
    const subject = `New message from ${name} (${email})`;
    const body = `Name: ${name}%0D%0AEmail: ${email}%0D%0AMessage: ${message}`;
    const mailtoLink = `mailto:priyashan419@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    
    // Open default email client
    window.location.href = mailtoLink;
    
    // Reset form after delay
    setTimeout(() => {
      submitBtn.innerHTML = '<i class="fas fa-check"></i> Sent!';
      this.reset();
      
      // Reset button after 2 seconds
      setTimeout(() => {
        submitBtn.disabled = false;
        submitBtn.innerHTML = 'Send Message';
      }, 2000);
    }, 1000);
  });
}

// ===== MOBILE MENU TOGGLE =====
function setupMobileMenu() {
  const menuToggle = document.createElement('button');
  menuToggle.className = 'mobile-menu-toggle';
  menuToggle.innerHTML = '<i class="fas fa-bars"></i>';
  menuToggle.setAttribute('aria-label', 'Toggle menu');
  
  const sidebar = document.querySelector('.sidebar');
  if (!sidebar) return;
  
  // Insert toggle button
  document.body.insertBefore(menuToggle, document.body.firstChild);
  
  // Toggle menu on click
  menuToggle.addEventListener('click', () => {
    sidebar.classList.toggle('mobile-open');
    menuToggle.innerHTML = sidebar.classList.contains('mobile-open') 
      ? '<i class="fas fa-times"></i>' 
      : '<i class="fas fa-bars"></i>';
  });
  
  // Close menu when clicking on a link
  document.querySelectorAll('.sidebar a').forEach(link => {
    link.addEventListener('click', () => {
      sidebar.classList.remove('mobile-open');
      menuToggle.innerHTML = '<i class="fas fa-bars"></i>';
    });
  });
}

// ===== PROJECT BUTTON HANDLING =====
function setupProjectButtons() {
  document.querySelectorAll('.project-details .btn').forEach(button => {
    if (button.getAttribute('href') === '#') {
      button.addEventListener('click', (e) => {
        e.preventDefault();
        const projectTitle = button.closest('.project-details').querySelector('h3').textContent;
        alert(`Project details for "${projectTitle}" would open here.`);
      });
    }
  });
}

// ===== INITIALIZE EVERYTHING =====
document.addEventListener("DOMContentLoaded", () => {
  // Start animations
  animationFrame = window.requestAnimationFrame(typeEffect);
  
  // Set up event listeners
  document.addEventListener('visibilitychange', handleVisibilityChange);
  setupSmoothScrolling();
  setupForm();
  setupMobileMenu();
  setupProjectButtons();
});

// ===== CLEANUP ON PAGE UNLOAD =====
window.addEventListener('beforeunload', () => {
  cancelAnimationFrame(animationFrame);
});

// ===== ADDITIONAL STYLES FOR MOBILE MENU =====
const mobileMenuStyles = document.createElement('style');
mobileMenuStyles.textContent = `
  .mobile-menu-toggle {
    display: none;
    position: fixed;
    top: 15px;
    left: 15px;
    z-index: 1100;
    background: var(--primary);
    color: #111;
    border: none;
    border-radius: 50%;
    width: 50px;
    height: 50px;
    font-size: 1.5rem;
    cursor: pointer;
    box-shadow: 0 2px 10px rgba(0,0,0,0.2);
  }
  
  @media (max-width: 768px) {
    .mobile-menu-toggle {
      display: block;
    }
    .sidebar {
      transform: translateX(-100%);
      transition: transform 0.3s ease;
    }
    .sidebar.mobile-open {
      transform: translateX(0);
    }
  }
`;
document.head.appendChild(mobileMenuStyles);