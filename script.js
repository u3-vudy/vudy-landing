// ========================================
// VUDY LANDING PAGE - JAVASCRIPT
// ========================================

document.addEventListener('DOMContentLoaded', function() {
    // Initialize all components
    initThemeToggle();
    initHeader();
    initHeroSlider();
    initTabs();
    initFAQ();
    initMobileMenu();
    initScrollAnimations();
    initSmoothScroll();
    initStatsCounter();
    initModals();
});

// ========================================
// THEME TOGGLE (Dark/Light Mode)
// ========================================
function initThemeToggle() {
    const themeToggle = document.getElementById('themeToggle');
    const html = document.documentElement;
    
    // Check for saved theme preference or default to light
    const savedTheme = localStorage.getItem('theme') || 'light';
    html.setAttribute('data-theme', savedTheme);
    
    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            const currentTheme = html.getAttribute('data-theme');
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
            
            html.setAttribute('data-theme', newTheme);
            localStorage.setItem('theme', newTheme);
            
            // Add a subtle animation
            document.body.style.transition = 'background-color 0.3s ease, color 0.3s ease';
        });
    }
    
    // Check system preference
    if (!localStorage.getItem('theme')) {
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        if (prefersDark) {
            html.setAttribute('data-theme', 'dark');
        }
    }
}

// ========================================
// HERO SLIDER
// ========================================
function initHeroSlider() {
    const slides = document.querySelectorAll('.hero-slide');
    const dots = document.querySelectorAll('.slider-dot');
    let currentSlide = 0;
    let autoplayInterval;
    const AUTOPLAY_DELAY = 6000; // 6 seconds

    function showSlide(index) {
        // Remove active class from all slides and dots
        slides.forEach(slide => {
            slide.classList.remove('active');
        });
        dots.forEach(dot => {
            dot.classList.remove('active');
        });

        // Add active class to current slide and dot
        slides[index].classList.add('active');
        dots[index].classList.add('active');
        currentSlide = index;
    }

    function nextSlide() {
        const next = (currentSlide + 1) % slides.length;
        showSlide(next);
    }

    function startAutoplay() {
        autoplayInterval = setInterval(nextSlide, AUTOPLAY_DELAY);
    }

    function stopAutoplay() {
        clearInterval(autoplayInterval);
    }

    function resetAutoplay() {
        stopAutoplay();
        startAutoplay();
    }

    // Click handlers for dots
    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            showSlide(index);
            resetAutoplay();
        });
    });

    // Pause autoplay on hover
    const heroSection = document.querySelector('.hero');
    if (heroSection) {
        heroSection.addEventListener('mouseenter', stopAutoplay);
        heroSection.addEventListener('mouseleave', startAutoplay);
    }

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft') {
            const prev = (currentSlide - 1 + slides.length) % slides.length;
            showSlide(prev);
            resetAutoplay();
        } else if (e.key === 'ArrowRight') {
            nextSlide();
            resetAutoplay();
        }
    });

    // Touch/Swipe support
    let touchStartX = 0;
    let touchEndX = 0;

    heroSection?.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    heroSection?.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    }, { passive: true });

    function handleSwipe() {
        const swipeThreshold = 50;
        const diff = touchStartX - touchEndX;

        if (Math.abs(diff) > swipeThreshold) {
            if (diff > 0) {
                // Swiped left - next slide
                nextSlide();
            } else {
                // Swiped right - previous slide
                const prev = (currentSlide - 1 + slides.length) % slides.length;
                showSlide(prev);
            }
            resetAutoplay();
        }
    }

    // Start autoplay
    startAutoplay();

    // Add entrance animations to slide content
    function animateSlideContent(slide) {
        const text = slide.querySelector('.hero-text');
        const image = slide.querySelector('.hero-image');
        
        if (text) {
            text.style.opacity = '0';
            text.style.transform = 'translateX(-30px)';
            setTimeout(() => {
                text.style.transition = 'all 0.8s ease';
                text.style.opacity = '1';
                text.style.transform = 'translateX(0)';
            }, 100);
        }
        
        if (image) {
            image.style.opacity = '0';
            image.style.transform = 'translateX(30px)';
            setTimeout(() => {
                image.style.transition = 'all 0.8s ease';
                image.style.opacity = '1';
                image.style.transform = 'translateX(0)';
            }, 200);
        }
    }

    // Observe slide changes for animations
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
                const slide = mutation.target;
                if (slide.classList.contains('active')) {
                    animateSlideContent(slide);
                }
            }
        });
    });

    slides.forEach(slide => {
        observer.observe(slide, { attributes: true });
    });

    // Initial animation
    if (slides[0]) {
        animateSlideContent(slides[0]);
    }
}

// ========================================
// HEADER - Scroll Effects
// ========================================
function initHeader() {
    const header = document.querySelector('.header');
    let lastScroll = 0;
    
    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;
        
        // Add shadow on scroll
        if (currentScroll > 10) {
            header.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.08)';
        } else {
            header.style.boxShadow = 'none';
        }
        
        lastScroll = currentScroll;
    });
}

// ========================================
// TABS - Features Section
// ========================================
function initTabs() {
    const tabs = document.querySelectorAll('.tab');
    
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            // Remove active class from all tabs
            tabs.forEach(t => t.classList.remove('active'));
            // Add active class to clicked tab
            tab.classList.add('active');
            
            // Here you could add logic to switch content based on tab
            const tabName = tab.dataset.tab;
            updateFeatureContent(tabName);
        });
    });
}

function updateFeatureContent(tabName) {
    // This function could update the feature cards based on the selected tab
    // For now, we'll just add a subtle animation
    const featureCards = document.querySelectorAll('.feature-card');
    featureCards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        
        setTimeout(() => {
            card.style.transition = 'all 0.4s ease';
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }, index * 100);
    });
}

// ========================================
// FAQ - Accordion
// ========================================
function initFAQ() {
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        
        question.addEventListener('click', () => {
            const isActive = item.classList.contains('active');
            
            // Close all FAQ items
            faqItems.forEach(faq => {
                faq.classList.remove('active');
            });
            
            // Open clicked item if it wasn't active
            if (!isActive) {
                item.classList.add('active');
            }
        });
    });
    
    // Open first FAQ item by default
    if (faqItems.length > 0) {
        faqItems[0].classList.add('active');
    }
}

// ========================================
// MOBILE MENU
// ========================================
function initMobileMenu() {
    const menuBtn = document.querySelector('.mobile-menu-btn');
    const navLinks = document.querySelector('.nav-links');
    const navActions = document.querySelector('.nav-actions');
    
    if (!menuBtn) return;
    
    let isOpen = false;
    
    menuBtn.addEventListener('click', () => {
        isOpen = !isOpen;
        
        if (isOpen) {
            // Create mobile menu
            const mobileMenu = document.createElement('div');
            mobileMenu.className = 'mobile-menu';
            mobileMenu.innerHTML = `
                <div class="mobile-menu-content">
                    <a href="#">Home</a>
                    <a href="#services">Services</a>
                    <a href="#blog">Blog</a>
                    <div class="mobile-menu-divider"></div>
                    <a href="#">Log in</a>
                    <a href="#" class="btn-primary" style="margin-top: 8px;">Get started</a>
                </div>
            `;
            document.body.appendChild(mobileMenu);
            
            // Add styles
            mobileMenu.style.cssText = `
                position: fixed;
                top: 72px;
                left: 0;
                right: 0;
                bottom: 0;
                background: white;
                z-index: 999;
                padding: 24px;
                animation: fadeIn 0.2s ease;
            `;
            
            const content = mobileMenu.querySelector('.mobile-menu-content');
            content.style.cssText = `
                display: flex;
                flex-direction: column;
                gap: 16px;
            `;
            
            const links = content.querySelectorAll('a:not(.btn-primary)');
            links.forEach(link => {
                link.style.cssText = `
                    font-size: 18px;
                    font-weight: 500;
                    color: #374151;
                    padding: 12px 0;
                    border-bottom: 1px solid #E5E7EB;
                `;
            });
            
            // Transform hamburger to X
            menuBtn.classList.add('active');
            menuBtn.children[0].style.transform = 'rotate(45deg) translate(6px, 6px)';
            menuBtn.children[1].style.opacity = '0';
            menuBtn.children[2].style.transform = 'rotate(-45deg) translate(6px, -6px)';
            
        } else {
            const mobileMenu = document.querySelector('.mobile-menu');
            if (mobileMenu) {
                mobileMenu.remove();
            }
            
            // Reset hamburger
            menuBtn.classList.remove('active');
            menuBtn.children[0].style.transform = 'none';
            menuBtn.children[1].style.opacity = '1';
            menuBtn.children[2].style.transform = 'none';
        }
    });
}

// ========================================
// SCROLL ANIMATIONS
// ========================================
function initScrollAnimations() {
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-visible');
                
                // Stagger children animations
                const children = entry.target.querySelectorAll('.animate-child');
                children.forEach((child, index) => {
                    setTimeout(() => {
                        child.classList.add('animate-visible');
                    }, index * 100);
                });
            }
        });
    }, observerOptions);
    
    // Observe sections
    const sections = document.querySelectorAll('section');
    sections.forEach(section => {
        section.style.opacity = '1';
        observer.observe(section);
    });
    
    // Add animation classes to specific elements
    const animateElements = document.querySelectorAll(
        '.feature-card, .stat-card, .comparison-card, .use-case-card, .testimonial-card, .step'
    );
    
    animateElements.forEach((el, index) => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        
        const elObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    setTimeout(() => {
                        el.style.transition = 'all 0.6s ease';
                        el.style.opacity = '1';
                        el.style.transform = 'translateY(0)';
                    }, (index % 4) * 100);
                    elObserver.unobserve(el);
                }
            });
        }, observerOptions);
        
        elObserver.observe(el);
    });
}

// ========================================
// SMOOTH SCROLL
// ========================================
function initSmoothScroll() {
    const links = document.querySelectorAll('a[href^="#"]');
    
    links.forEach(link => {
        link.addEventListener('click', (e) => {
            const href = link.getAttribute('href');
            if (href === '#') return;
            
            e.preventDefault();
            const target = document.querySelector(href);
            
            if (target) {
                const headerHeight = document.querySelector('.header').offsetHeight;
                const targetPosition = target.offsetTop - headerHeight - 20;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
                
                // Close mobile menu if open
                const mobileMenu = document.querySelector('.mobile-menu');
                if (mobileMenu) {
                    mobileMenu.remove();
                    const menuBtn = document.querySelector('.mobile-menu-btn');
                    menuBtn.children[0].style.transform = 'none';
                    menuBtn.children[1].style.opacity = '1';
                    menuBtn.children[2].style.transform = 'none';
                }
            }
        });
    });
}

// ========================================
// STATS COUNTER
// ========================================
function initStatsCounter() {
    const stats = document.querySelectorAll('.stat-number');
    
    const observerOptions = {
        threshold: 0.5
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const target = entry.target;
                const finalValue = target.dataset.target;
                
                if (finalValue) {
                    animateCounter(target, parseInt(finalValue));
                }
                
                observer.unobserve(target);
            }
        });
    }, observerOptions);
    
    stats.forEach(stat => observer.observe(stat));
}

function animateCounter(element, target) {
    const duration = 2000;
    const start = 0;
    const startTime = performance.now();
    
    const originalText = element.textContent;
    const suffix = originalText.replace(/[\d,]+/, '');
    
    function update(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // Ease out quad
        const easeProgress = 1 - (1 - progress) * (1 - progress);
        
        const current = Math.floor(easeProgress * target);
        element.textContent = current.toLocaleString() + suffix;
        
        if (progress < 1) {
            requestAnimationFrame(update);
        }
    }
    
    requestAnimationFrame(update);
}

// ========================================
// CALCULATOR INPUT
// ========================================
const calculatorInput = document.querySelector('.cta-input-group input');
if (calculatorInput) {
    calculatorInput.addEventListener('input', (e) => {
        // Format number with commas
        let value = e.target.value.replace(/[^\d]/g, '');
        if (value) {
            value = parseInt(value).toLocaleString();
        }
        e.target.value = value;
    });
}

// ========================================
// BUTTON RIPPLE EFFECT
// ========================================
document.querySelectorAll('.btn-primary').forEach(button => {
    button.addEventListener('click', function(e) {
        const rect = this.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const ripple = document.createElement('span');
        ripple.style.cssText = `
            position: absolute;
            border-radius: 50%;
            background: rgba(255, 255, 255, 0.3);
            width: 100px;
            height: 100px;
            left: ${x - 50}px;
            top: ${y - 50}px;
            transform: scale(0);
            animation: ripple 0.6s ease-out;
            pointer-events: none;
        `;
        
        this.style.position = 'relative';
        this.style.overflow = 'hidden';
        this.appendChild(ripple);
        
        setTimeout(() => ripple.remove(), 600);
    });
});

// Add ripple animation
const style = document.createElement('style');
style.textContent = `
    @keyframes ripple {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
    
    @keyframes fadeIn {
        from {
            opacity: 0;
        }
        to {
            opacity: 1;
        }
    }
`;
document.head.appendChild(style);

// ========================================
// PARALLAX EFFECT FOR HERO
// ========================================
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const hero = document.querySelector('.hero-image');
    
    if (hero && scrolled < window.innerHeight) {
        hero.style.transform = `translateY(${scrolled * 0.1}px)`;
    }
});

// ========================================
// FLOATING CARDS ANIMATION
// ========================================
const floatingCards = document.querySelectorAll('.floating-card');
let mouseX = 0;
let mouseY = 0;

document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
});

function animateFloatingCards() {
    floatingCards.forEach((card, index) => {
        const rect = card.getBoundingClientRect();
        const cardCenterX = rect.left + rect.width / 2;
        const cardCenterY = rect.top + rect.height / 2;
        
        const deltaX = (mouseX - cardCenterX) * 0.02;
        const deltaY = (mouseY - cardCenterY) * 0.02;
        
        const baseTransform = index === 0 ? 
            `translateY(${Math.sin(Date.now() / 1000) * 15}px)` : 
            `translateY(${Math.sin(Date.now() / 1000 + Math.PI) * 15}px)`;
        
        card.style.transform = `${baseTransform} translate(${deltaX}px, ${deltaY}px)`;
    });
    
    requestAnimationFrame(animateFloatingCards);
}

if (floatingCards.length > 0) {
    animateFloatingCards();
}
// ========================================
// MODALS (Terms & Privacy)
// ========================================
function initModals() {
    // Terms Modal
    const openTermsBtn = document.getElementById('openTermsModal');
    const closeTermsBtn = document.getElementById('closeTermsModal');
    const termsModal = document.getElementById('termsModal');

    // Privacy Modal
    const openPrivacyBtn = document.getElementById('openPrivacyModal');
    const closePrivacyBtn = document.getElementById('closePrivacyModal');
    const privacyModal = document.getElementById('privacyModal');

    function openModal(modal) {
        if (modal) {
            modal.classList.add('active');
            document.body.style.overflow = 'hidden';
        }
    }

    function closeModal(modal) {
        if (modal) {
            modal.classList.remove('active');
            document.body.style.overflow = '';
        }
    }

    // Terms Modal handlers
    if (openTermsBtn) {
        openTermsBtn.addEventListener('click', function(e) {
            e.preventDefault();
            openModal(termsModal);
        });
    }
    if (closeTermsBtn) {
        closeTermsBtn.addEventListener('click', function() {
            closeModal(termsModal);
        });
    }

    // Privacy Modal handlers
    if (openPrivacyBtn) {
        openPrivacyBtn.addEventListener('click', function(e) {
            e.preventDefault();
            openModal(privacyModal);
        });
    }
    if (closePrivacyBtn) {
        closePrivacyBtn.addEventListener('click', function() {
            closeModal(privacyModal);
        });
    }

    // Close modals when clicking outside
    if (termsModal) {
        termsModal.addEventListener('click', function(e) {
            if (e.target === termsModal) {
                closeModal(termsModal);
            }
        });
    }
    if (privacyModal) {
        privacyModal.addEventListener('click', function(e) {
            if (e.target === privacyModal) {
                closeModal(privacyModal);
            }
        });
    }

    // Close any open modal with Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            closeModal(termsModal);
            closeModal(privacyModal);
        }
    });
}
