// Game Config
const initialBalance = 10000000;
let balance = initialBalance;
let currentBet = 0;
let isRolling = false;
const bets = {
    'bầu': 0,
    'cua': 0,
    'tôm': 0,
    'cá': 0,
    'nai': 0,
    'gà': 0
};

// DOM Elements
const balanceEl = document.getElementById('balance');
const totalBetsEl = document.getElementById('total-bets');
const betOptions = document.querySelectorAll('.bet-option');
const betAmounts = document.querySelectorAll('.bet-amount');
const rollDiceBtn = document.getElementById('rollDice');
const notification = document.getElementById('notification');
const resultDisplay = document.getElementById('result-display');

// Audio Elements
const diceSound = document.getElementById('diceSound');
const winSound = document.getElementById('winSound');

// Betting System
betAmounts.forEach(btn => {
    btn.addEventListener('click', () => {
        currentBet = parseInt(btn.dataset.value);
        showNotification(`Đã chọn mệnh giá: ${currentBet.toLocaleString()}đ`, 'success');
    });
});

betOptions.forEach(option => {
    option.addEventListener('click', () => {
        if (currentBet === 0) {
            showNotification('Em bé vui lòng chọn mệnh giá cược trước!', 'warning');
            return;
        }

        const animal = option.dataset.option;
        if (balance < currentBet) {
            showNotification('Không đủ số dư để đặt cược!', 'error');
            return;
        }

        bets[animal] += currentBet;
        balance -= currentBet;
        updateDisplay();
        updateBetDisplay(animal);
    });
});

// Dice Rolling System
rollDiceBtn.addEventListener('click', async () => {
    if (isRolling) return;

    const totalBet = Object.values(bets).reduce((a, b) => a + b, 0);
    if (totalBet === 0) {
        showNotification('Em bé chưa đặt cược -.-', 'warning');
        return;
    }

    isRolling = true;
    diceSound.play();

    // Simulate dice rolling
    await countdown(3);

    // Generate results
    const results = Array.from({ length: 3 }, () =>
        Object.keys(bets)[Math.floor(Math.random() * 6)]
    );

    // Calculate winnings
    const winnings = results.reduce((total, animal) => total + bets[animal], 0);
    balance += winnings;

    // Update UI
    showResults(results);
    showNotification(
        winnings > 0
            ? `🎉 Em bé Thắng: ${winnings.toLocaleString()}đ`
            : '💸 Omg không trúng cái nào lun! Lần sau chắc chắn sẽ Trúng thôi :>',
        winnings > 0 ? 'success' : 'error'
    );

    checkBalance();
    resetBets();
    isRolling = false;
});

// Helper Functions
function countdown(seconds) {
    return new Promise(resolve => {
        let count = seconds;
        const interval = setInterval(() => {
            notification.textContent = `Kết quả sẽ có sau: ${count} giây`;
            count--;
            if (count < 0) {
                clearInterval(interval);
                notification.textContent = '';
                resolve();
            }
        }, 1000);
    });
}

function showResults(results) {
    resultDisplay.innerHTML = `
        <div class="result-section">
            <h4>Kết quả:</h4>
            <p>${results.join(' - ')}</p>
        </div>
    `;
}

function showNotification(message, type = 'info') {
    notification.textContent = message;
    notification.className = `notification show ${type}`;
    setTimeout(() => notification.classList.remove('show'), 3000);
}

function updateDisplay() {
    balanceEl.textContent = balance.toLocaleString();
    totalBetsEl.textContent = Object.values(bets).reduce((a, b) => a + b, 0).toLocaleString();
}

function updateBetDisplay(animal) {
    const betDisplay = document.querySelector(`[data-option="${animal}"] .bet-info`);
    betDisplay.textContent = `Cược: ${bets[animal].toLocaleString()}đ`;
}

function resetBets() {
    Object.keys(bets).forEach(animal => bets[animal] = 0);
    document.querySelectorAll('.bet-info').forEach(el => {
        el.textContent = 'Cược: 0đ';
    });
    updateDisplay();
}

function checkBalance() {
    if (balance <= 0) {
        balance = initialBalance;
        showNotification('🎁 Dĩm Hương đã được tặng thêm 10.000.000đ! Em bé mạnh tay lên .!! 😘', 'success');
        updateDisplay();
    }
}

// Initialize
window.onload = () => {
    updateDisplay();
};

function backHome() {
    window.location.href = "../index.html";
    }