/* ============================================
   COMIC SATHI — INTERACTIONS & UTILITIES
============================================ */

class InteractionManager {
    constructor() {
        this.initMobileMenu();
        this.initFAQ();
        this.initFormValidation();
        this.initScrollAnimations();
        this.initNavigation();
    }

    // Mobile Menu Management
    initMobileMenu() {
        const mobileToggle = document.getElementById('mobile-toggle');
        const mobileMenu = document.getElementById('mobile-menu');
        const mobileMenuClose = document.getElementById('mobile-menu-close');

        if (!mobileToggle || !mobileMenu) return;

        mobileToggle.addEventListener('click', () => {
            mobileMenu.classList.add('active');
            mobileToggle.classList.add('active');
            document.body.style.overflow = 'hidden';
        });

        mobileMenuClose.addEventListener('click', () => {
            this.closeMobileMenu(mobileMenu, mobileToggle);
        });

        mobileMenu.addEventListener('click', (e) => {
            if (e.target.tagName === 'A') {
                this.closeMobileMenu(mobileMenu, mobileToggle);
            }
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && mobileMenu.classList.contains('active')) {
                this.closeMobileMenu(mobileMenu, mobileToggle);
            }
        });
    }

    closeMobileMenu(mobileMenu, mobileToggle) {
        mobileMenu.classList.remove('active');
        mobileToggle.classList.remove('active');
        document.body.style.overflow = 'auto';
    }

    // FAQ Toggle
    initFAQ() {
        const faqItems = document.querySelectorAll('.faq-item');
        
        faqItems.forEach(item => {
            const question = item.querySelector('.faq-question');
            
            question.addEventListener('click', () => {
                const isOpen = item.classList.contains('open');
                
                // Close all other items
                faqItems.forEach(other => {
                    if (other !== item && other.classList.contains('open')) {
                        other.classList.remove('open');
                    }
                });

                // Toggle current item
                item.classList.toggle('open');
            });

            // Open first FAQ item by default
            if (question.closest('.faq-item') === faqItems[0]) {
                item.classList.add('open');
            }
        });
    }

    // Form Validation
    initFormValidation() {
        const contactForm = document.getElementById('contact-form');
        
        if (!contactForm) return;

        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();

            // Get form data
            const formData = new FormData(contactForm);
            const data = Object.fromEntries(formData);

            // Simple validation
            if (!this.validateEmail(data.email)) {
                alert('Please enter a valid email address');
                return;
            }

            // Show success message
            this.showFormSuccess(contactForm);

            // Reset form
            setTimeout(() => {
                contactForm.reset();
            }, 500);
        });

        // Real-time input styling
        contactForm.querySelectorAll('.form-input, .form-textarea').forEach(input => {
            input.addEventListener('focus', function() {
                this.style.borderColor = 'var(--apple-blue)';
            });

            input.addEventListener('blur', function() {
                this.style.borderColor = 'rgba(0, 0, 0, 0.08)';
            });
        });
    }

    validateEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    showFormSuccess(form) {
        const button = form.querySelector('.form-submit');
        const originalText = button.textContent;

        button.textContent = '✓ Message Sent!';
        button.style.background = '#34c759';
        button.disabled = true;

        setTimeout(() => {
            button.textContent = originalText;
            button.style.background = 'var(--apple-blue)';
            button.disabled = false;
        }, 3000);
    }

    // Scroll Animations
    initScrollAnimations() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);

        // Observe all animated elements
        const animatedElements = document.querySelectorAll(
            '.service-card, .process-card, .stat-cell, .faq-item'
        );

        animatedElements.forEach((el, index) => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(20px)';
            el.style.transition = `opacity 0.6s ease ${index * 0.05}s, transform 0.6s ease ${index * 0.05}s`;
            observer.observe(el);
        });
    }

    // Navigation
    initNavigation() {
        const navLinks = document.querySelectorAll('.nav-links a, .nav-cta');

        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                const href = link.getAttribute('href');
                
                if (href.startsWith('#')) {
                    e.preventDefault();
                    const target = document.querySelector(href);
                    
                    if (target) {
                        const offsetTop = target.offsetTop - 48;
                        window.scrollTo({
                            top: offsetTop,
                            behavior: 'smooth'
                        });
                    }
                }
            });
        });

        // Update active nav link on scroll
        window.addEventListener('scroll', () => {
            this.updateActiveNavLink();
        });
    }

    updateActiveNavLink() {
        const sections = document.querySelectorAll('section[id]');
        const scrollPosition = window.scrollY + 100;

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;

            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                const navLinks = document.querySelectorAll('.nav-links a');
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${section.id}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }
}

// Utility Functions
class Utils {
    static debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    static throttle(func, limit) {
        let inThrottle;
        return function(...args) {
            if (!inThrottle) {
                func.apply(this, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }

    static smoothScroll(target, duration = 1000) {
        const startPosition = window.pageYOffset;
        const endPosition = target.offsetTop;
        const distance = endPosition - startPosition;
        let start = null;

        const animation = (currentTime) => {
            if (start === null) start = currentTime;
            const timeElapsed = currentTime - start;
            const progress = timeElapsed / duration;

            window.scrollBy(0, distance * progress);

            if (timeElapsed < duration) {
                requestAnimationFrame(animation);
            }
        };

        requestAnimationFrame(animation);
    }

    static addParticle(x, y, color = '#0071e3') {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.left = x + 'px';
        particle.style.top = y + 'px';
        particle.style.width = '10px';
        particle.style.height = '10px';
        particle.style.borderRadius = '50%';
        particle.style.background = color;
        particle.style.boxShadow = `0 0 10px ${color}`;
        particle.style.animation = `float 1s ease-out forwards`;
        
        document.body.appendChild(particle);
        
        setTimeout(() => particle.remove(), 1000);
    }

    static createRipple(event) {
        const button = event.currentTarget;
        const ripple = document.createElement('span');
        const rect = button.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = event.clientX - rect.left - size / 2;
        const y = event.clientY - rect.top - size / 2;

        ripple.style.width = ripple.style.height = size + 'px';
        ripple.style.left = x + 'px';
        ripple.style.top = y + 'px';
        ripple.style.position = 'absolute';
        ripple.style.borderRadius = '50%';
        ripple.style.background = 'rgba(255, 255, 255, 0.5)';
        ripple.style.pointerEvents = 'none';
        ripple.style.animation = 'ripple 0.6s ease-out';

        button.appendChild(ripple);
        setTimeout(() => ripple.remove(), 600);
    }

    static trackEvent(category, action, label) {
        if (typeof gtag !== 'undefined') {
            gtag('event', action, {
                event_category: category,
                event_label: label
            });
        }
    }
}

// Add ripple effect to all buttons
document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.btn-primary').forEach(button => {
        button.addEventListener('click', Utils.createRipple);
    });
});

// Initialize all interactions
window.addEventListener('DOMContentLoaded', () => {
    new InteractionManager();
    console.log('Comic Sathi - Interactive Site Loaded ✨');
});

// Performance monitoring
window.addEventListener('load', () => {
    const perfData = window.performance.timing;
    const pageLoadTime = perfData.loadEventEnd - perfData.navigationStart;
    console.log('Page Load Time: ' + pageLoadTime + 'ms');
});

// Detect device type
const isMobile = () => /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
const isTablet = () => /iPad|Android/i.test(navigator.userAgent) && !/Mobile/i.test(navigator.userAgent);

document.documentElement.setAttribute('data-device', 
    isTablet() ? 'tablet' : isMobile() ? 'mobile' : 'desktop'
);
