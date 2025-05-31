// Initialize AOS
AOS.init({
  duration: 800,
  easing: 'ease-out',
  once: true
});

// Initialize Swiper for testimonials
const testimonialsSwiper = new Swiper('.testimonials-slider', {
  slidesPerView: 1,
  spaceBetween: 30,
  loop: true,
  autoplay: {
    delay: 5000,
    disableOnInteraction: false,
  },
  pagination: {
    el: '.swiper-pagination',
    clickable: true,
  },
  breakpoints: {
    640: {
      slidesPerView: 2,
    },
    1024: {
      slidesPerView: 3,
    },
  },
});

// Initialize lightGallery
lightGallery(document.getElementById('portfolio-gallery'), {
  selector: '.gallery-item',
  plugins: [lgZoom, lgThumbnail],
  speed: 500,
});

// Portfolio filtering
const portfolioFilters = document.querySelectorAll('.portfolio-filter');
const portfolioItems = document.querySelectorAll('.portfolio-item');

portfolioFilters.forEach(filter => {
  filter.addEventListener('click', function() {
    // Remove active class from all filters
    portfolioFilters.forEach(f => f.classList.remove('active'));
    // Add active class to clicked filter
    this.classList.add('active');
    
    const filterValue = this.getAttribute('data-filter');
    
    portfolioItems.forEach(item => {
      if (filterValue === 'all' || item.classList.contains(filterValue)) {
        item.classList.remove('hidden');
        item.classList.add('fade-in');
      } else {
        item.classList.add('hidden');
        item.classList.remove('fade-in');
      }
    });
  });
});

// Smooth scroll for navigation
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      target.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  });
});

// Intersection Observer for fade-in animations
const fadeElems = document.querySelectorAll('.fade-in');
const observer = new IntersectionObserver(
  entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  },
  { threshold: 0.1 }
);

fadeElems.forEach(elem => observer.observe(elem));

// Skill bars animation
const skillBars = document.querySelectorAll('.skill-progress');
const skillObserver = new IntersectionObserver(
  entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const width = entry.target.getAttribute('data-width');
        entry.target.style.width = `${width}%`;
      }
    });
  },
  { threshold: 0.1 }
);

skillBars.forEach(bar => skillObserver.observe(bar));

// Dark mode toggle with smooth transition
const darkModeToggle = document.getElementById('dark-mode-toggle');
const html = document.documentElement;

darkModeToggle.addEventListener('click', () => {
  html.classList.toggle('dark');
  localStorage.setItem('darkMode', html.classList.contains('dark'));
});

// Check for saved dark mode preference
if (localStorage.getItem('darkMode') === 'true' ||
    (!localStorage.getItem('darkMode') && 
     window.matchMedia('(prefers-color-scheme: dark)').matches)) {
  html.classList.add('dark');
}

// Enhanced form validation and submission
const contactForm = document.getElementById('contact-form');
contactForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  
  const formData = new FormData(contactForm);
  const submitButton = contactForm.querySelector('button[type="submit"]');
  const originalButtonText = submitButton.innerHTML;
  
  try {
    submitButton.disabled = true;
    submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
    
    // Add your form submission logic here
    
    // Show success message
    showMessage('Message sent successfully!', 'success');
    contactForm.reset();
  } catch (error) {
    showMessage('Failed to send message. Please try again.', 'error');
  } finally {
    submitButton.disabled = false;
    submitButton.innerHTML = originalButtonText;
  }
});

// Helper function to show messages
function showMessage(message, type) {
  const messageDiv = document.createElement('div');
  messageDiv.className = `message ${type}-message`;
  messageDiv.textContent = message;
  
  const form = document.getElementById('contact-form');
  form.parentNode.insertBefore(messageDiv, form);
  
  setTimeout(() => messageDiv.remove(), 5000);
}

// Mobile menu toggle
const mobileMenuButton = document.getElementById('mobile-menu-button');
const mobileMenu = document.getElementById('mobile-menu');

mobileMenuButton.addEventListener('click', () => {
  mobileMenu.classList.toggle('hidden');
  document.body.classList.toggle('menu-open');
});

// Initialize vanilla-tilt for cards
VanillaTilt.init(document.querySelectorAll('.tilt-card'), {
  max: 15,
  speed: 400,
  glare: true,
  'max-glare': 0.5
});

// GSAP animations for hero section
gsap.from('.hero-content', {
  duration: 1,
  y: 50,
  opacity: 0,
  ease: 'power3.out',
  stagger: 0.2
});

// Loading animation
window.addEventListener('load', () => {
  const loader = document.querySelector('.loading');
  loader.style.opacity = '0';
  setTimeout(() => loader.style.display = 'none', 500);
});