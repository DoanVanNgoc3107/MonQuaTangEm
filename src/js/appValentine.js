// 2. Nhúng YouTube Player
var tag = document.createElement('script');
tag.src = "https://www.youtube.com/iframe_api";
var firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

// 3. Khai báo biến player
var player;

function onYouTubeIframeAPIReady() {
    player = new YT.Player('player', {
        height: '0',
        width: '0',
        videoId: 'YOUR_YOUTUBE_VIDEO_ID', // Thay thế bằng ID video YouTube của bạn
        playerVars: {
            'autoplay': 1, // Tự động phát
            'controls': 0, // Ẩn điều khiển
            'loop': 1,    // Phát lặp lại
            'playlist': 'YOUR_YOUTUBE_VIDEO_ID', // Phát lặp lại cùng video
            'mute': 0      // Tắt tiếng (1: tắt, 0: mở)
        },
        events: {
            'onReady': onPlayerReady,
            'onError': onPlayerError
        }
    });
}


function onPlayerReady(event) {
    // event.target.playVideo();  // Có thể bật tự động phát ở đây nếu cần
}

function onPlayerError(error) {
    console.error("Lỗi YouTube Player:", error);
    // Xử lý lỗi, ví dụ hiển thị thông báo lỗi cho người dùng
}

// Quản lý form và tương tác
class InteractionManager {
    constructor() {
        this.setupWishForm();
        this.setupLoveButton();
    }

    setupWishForm() {
        const sendWishBtn = document.getElementById('sendWish');
        if (sendWishBtn) {
            sendWishBtn.addEventListener('click', () => this.handleWishSubmission());
        }
    }

    handleWishSubmission() {
        const name = document.getElementById('wishName').value.trim();
        const message = document.getElementById('wishMessage').value.trim();

        if (!name || !message) {
            this.showError('Vui lòng điền đầy đủ thông tin');
            return;
        }

        this.addWishToDisplay(name, message);
        this.clearForm();
    }

    addWishToDisplay(name, message) {
        const wishElement = document.createElement('div');
        wishElement.className = 'wish-card glass-effect animate-on-scroll';
        wishElement.innerHTML = `
            <h4>${this.sanitizeInput(name)}</h4>
            <p>${this.sanitizeInput(message)}</p>
            <span class="wish-date">${new Date().toLocaleDateString()}</span>
        `;

        const wishesDisplay = document.getElementById('wishes-display');
        wishesDisplay.insertBefore(wishElement, wishesDisplay.firstChild);
    }

    sanitizeInput(input) {
        return input
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#039;');
    }

    clearForm() {
        document.getElementById('wishName').value = '';
        document.getElementById('wishMessage').value = '';
    }

    setupLoveButton() {
        const loveBtn = document.getElementById('loveButton');
        if (loveBtn) {
            loveBtn.addEventListener('click', () => this.handleLoveButton());
        }
    }

    handleLoveButton() {
        // Thêm hiệu ứng khi click vào nút
        const btn = document.getElementById('loveButton');
        btn.classList.add('clicked');
        setTimeout(() => btn.classList.remove('clicked'), 1000);
    }

    showError(message) {
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message glass-effect';
        errorDiv.textContent = message;
        document.body.appendChild(errorDiv);
        setTimeout(() => errorDiv.remove(), 3000);
    }
}

// Khởi tạo khi trang tải xong
document.addEventListener('DOMContentLoaded', () => {
    const audioManager = new AudioManager();
    const effectsManager = new EffectsManager();
    const interactionManager = new InteractionManager();
});