// ================================
// GALLERY FUNCTIONALITY
// ================================
document.addEventListener('DOMContentLoaded', function() {
    const wrapper = document.querySelector('.gallery-wrapper');
    const slides = document.querySelectorAll('.gallery-slide');
    const prevButton = document.querySelector('.gallery-prev');
    const nextButton = document.querySelector('.gallery-next');
    const dotsContainer = document.querySelector('.gallery-dots');

    if (!wrapper || slides.length === 0) {
        console.log('[v0] Gallery not found, skipping gallery initialization');
        return;
    }

    let currentSlide = 0;
    let autoSlideTimeout;

    // Create dots
    slides.forEach((_, index) => {
        const dot = document.createElement('div');
        dot.classList.add('dot');
        if (index === 0) dot.classList.add('active');
        dot.addEventListener('click', () => goToSlide(index));
        dotsContainer.appendChild(dot);
    });

    const dots = document.querySelectorAll('.dot');

    function updateDots() {
        dots.forEach((dot, index) => {
            dot.classList.toggle('active', index === currentSlide);
        });
    }

    function goToSlide(n) {
        currentSlide = n % slides.length;
        if (currentSlide < 0) currentSlide = slides.length - 1;
        
        const offset = -currentSlide * 100;
        wrapper.style.transform = `translateX(${offset}%)`;
        updateDots();
        resetAutoSlide();
    }

    function nextSlide() {
        goToSlide(currentSlide + 1);
    }

    function prevSlide() {
        goToSlide(currentSlide - 1);
    }

    function resetAutoSlide() {
        clearTimeout(autoSlideTimeout);
        autoSlideTimeout = setTimeout(nextSlide, 5000);
    }

    prevButton.addEventListener('click', prevSlide);
    nextButton.addEventListener('click', nextSlide);

    // Auto slide every 5 seconds
    resetAutoSlide();

    // Pause auto slide on hover
    wrapper.addEventListener('mouseenter', () => {
        clearTimeout(autoSlideTimeout);
    });

    wrapper.addEventListener('mouseleave', () => {
        resetAutoSlide();
    });

    // Touch events for mobile swipe
    let touchStartX = 0;
    let touchEndX = 0;

    wrapper.addEventListener('touchstart', e => {
        touchStartX = e.changedTouches[0].screenX;
    }, false);

    wrapper.addEventListener('touchend', e => {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    }, false);

    function handleSwipe() {
        const swipeThreshold = 50;
        const diff = touchStartX - touchEndX;

        if (Math.abs(diff) > swipeThreshold) {
            if (diff > 0) {
                nextSlide();
            } else {
                prevSlide();
            }
        }
    }

    console.log('[v0] Gallery initialized successfully');
});

// ================================
// DAYS COUNTER
// ================================
document.addEventListener('DOMContentLoaded', function() {
    function calculateDays(startDate) {
        const start = new Date(startDate);
        const today = new Date();
        const timeDifference = today - start;
        return Math.floor(timeDifference / (1000 * 60 * 60 * 24));
    }

    const startDate = '2023-09-18';
    const daysCount = calculateDays(startDate);

    const daysCounterElement = document.getElementById('days-counter');
    if (daysCounterElement) {
        daysCounterElement.textContent = `${daysCount}`;
        console.log('[v0] Days counter updated:', daysCount);
    }
});

// ================================
// SMOOTH SCROLL NAVIGATION
// ================================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
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

// ================================
// NAVBAR ACTIVE STATE
// ================================
window.addEventListener('scroll', function() {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 100) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// ================================
// DROPDOWN MOBILE FIX
// ================================
document.addEventListener('DOMContentLoaded', function() {
    const dropdownItems = document.querySelectorAll('.dropdown-item');
    
    dropdownItems.forEach(item => {
        item.addEventListener('click', function(e) {
            // Only prevent default if it's a link to a page
            if (!this.getAttribute('href').includes('#')) {
                return; // Allow normal navigation
            }
        });
    });

    // Close dropdowns when clicking outside
    document.addEventListener('click', function(event) {
        const isClickInsideDropdown = event.target.closest('.dropdown');
        if (!isClickInsideDropdown) {
            document.querySelectorAll('.dropdown-menu').forEach(menu => {
                menu.classList.remove('show');
            });
        }
    });
});

// ================================
// ANIMATION ON SCROLL (Optional enhancement)
// ================================
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

document.querySelectorAll('.instruction-card, .timeline-item').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
    observer.observe(el);
});

console.log('[v0] App.js loaded successfully');
