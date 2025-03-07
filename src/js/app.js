// Gallery functionality
document.addEventListener('DOMContentLoaded', function() {
    const wrapper = document.querySelector('.gallery-wrapper');
    const slides = document.querySelectorAll('.gallery-slide');
    const prevButton = document.querySelector('.gallery-prev');
    const nextButton = document.querySelector('.gallery-next');
    const dotsContainer = document.querySelector('.gallery-dots');

    let currentSlide = 0;

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
        currentSlide = n;
        const offset = -currentSlide * 100;
        wrapper.style.transform = `translateX(${offset}%)`;
        updateDots();
    }

    function nextSlide() {
        currentSlide = (currentSlide + 1) % slides.length;
        goToSlide(currentSlide);
    }

    function prevSlide() {
        currentSlide = (currentSlide - 1 + slides.length) % slides.length;
        goToSlide(currentSlide);
    }

    prevButton.addEventListener('click', prevSlide);
    nextButton.addEventListener('click', nextSlide);

    // Auto slide every 5 seconds
    let slideInterval = setInterval(nextSlide, 5000);

    // Pause auto slide on hover
    wrapper.addEventListener('mouseenter', () => {
        clearInterval(slideInterval);
    });

    wrapper.addEventListener('mouseleave', () => {
        slideInterval = setInterval(nextSlide, 5000);
    });

    // Touch events for mobile
    let touchStartX = 0;
    let touchEndX = 0;

    wrapper.addEventListener('touchstart', e => {
        touchStartX = e.changedTouches[0].screenX;
    });

    wrapper.addEventListener('touchend', e => {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    });

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
});

// Quay vể trang chủ
function backHome() {
    window.location.href = 'index.html';
}

// Dếm ngày
document.addEventListener('DOMContentLoaded', function() {
    // Function to calculate the number of days between two dates
    function calculateDays(startDate) {
        const start = new Date(startDate);
        const today = new Date();
        const timeDifference = today - start;
        return Math.floor(timeDifference / (1000 * 60 * 60 * 24));
    }

    // Set the start date
    const startDate = '2023-09-18';

    // Get the number of days
    const daysCount = calculateDays(startDate);

    // Display the result in an element with id 'days-counter'
    document.getElementById('days-counter').textContent = `${daysCount}`;
});

document.addEventListener('DOMContentLoaded', function() {
    document.addEventListener('click', function(event) {
        const dropdown = document.querySelector('.dropdown-menu');
        const isClickInside = dropdown.contains(event.target);

        if (!isClickInside) {
            dropdown.classList.remove('show');
        }
    });

    const dropdownToggle = document.querySelector('.dropdown-toggle');
    dropdownToggle.addEventListener('click', function(event) {
        event.stopPropagation();
        const dropdown = this.nextElementSibling;
        dropdown.classList.toggle('show');
    });
});

function backHomeInfo() {
    window.location.href = '../index.html';
}

// script.js
document.addEventListener('DOMContentLoaded', function() {
    // Initialize fireworks
    const fireworks = new Fireworks(document.getElementById('fireworks'), {
        opacity: 0.5,
        acceleration: 1.05,
        friction: 0.97,
        gravity: 1.5,
        particles: 50,
        explosion: 5,
        intensity: 30,
        flickering: 50,
        lineStyle: 'round',
        hue: {
            min: 0,
            max: 360
        }
    });

    fireworks.start();

    // Background music control
    const music = document.getElementById('background-music');
    const musicBtn = document.getElementById('toggleMusic');

    music.volume = 0.3;

    musicBtn.addEventListener('click', function() {
        if (music.paused) {
            music.play();
            musicBtn.innerHTML = '<i class="fas fa-music"></i>';
        } else {
            music.pause();
            musicBtn.innerHTML = '<i class="fas fa-volume-mute"></i>';
        }
    });

    // Countdown timer
    function updateCountdown() {
        const now = new Date();
        const tet = new Date('2025-01-29T00:00:00');
        const diff = tet - now;

        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);

        document.getElementById('countdown-timer').textContent =
            `${days} ngày ${hours} giờ ${minutes} phút ${seconds} giây nữa đến Tết`;
    }

    setInterval(updateCountdown, 1000);
    updateCountdown();

    // Gift box animations
    function openGift(giftNumber) {
        const giftBox = document.querySelector(`.gift-box:nth-child(${giftNumber})`);
        if (!giftBox.classList.contains('opened')) {
            giftBox.classList.add('opened');
            giftBox.querySelector('.gift-lid').style.transform = 'rotateX(-180deg)';
            setTimeout(() => {
                giftBox.querySelector('.gift-content').style.opacity = '1';
            }, 500);
        }
    }

    // Lucky money envelope
    function openEnvelope() {
        const envelope = document.querySelector('.envelope');
        const messages = [
            "Chúc em vạn sự như ý! 🎊",
            "Năm mới phát tài phát lộc! 💰",
            "Tiền vào như nước! 💸",
            "Sung túc quanh năm! 🧧"
        ];

        if (!envelope.classList.contains('opened')) {
            envelope.classList.add('opened');
            const randomMessage = messages[Math.floor(Math.random() * messages.length)];
            envelope.querySelector('.envelope-content').textContent = randomMessage;
        }
    }

    // Initialize Bau Cua game
    const bauCuaGame = {
        // Previous Bau Cua game logic
    };

    bauCuaGame.init();

    // Clean up when leaving page
    window.addEventListener('beforeunload', function() {
        music.pause();
        fireworks.stop();
    });
});