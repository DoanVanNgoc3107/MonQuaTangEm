// Cấu hình chung
const CONFIG = {
    startDate: new Date('2023-01-01'),
    minLoveMeter: 80,
    maxLoveMeter: 100,
    fadeInDuration: 1000,
    maxMusicVolume: 0.8
};

// Quản lý âm thanh tốt hơn
class AudioManager {
    constructor() {
        this.bgMusic = document.getElementById('bgMusic');
        this.clickSound = document.getElementById('clickSound');
        this.isMusicPlaying = false;
        this.fadeInterval = null;
    }

    playWithFade(audio, duration = CONFIG.fadeInDuration) {
        if (!audio) return;

        audio.play().catch(err => {
            console.warn('Không thể phát nhạc:', err);
        });

        audio.volume = 0;
        if (this.fadeInterval) clearInterval(this.fadeInterval);

        const increment = CONFIG.maxMusicVolume / (duration / 100);
        this.fadeInterval = setInterval(() => {
            if (audio.volume < CONFIG.maxMusicVolume) {
                audio.volume = Math.min(audio.volume + increment, CONFIG.maxMusicVolume);
            } else {
                clearInterval(this.fadeInterval);
            }
        }, 100);
    }

    toggleMusic() {
        if (!this.bgMusic) return;

        if (this.isMusicPlaying) {
            this.bgMusic.pause();
            toggleMusic.innerHTML = '<i class="fas fa-volume-mute"></i>';
        } else {
            this.playWithFade(this.bgMusic);
            toggleMusic.innerHTML = '<i class="fas fa-volume-up"></i>';
        }
        this.isMusicPlaying = !this.isMusicPlaying;
    }
}

// Quản lý Gallery tốt hơn
class GalleryManager {
    constructor(photos, containerSelector) {
        this.photos = photos;
        this.container = document.querySelector(containerSelector);
        this.currentIndex = 0;
    }

    createGallery() {
        if (!this.container) return;

        this.photos.forEach((photo, index) => {
            const item = document.createElement('div');
            item.className = 'gallery-item';
            item.innerHTML = `
                <img src="assets/${photo}" alt="Khoảnh khắc đẹp ${index + 1}" 
                     loading="lazy" 
                     onerror="this.src='assets/placeholder.jpg'">
            `;
            this.container.appendChild(item);
        });

        this.initializeLightbox();
    }

    initializeLightbox() {
        const items = this.container.querySelectorAll('.gallery-item');
        items.forEach(item => {
            item.addEventListener('click', () => this.openLightbox(item));
        });
    }
}

// Quản lý Animation
class AnimationManager {
    constructor() {
        this.heartInterval = null;
    }

    startHeartAnimation() {
        if (this.heartInterval) clearInterval(this.heartInterval);

        this.heartInterval = setInterval(() => this.createHeart(), 300);
    }

    createHeart() {
        const heart = document.createElement('div');
        heart.className = 'heart';
        heart.innerHTML = '❤';

        const size = Math.random() * 20 + 10;
        const startPos = Math.random() * 100;

        heart.style.cssText = `
            left: ${startPos}vw;
            font-size: ${size}px;
            animation: floatHeart ${2 + Math.random() * 2}s linear infinite;
        `;

        document.body.appendChild(heart);
        setTimeout(() => heart.remove(), 5000);
    }
}

// Khởi tạo
document.addEventListener('DOMContentLoaded', () => {
    const audioManager = new AudioManager();
    const galleryManager = new GalleryManager(photos, '.photo-gallery');
    const animationManager = new AnimationManager();

    // Khởi tạo các component
    galleryManager.createGallery();
    animationManager.startHeartAnimation();

    // Event Listeners
    toggleMusic.addEventListener('click', () => audioManager.toggleMusic());
});