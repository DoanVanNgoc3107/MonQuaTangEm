document.addEventListener('DOMContentLoaded', function() {
    // ---------- PHẦN XỬ LÝ LOADING SCREEN ----------
    const loadingScreen = document.getElementById('loading-screen');
    const loadingProgress = document.querySelector('.loading-progress');
    const heartsContainer = document.querySelector('.hearts-container');
    const body = document.body;

    // Thêm iframe nhạc YouTube vào trang
    const musicPlayer = document.createElement('div');
    musicPlayer.innerHTML = '<iframe id="ytPlayer" width="0" height="0" src="https://www.youtube.com/embed/JgTZvDbaTtg?si=UodKCes0-RFxpOAl&start=77&autoplay=1&mute=0" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen style="display:none;"></iframe>';
    document.body.appendChild(musicPlayer);

    let isMusicPlaying = true;
    const toggleMusicBtn = document.getElementById('toggleMusic');

    // Chức năng bật/tắt nhạc
    function setupMusicControl() {
        toggleMusicBtn.addEventListener('click', function() {
            const iframe = document.getElementById('ytPlayer');

            if (isMusicPlaying) {
                // Tạm dừng nhạc
                iframe.contentWindow.postMessage('{"event":"command","func":"pauseVideo","args":""}', '*');
                toggleMusicBtn.classList.remove('playing');
                toggleMusicBtn.classList.add('paused');
                toggleMusicBtn.querySelector('.play-text').textContent = 'Bật nhạc';
            } else {
                // Phát nhạc
                iframe.contentWindow.postMessage('{"event":"command","func":"playVideo","args":""}', '*');
                toggleMusicBtn.classList.remove('paused');
                toggleMusicBtn.classList.add('playing');
                toggleMusicBtn.querySelector('.play-text').textContent = 'Tắt nhạc';
            }

            isMusicPlaying = !isMusicPlaying;
        });
    }

    // Tạo hiệu ứng tim bay trong màn hình loading
    function createHearts() {
        for (let i = 0; i < 15; i++) {
            const heart = document.createElement('div');
            heart.classList.add('loading-heart');
            heart.style.left = Math.random() * 100 + '%';
            heart.style.animationDelay = Math.random() * 5 + 's';
            heart.style.animationDuration = Math.random() * 3 + 3 + 's';
            heartsContainer.appendChild(heart);
        }
    }

    // Mô phỏng tiến trình tải
    function simulateLoading() {
        let width = 0;
        const interval = setInterval(() => {
            if (width >= 100) {
                clearInterval(interval);
                setTimeout(() => {
                    loadingScreen.style.opacity = '0';
                    setTimeout(() => {
                        loadingScreen.style.display = 'none';
                        body.classList.add('loaded');

                        // Kích hoạt hiệu ứng cho các phần tử đầu tiên
                        checkVisibility();

                        // Hiển thị hiệu ứng chào mừng
                        showWelcomeAnimation();
                    }, 500);
                }, 600);
            } else {
                width += Math.random() * 7;
                if (width > 100) width = 100;
                loadingProgress.style.width = width + '%';
            }
        }, 150);
    }

    // Hiệu ứng chào mừng sau khi trang tải xong
    function showWelcomeAnimation() {
        const hero = document.querySelector('.hero-section');
        hero.style.opacity = '0';
        hero.style.transform = 'translateY(50px)';

        setTimeout(() => {
            hero.style.transition = 'all 1.5s ease-out';
            hero.style.opacity = '1';
            hero.style.transform = 'translateY(0)';
        }, 300);
    }

    // ---------- PHẦN XỬ LÝ HIỆU ỨNG SCROLL ----------
    const revealElements = document.querySelectorAll('.reveal-text, .card, .memory-item, section');
    const navbar = document.getElementById('navbar');

    // Thêm class active cho menu khi scroll
    function highlightNavItem() {
        const sections = document.querySelectorAll('section[id]');
        const scrollY = window.scrollY;

        sections.forEach(section => {
            const sectionTop = section.offsetTop - 100;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');

            if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
                document.querySelector(`.navbar-nav .nav-link[href*=${sectionId}]`)?.classList.add('active');
            } else {
                document.querySelector(`.navbar-nav .nav-link[href*=${sectionId}]`)?.classList.remove('active');
            }
        });
    }

    // Hiệu ứng navbar khi scroll
    function handleNavbarScroll() {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    }

    // Hiệu ứng phân tán hiển thị các phần tử
    function checkVisibility() {
        const triggerBottom = window.innerHeight * 0.85;

        revealElements.forEach((element, index) => {
            const elementTop = element.getBoundingClientRect().top;

            if (elementTop < triggerBottom) {
                // Thêm độ trễ để tạo hiệu ứng xuất hiện lần lượt
                setTimeout(() => {
                    element.classList.add('visible');

                    // Áp dụng hiệu ứng dựa vào loại phần tử
                    if (element.classList.contains('card')) {
                        element.style.animation = `fadeInUp 0.8s ease forwards ${index * 0.15}s`;
                    } else if (element.classList.contains('memory-item')) {
                        element.style.animation = `zoomIn 0.7s ease forwards ${index * 0.1}s`;
                    } else if (element.classList.contains('reveal-text')) {
                        element.style.animation = `slideInLeft 0.6s ease forwards ${index * 0.08}s`;
                    }

                    // Nếu là phần tử có chứa animate.css classes
                    if (element.classList.contains('animate__animated')) {
                        const animationClass = Array.from(element.classList).find(cls =>
                            cls.startsWith('animate__') && cls !== 'animate__animated');

                        if (animationClass) {
                            element.classList.add('animate__animated', animationClass);
                        }
                    }
                }, index * 100);
            }
        });
    }

    // Hiệu ứng mượt mà khi click vào menu
    function initSmoothScroll() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function(e) {
                e.preventDefault();

                const targetId = this.getAttribute('href');
                const targetElement = document.querySelector(targetId);

                if (targetElement) {
                    // Thêm hiệu ứng cuộn mượt
                    window.scrollTo({
                        top: targetElement.offsetTop - 80,
                        behavior: 'smooth'
                    });

                    // Thêm hiệu ứng nhấp nháy để làm nổi bật phần được cuộn đến
                    setTimeout(() => {
                        targetElement.classList.add('highlight-section');
                        setTimeout(() => {
                            targetElement.classList.remove('highlight-section');
                        }, 1500);
                    }, 600);
                }
            });
        });
    }

    // Thêm hiệu ứng parallax khi scroll
    function initParallaxEffect() {
        window.addEventListener('scroll', () => {
            const scrollY = window.scrollY;

            // Hiệu ứng parallax cho banner
            const banner = document.getElementById('banner');
            if (banner) {
                banner.style.backgroundPositionY = -scrollY * 0.3 + 'px';
            }

            // Hiệu ứng chuyển động cho các phần tử khác
            document.querySelectorAll('.floating-hearts-container').forEach(item => {
                item.style.transform = `translateY(${scrollY * 0.08}px) rotate(${scrollY * 0.02}deg)`;
            });
        });
    }

    // Khởi chạy tất cả các hàm
    createHearts();
    simulateLoading();
    setupMusicControl();
    initSmoothScroll();
    initParallaxEffect();

    // Thêm event listeners cho scroll
    window.addEventListener('scroll', () => {
        highlightNavItem();
        handleNavbarScroll();
        checkVisibility();
    });

    // Đảm bảo thêm keyframe animations vào CSS
    const styleSheet = document.createElement('style');
    styleSheet.textContent = `
        @keyframes fadeInUp {
            from { opacity: 0; transform: translateY(50px); }
            to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes zoomIn {
            from { opacity: 0; transform: scale(0.8); }
            to { opacity: 1; transform: scale(1); }
        }
        
        @keyframes slideInLeft {
            from { opacity: 0; transform: translateX(-50px); }
            to { opacity: 1; transform: translateX(0); }
        }
        
        .highlight-section {
            animation: highlightPulse 1.5s ease;
        }
        
        @keyframes highlightPulse {
            0% { box-shadow: 0 0 0 0 rgba(255, 133, 162, 0); }
            30% { box-shadow: 0 0 0 15px rgba(255, 133, 162, 0.4); }
            70% { box-shadow: 0 0 0 15px rgba(255, 133, 162, 0.4); }
            100% { box-shadow: 0 0 0 0 rgba(255, 133, 162, 0); }
        }
    `;
    document.head.appendChild(styleSheet);
});