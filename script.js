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
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      
      // Close mobile menu if open
      document.querySelector('.sidebar')?.classList.remove('mobile-open');
      
      target.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    });
  });
}

// ===== FORM HANDLING =====
function setupForm() {
  const contactForm = document.querySelector('.contact-form');
  if (!contactForm) return;
  
  contactForm.addEventListener('submit', function(e) {
    e.preventDefault();
    const submitBtn = this.querySelector('button[type="submit"]');
    
    // Visual feedback
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
    
    // Simulate form submission (replace with actual fetch() in production)
    setTimeout(() => {
      submitBtn.textContent = '✓ Sent!';
      this.reset();
      
      // Reset button after 2 seconds
      setTimeout(() => {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Send Message';
      }, 2000);
    }, 1500);
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
});

// ===== CLEANUP ON PAGE UNLOAD =====
window.addEventListener('beforeunload', () => {
  cancelAnimationFrame(animationFrame);
});