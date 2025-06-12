// Main application entry point
import './auth.js';

// Initialize loading management
class LoadingManager {
    constructor() {
        this.loadingElement = document.getElementById('loading');
        this.mainContent = document.getElementById('mainContent');
        this.init();
    }

    init() {
        // Hide loading spinner after content loads
        window.addEventListener('load', () => {
            this.hideLoading();
        });

        // Fallback timeout
        setTimeout(() => {
            this.hideLoading();
        }, 3000);
    }

    hideLoading() {
        if (this.loadingElement) {
            this.loadingElement.classList.add('opacity-0');
            setTimeout(() => {
                this.loadingElement.style.display = 'none';
                if (this.mainContent) {
                    this.mainContent.classList.remove('hidden');
                }
            }, 500);
        }
    }

    showLoading() {
        if (this.loadingElement) {
            this.loadingElement.style.display = 'flex';
            this.loadingElement.classList.remove('opacity-0');
            if (this.mainContent) {
                this.mainContent.classList.add('hidden');
            }
        }
    }
}

// Initialize loading manager
new LoadingManager();

// Theme management
class ThemeManager {
    constructor() {
        this.themeToggle = document.getElementById('theme-toggle');
        this.init();
    }

    init() {
        // Check for saved theme preference or default to system preference
        const savedTheme = localStorage.getItem('theme');
        const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        
        if (savedTheme === 'dark' || (!savedTheme && systemPrefersDark)) {
            document.documentElement.classList.add('dark');
        }

        // Setup theme toggle
        if (this.themeToggle) {
            this.themeToggle.addEventListener('click', this.toggleTheme.bind(this));
        }

        // Listen for system theme changes
        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
            if (!localStorage.getItem('theme')) {
                if (e.matches) {
                    document.documentElement.classList.add('dark');
                } else {
                    document.documentElement.classList.remove('dark');
                }
            }
        });
    }

    toggleTheme() {
        const isDark = document.documentElement.classList.toggle('dark');
        localStorage.setItem('theme', isDark ? 'dark' : 'light');
    }
}

// Initialize theme manager
new ThemeManager();

// Mobile menu management
class MobileMenuManager {
    constructor() {
        this.menuButton = document.getElementById('mobile-menu-button');
        this.mobileMenu = document.getElementById('mobile-menu');
        this.init();
    }

    init() {
        if (this.menuButton && this.mobileMenu) {
            this.menuButton.addEventListener('click', this.toggleMenu.bind(this));
            
            // Close menu when clicking on links
            this.mobileMenu.querySelectorAll('a').forEach(link => {
                link.addEventListener('click', () => {
                    this.closeMenu();
                });
            });

            // Close menu when clicking outside
            document.addEventListener('click', (e) => {
                if (!this.menuButton.contains(e.target) && !this.mobileMenu.contains(e.target)) {
                    this.closeMenu();
                }
            });
        }
    }

    toggleMenu() {
        this.mobileMenu.classList.toggle('hidden');
        const isOpen = !this.mobileMenu.classList.contains('hidden');
        
        // Update button icon
        const icon = this.menuButton.querySelector('i');
        if (icon) {
            icon.className = isOpen ? 'fas fa-times text-2xl' : 'fas fa-bars text-2xl';
        }
    }

    closeMenu() {
        this.mobileMenu.classList.add('hidden');
        const icon = this.menuButton.querySelector('i');
        if (icon) {
            icon.className = 'fas fa-bars text-2xl';
        }
    }
}

// Initialize mobile menu manager
new MobileMenuManager();

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const headerOffset = 80;
            const elementPosition = target.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// Active navigation link highlighting
class NavigationHighlighter {
    constructor() {
        this.sections = document.querySelectorAll('section[id]');
        this.navLinks = document.querySelectorAll('.nav-link');
        this.init();
    }

    init() {
        if (this.sections.length > 0 && this.navLinks.length > 0) {
            window.addEventListener('scroll', this.highlightActiveSection.bind(this));
        }
    }

    highlightActiveSection() {
        const scrollPosition = window.scrollY + 100;

        this.sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');

            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                this.navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }
}

// Initialize navigation highlighter
new NavigationHighlighter();

// Floating action button (scroll to top)
class FloatingActionButton {
    constructor() {
        this.fabButton = document.getElementById('fab-top');
        this.init();
    }

    init() {
        if (this.fabButton) {
            // Show/hide based on scroll position
            window.addEventListener('scroll', () => {
                if (window.scrollY > 300) {
                    this.fabButton.classList.add('visible');
                } else {
                    this.fabButton.classList.remove('visible');
                }
            });

            // Scroll to top on click
            this.fabButton.addEventListener('click', () => {
                window.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                });
            });
        }
    }
}

// Initialize floating action button
new FloatingActionButton();