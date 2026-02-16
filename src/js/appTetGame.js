// Vượt Chướng Ngại Vật Game - Enhanced Version with Power-ups
// Canvas Setup
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const gameOverScreen = document.getElementById('gameOver');
const restartBtn = document.getElementById('restartBtn');
const scoreDisplay = document.getElementById('score');
const finalScoreDisplay = document.getElementById('finalScore');
const highScoreDisplay = document.getElementById('highScore');
const currentHighScoreDisplay = document.getElementById('currentHighScore');
const obstaclesCountDisplay = document.getElementById('obstaclesCount');

// Control Elements
const pauseBtn = document.getElementById('pauseBtn');
const soundToggle = document.getElementById('soundToggle');
const difficultySelect = document.getElementById('difficultySelect');

// Stats Elements
const recordObstaclesEl = document.getElementById('recordObstacles');
const gamesPlayedEl = document.getElementById('gamesPlayed');
const totalScoreEl = document.getElementById('totalScore');

// Audio Elements
const jumpSound = document.getElementById('jumpSound');
const gameOverSound = document.getElementById('gameOverSound');

// Game Variables
let gameSpeed = 2.5;
let gravity = 0.35; // Giảm xuống để rơi chậm hơn, tăng thời gian bay
let score = 0;
let obstaclesPassed = 0;
let coins = 0;
let combo = 0;
let lives = 3;
let maxLives = 3;
let highScore = localStorage.getItem('tetGameHighScore') || 0;
let recordObstacles = localStorage.getItem('tetRecordObstacles') || 0;
let gamesPlayed = localStorage.getItem('tetGamesPlayed') || 0;
let totalScore = localStorage.getItem('tetTotalScore') || 0;
let gameRunning = false;
let gameStarted = false;
let gamePaused = false;
let soundEnabled = true;
let selectedCharacter = 'bunny1'; // bunny1 or bunny2

// Power-up states
let hasShield = false;
let hasDoubleJump = false;
let hasMagnet = false;
let powerUpTimer = 0;
let canDoubleJump = false;

// Difficulty Settings
const difficulties = {
    easy: { 
        speed: 2.5, 
        minGap: 500, 
        maxGap: 800, 
        speedIncrease: 0.08,
        collectibleRate: 0.025, // 2.5% - Nhiều item hơn
        powerUpRate: 0.005,      // 0.5%
        obstacleFrequency: 0.7   // Thưa hơn để làm quen
    },
    normal: { 
        speed: 3.5, 
        minGap: 350, 
        maxGap: 600, 
        speedIncrease: 0.12,
        collectibleRate: 0.015,  // 1.5%
        powerUpRate: 0.003,      // 0.3%
        obstacleFrequency: 1.0   // Bình thường
    },
    hard: { 
        speed: 5, 
        minGap: 250, 
        maxGap: 450, 
        speedIncrease: 0.18,
        collectibleRate: 0.01,   // 1% - Ít item hơn
        powerUpRate: 0.002,      // 0.2%
        obstacleFrequency: 1.3   // Dày đặc hơn
    }
};

let currentDifficulty = 'easy';

// Update stats display
currentHighScoreDisplay.textContent = highScore;
highScoreDisplay.textContent = highScore;
recordObstaclesEl.textContent = recordObstacles;
gamesPlayedEl.textContent = gamesPlayed;
totalScoreEl.textContent = totalScore;

// ==================== LOAD GAME SPRITES ====================
// Spritesheet
const spritesheet = new Image();
spritesheet.src = '../images/games/Spritesheets/spritesheet_jumper.png';

// Player Sprites (Bunny 1)
const playerSprites = {
    bunny1: {
        stand: new Image(),
        jump: new Image(),
        walk1: new Image(),
        walk2: new Image(),
        hurt: new Image()
    },
    bunny2: {
        stand: new Image(),
        jump: new Image(),
        walk1: new Image(),
        walk2: new Image(),
        hurt: new Image()
    }
};

playerSprites.bunny1.stand.src = '../images/games/PNG/Players/bunny1_stand.png';
playerSprites.bunny1.jump.src = '../images/games/PNG/Players/bunny1_jump.png';
playerSprites.bunny1.walk1.src = '../images/games/PNG/Players/bunny1_walk1.png';
playerSprites.bunny1.walk2.src = '../images/games/PNG/Players/bunny1_walk2.png';
playerSprites.bunny1.hurt.src = '../images/games/PNG/Players/bunny1_hurt.png';

playerSprites.bunny2.stand.src = '../images/games/PNG/Players/bunny2_stand.png';
playerSprites.bunny2.jump.src = '../images/games/PNG/Players/bunny2_jump.png';
playerSprites.bunny2.walk1.src = '../images/games/PNG/Players/bunny2_walk1.png';
playerSprites.bunny2.walk2.src = '../images/games/PNG/Players/bunny2_walk2.png';
playerSprites.bunny2.hurt.src = '../images/games/PNG/Players/bunny2_hurt.png';

// Obstacle/Enemy Sprites
const obstacleSprites = {
    spike: new Image(),
    spikeBall: new Image(),
    flyMan: new Image(),
    spikeMan: new Image()
};

obstacleSprites.spike.src = '../images/games/PNG/Environment/spikes_top.png';
obstacleSprites.spikeBall.src = '../images/games/PNG/Enemies/spikeBall1.png';
obstacleSprites.flyMan.src = '../images/games/PNG/Enemies/flyMan_fly.png';
obstacleSprites.spikeMan.src = '../images/games/PNG/Enemies/spikeMan_stand.png';

// Collectible Sprites (Coins/Items)
const collectibleSprites = {
    gold: new Image(),
    silver: new Image(),
    bronze: new Image(),
    carrot: new Image()
};

collectibleSprites.gold.src = '../images/games/PNG/Items/gold_1.png';
collectibleSprites.silver.src = '../images/games/PNG/Items/silver_1.png';
collectibleSprites.bronze.src = '../images/games/PNG/Items/bronze_1.png';
collectibleSprites.carrot.src = '../images/games/PNG/Items/carrot.png';

// Power-up Sprites
const powerUpSprites = {
    shield: new Image(),
    doubleJump: new Image(),
    magnet: new Image(),
    jetpack: new Image()
};

powerUpSprites.shield.src = '../images/games/PNG/Items/powerup_bubble.png';
powerUpSprites.doubleJump.src = '../images/games/PNG/Items/powerup_wings.png';
powerUpSprites.magnet.src = '../images/games/PNG/Items/jetpack_item.png';
powerUpSprites.jetpack.src = '../images/games/PNG/Items/powerup_jetpack.png';

// Background Sprites
const backgroundLayers = {
    layer1: new Image(),
    layer2: new Image(),
    layer3: new Image(),
    layer4: new Image()
};

backgroundLayers.layer1.src = '../images/games/PNG/Background/bg_layer1.png';
backgroundLayers.layer2.src = '../images/games/PNG/Background/bg_layer2.png';
backgroundLayers.layer3.src = '../images/games/PNG/Background/bg_layer3.png';
backgroundLayers.layer4.src = '../images/games/PNG/Background/bg_layer4.png';

// Environment Sprites
const environmentSprites = {
    cactus: new Image(),
    mushroom: new Image(),
    grass: new Image()
};

environmentSprites.cactus.src = '../images/games/PNG/Environment/cactus.png';
environmentSprites.mushroom.src = '../images/games/PNG/Environment/mushroom_red.png';
environmentSprites.grass.src = '../images/games/PNG/Environment/grass1.png';

// Ground Tiles Sprites
const groundTiles = {
    grass: new Image(),
    grassBroken: new Image(),
    sand: new Image(),
    sandBroken: new Image(),
    snow: new Image(),
    stone: new Image(),
    wood: new Image(),
    cake: new Image()
};

groundTiles.grass.src = '../images/games/PNG/Environment/ground_grass.png';
groundTiles.grassBroken.src = '../images/games/PNG/Environment/ground_grass_broken.png';
groundTiles.sand.src = '../images/games/PNG/Environment/ground_sand.png';
groundTiles.sandBroken.src = '../images/games/PNG/Environment/ground_sand_broken.png';
groundTiles.snow.src = '../images/games/PNG/Environment/ground_snow.png';
groundTiles.stone.src = '../images/games/PNG/Environment/ground_stone.png';
groundTiles.wood.src = '../images/games/PNG/Environment/ground_wood.png';
groundTiles.cake.src = '../images/games/PNG/Environment/ground_cake.png';

// Select random ground tile type
let currentGroundTile = groundTiles.grass;

// ==================== GAME OBJECTS ====================
// Player Object
const player = {
    x: 50,
    y: 0,
    width: 60, // Tăng từ 50 để phù hợp với canvas lớn hơn
    height: 60,
    dy: 0,
    jumpPower: -14, // Giảm xuống để nhảy vừa phải không quá cao
    grounded: false,
    currentSprite: playerSprites.bunny1.stand,
    animationFrame: 0,
    animationSpeed: 10,
    animationCounter: 0,
    state: 'stand' // stand, jump, walk, hurt
};

// Ground level
const groundHeight = 330; // T\u0103ng t\u1eeb 250 \u0111\u1ec3 ph\u00f9 h\u1ee3p v\u1edbi canvas 400px
player.y = groundHeight - player.height;

// Obstacle Array
let obstacles = [];

// Background parallax positions
let bgLayer1X = 0;
let bgLayer2X = 0;
let bgLayer3X = 0;
let bgLayer4X = 0;

// Collectibles and Power-ups
let collectibles = [];
let powerUps = [];
let particles = [];
let fallingDecorations = [];
let fireworks = [];
let tetDecorations = [];
let scoreMultiplier = 1;
let lastMilestone = 0;

// Cloud Array
let clouds = [];

// Initialize Clouds
function initClouds() {
    clouds = [];
    for (let i = 0; i < 3; i++) {
        clouds.push({
            x: Math.random() * canvas.width,
            y: Math.random() * 100 + 20,
            width: 60 + Math.random() * 40,
            speed: 0.5 + Math.random() * 0.5
        });
    }
}

// Draw Cloud
function drawCloud(cloud) {
    ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
    ctx.beginPath();
    ctx.arc(cloud.x, cloud.y, 15, 0, Math.PI * 2);
    ctx.arc(cloud.x + 20, cloud.y, 20, 0, Math.PI * 2);
    ctx.arc(cloud.x + 40, cloud.y, 15, 0, Math.PI * 2);
    ctx.fill();
}

// Update Clouds
function updateClouds() {
    if (gamePaused) return;
    clouds.forEach(cloud => {
        cloud.x -= cloud.speed;
        if (cloud.x + 60 < 0) {
            cloud.x = canvas.width;
            cloud.y = Math.random() * 100 + 20;
        }
    });
}

// Update Background Parallax
function updateBackground() {
    if (gamePaused) return;
    
    // Update parallax layers at different speeds
    bgLayer1X -= gameSpeed * 0.2; // Slowest (far background)
    bgLayer2X -= gameSpeed * 0.4; // Medium speed
    bgLayer3X -= gameSpeed * 0.6; // Faster
    bgLayer4X -= gameSpeed * 0.8; // Fastest (near background)
    
    // Reset positions for infinite scrolling
    if (bgLayer1X <= -canvas.width) bgLayer1X = 0;
    if (bgLayer2X <= -canvas.width) bgLayer2X = 0;
    if (bgLayer3X <= -canvas.width) bgLayer3X = 0;
    if (bgLayer4X <= -canvas.width) bgLayer4X = 0;
}

// Update Player Animation
function updatePlayerAnimation() {
    if (gamePaused) return;
    
    // Get the current character sprites
    const charSprites = playerSprites[selectedCharacter];
    
    // Update animation based on state
    if (player.state === 'hurt') {
        player.currentSprite = charSprites.hurt;
    } else if (!player.grounded) {
        player.currentSprite = charSprites.jump;
    } else if (gameRunning) {
        // Walking animation
        player.animationCounter++;
        if (player.animationCounter >= player.animationSpeed) {
            player.animationCounter = 0;
            player.animationFrame = (player.animationFrame + 1) % 2;
            player.currentSprite = player.animationFrame === 0 ? charSprites.walk1 : charSprites.walk2;
        }
    } else {
        player.currentSprite = charSprites.stand;
    }
}

// Draw Player
function drawPlayer() {
    // Draw player with current sprite
    if (player.currentSprite && player.currentSprite.complete) {
        ctx.drawImage(player.currentSprite, player.x, player.y, player.width, player.height);
    } else {
        // Fallback to simple rectangle
        ctx.fillStyle = '#ff69b4';
        ctx.fillRect(player.x, player.y, player.width, player.height);
        ctx.fillStyle = 'white';
        ctx.fillRect(player.x + 10, player.y + 15, 8, 8);
        ctx.fillRect(player.x + 32, player.y + 15, 8, 8);
    }
    
    // Draw shield effect if active
    if (hasShield) {
        ctx.strokeStyle = 'rgba(59, 130, 246, 0.6)';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.arc(player.x + player.width/2, player.y + player.height/2, player.width/2 + 5, 0, Math.PI * 2);
        ctx.stroke();
    }
}

// Draw Obstacle
function drawObstacle(obs) {
    // Use the sprite assigned to this obstacle
    if (obs.sprite && obs.sprite.complete) {
        ctx.drawImage(obs.sprite, obs.x, obs.y, obs.width, obs.height);
    } else {
        // Fallback to simple rectangle
        ctx.fillStyle = '#dc2626';
        ctx.fillRect(obs.x, obs.y, obs.width, obs.height);
        // Draw spikes pattern
        ctx.fillStyle = '#991b1b';
        for(let i = 0; i < obs.width; i += 10) {
            ctx.beginPath();
            ctx.moveTo(obs.x + i, obs.y + obs.height);
            ctx.lineTo(obs.x + i + 5, obs.y);
            ctx.lineTo(obs.x + i + 10, obs.y + obs.height);
            ctx.fill();
        }
    }
}

// Draw Ground with Tiles
function drawGround() {
    const tileWidth = 70;
    const tileHeight = 35; // Chỉ vẽ nửa chiều cao
    const numTiles = Math.ceil(canvas.width / tileWidth) + 1;
    
    // Draw ground tiles - chỉ lấy nửa trên của mỗi tile
    if (currentGroundTile && currentGroundTile.complete) {
        for (let i = 0; i < numTiles; i++) {
            // drawImage với 9 tham số: (image, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight)
            // Chỉ lấy nửa trên của sprite (sy=0, sHeight=nửa chiều cao gốc)
            ctx.drawImage(
                currentGroundTile,
                0, 0,  // Bắt đầu từ góc trên bên trái của sprite
                70, 35,  // Chỉ lấy nửa trên của sprite 70x70
                i * tileWidth,  // Vị trí x trên canvas
                groundHeight,   // Vị trí y trên canvas
                tileWidth,
                tileHeight
            );
        }
    } else {
        // Fallback to simple ground
        ctx.fillStyle = '#d4a574';
        ctx.fillRect(0, groundHeight, canvas.width, tileHeight);
    }
    
    // Draw grass on top of ground for decoration
    if (environmentSprites.grass.complete) {
        for (let i = 0; i < 10; i++) {
            const x = (i * canvas.width / 10) + (Math.sin(Date.now() * 0.001 + i) * 5);
            ctx.drawImage(environmentSprites.grass, x, groundHeight - 10, 20, 15);
        }
    }
}

// Draw Background with Parallax
function drawBackground() {
    // Sky gradient
    const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
    gradient.addColorStop(0, '#87ceeb');
    gradient.addColorStop(1, '#e0f6ff');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Draw parallax background layers if loaded
    const layerHeight = 200;
    const layerY = groundHeight - layerHeight;
    
    if (backgroundLayers.layer1.complete) {
        // Far background - slowest
        const layer1Width = canvas.width;
        ctx.drawImage(backgroundLayers.layer1, bgLayer1X, layerY, layer1Width, layerHeight);
        ctx.drawImage(backgroundLayers.layer1, bgLayer1X + layer1Width, layerY, layer1Width, layerHeight);
    }
    
    if (backgroundLayers.layer2.complete) {
        // Mid background
        const layer2Width = canvas.width;
        ctx.drawImage(backgroundLayers.layer2, bgLayer2X, layerY, layer2Width, layerHeight);
        ctx.drawImage(backgroundLayers.layer2, bgLayer2X + layer2Width, layerY, layer2Width, layerHeight);
    }
    
    // Draw decorative clouds
    clouds.forEach(cloud => drawCloud(cloud));
}

// Update Player
function updatePlayer() {
    if (gamePaused) return;
    
    if (!player.grounded) {
        player.dy += gravity;
    }
    
    player.y += player.dy;
    
    if (player.y + player.height >= groundHeight) {
        player.y = groundHeight - player.height;
        player.dy = 0;
        player.grounded = true;
    }
}

// Jump (replaced by enhancedJump)
function jump() {
    enhancedJump();
}

// Create Obstacle
function createObstacle() {
    const diff = difficulties[currentDifficulty];
    const minGap = diff.minGap;
    const maxGap = diff.maxGap;
    const frequency = diff.obstacleFrequency;
    
    // Áp dụng frequency để điều chỉnh tần suất xuất hiện
    if (obstacles.length === 0 || obstacles[obstacles.length - 1].x < canvas.width - (minGap * frequency) - Math.random() * (maxGap * frequency)) {
        const height = 35 + Math.random() * 40; // Tăng từ 25-55 lên 35-75 để phù hợp canvas lớn hơn
        
        // Random obstacle sprite selection
        const spriteTypes = ['spike', 'spikeBall', 'flyMan', 'spikeMan'];
        const randomType = spriteTypes[Math.floor(Math.random() * spriteTypes.length)];
        
        obstacles.push({
            x: canvas.width,
            y: groundHeight - height,
            width: 40, // Tăng từ 30 lên 40
            height: height,
            counted: false,
            sprite: obstacleSprites[randomType]
        });
    }
}

// Update Obstacles
function updateObstacles() {
    if (gamePaused) return;
    
    obstacles.forEach(obs => {
        obs.x -= gameSpeed;
        
        // Count passed obstacles
        if (!obs.counted && obs.x + obs.width < player.x) {
            obs.counted = true;
            obstaclesPassed++;
            obstaclesCountDisplay.textContent = obstaclesPassed;
            
            // Tăng điểm khi vượt qua chướng ngại vật
            score += 100;
            scoreDisplay.textContent = Math.floor(score / 10);
            
            // Tạo particle hiệu ứng khi vượt qua
            createParticle(obs.x + obs.width / 2, obs.y, '#10b981');
        }
    });
    
    obstacles = obstacles.filter(obs => obs.x + obs.width > 0);
    createObstacle();
}

// Create Collectible (Using game sprites)
function createCollectible() {
    const diff = difficulties[currentDifficulty];
    const spawnRate = diff.collectibleRate;
    
    if (Math.random() < spawnRate) { // Spawn rate theo độ khó
        const types = [
            { type: 'gold', value: 100, size: 38, weight: 1, sprite: collectibleSprites.gold },
            { type: 'silver', value: 50, size: 35, weight: 2, sprite: collectibleSprites.silver },
            { type: 'bronze', value: 30, size: 32, weight: 3, sprite: collectibleSprites.bronze },
            { type: 'carrot', value: 20, size: 30, weight: 4, sprite: collectibleSprites.carrot }
        ];
        
        // Weighted random selection
        const totalWeight = types.reduce((sum, t) => sum + t.weight, 0);
        let random = Math.random() * totalWeight;
        let selectedType = types[0];
        
        for (let t of types) {
            random -= t.weight;
            if (random <= 0) {
                selectedType = t;
                break;
            }
        }
        
        const y = groundHeight - 80 - Math.random() * 100;
        collectibles.push({
            x: canvas.width,
            y: y,
            width: selectedType.size,
            height: selectedType.size,
            type: selectedType.type,
            value: selectedType.value,
            collected: false,
            rotation: 0,
            sprite: selectedType.sprite
        });
    }
}

// Create Power-Up
function createPowerUp() {
    const diff = difficulties[currentDifficulty];
    const spawnRate = diff.powerUpRate;
    
    if (Math.random() < spawnRate) { // Spawn rate theo độ khó
        const types = [
            { type: 'shield', sprite: powerUpSprites.shield },
            { type: 'doubleJump', sprite: powerUpSprites.doubleJump },
            { type: 'magnet', sprite: powerUpSprites.magnet }
        ];
        const selectedType = types[Math.floor(Math.random() * types.length)];
        const y = groundHeight - 100 - Math.random() * 130; // Điều chỉnh vị trí cho canvas cao hơn
        powerUps.push({
            x: canvas.width,
            y: y,
            width: 40, // Tăng từ 30 lên 40
            height: 40,
            type: selectedType.type,
            sprite: selectedType.sprite
        });
    }
}

// Update Collectibles
function updateCollectibles() {
    if (gamePaused) return;
    
    collectibles.forEach(item => {
        item.x -= gameSpeed;
        
        // Magnet effect
        if (hasMagnet && !item.collected) {
            const dx = player.x - item.x;
            const dy = player.y - item.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < 100) {
                item.x += dx * 0.1;
                item.y += dy * 0.1;
            }
        }
    });
    
    collectibles = collectibles.filter(item => item.x + item.width > 0 && !item.collected);
    createCollectible();
}

// Update Power-Ups
function updatePowerUps() {
    if (gamePaused) return;
    
    powerUps.forEach(item => {
        item.x -= gameSpeed;
    });
    
    powerUps = powerUps.filter(item => item.x + item.width > 0);
    createPowerUp();
}

// Create Falling Decoration (Background particles)
function createFallingDecoration() {
    if (Math.random() < 0.05) { // 5% chance each frame
        const types = ['petal', 'confetti', 'star'];
        const type = types[Math.floor(Math.random() * types.length)];
        fallingDecorations.push({
            x: Math.random() * canvas.width,
            y: -20,
            vx: (Math.random() - 0.5) * 1,
            vy: 1 + Math.random() * 2,
            size: 3 + Math.random() * 5,
            type: type,
            rotation: Math.random() * Math.PI * 2,
            rotationSpeed: (Math.random() - 0.5) * 0.1,
            opacity: 0.6 + Math.random() * 0.4
        });
    }
}

// Update Falling Decorations
function updateFallingDecorations() {
    if (gamePaused) return;
    
    fallingDecorations.forEach(dec => {
        dec.x += dec.vx;
        dec.y += dec.vy;
        dec.rotation += dec.rotationSpeed;
    });
    
    fallingDecorations = fallingDecorations.filter(dec => dec.y < canvas.height + 20);
    createFallingDecoration();
}

// Create Firework
function createFirework(x, y) {
    const colors = ['#ff0000', '#ffd700', '#ff6b6b', '#ffa500', '#ff1493'];
    const particleCount = 20 + Math.floor(Math.random() * 20);
    
    for (let i = 0; i < particleCount; i++) {
        const angle = (Math.PI * 2 * i) / particleCount;
        const velocity = 2 + Math.random() * 3;
        fireworks.push({
            x: x,
            y: y,
            vx: Math.cos(angle) * velocity,
            vy: Math.sin(angle) * velocity,
            size: 2 + Math.random() * 3,
            color: colors[Math.floor(Math.random() * colors.length)],
            life: 60,
            maxLife: 60
        });
    }
}

// Update Fireworks
function updateFireworks() {
    if (gamePaused) return;
    
    fireworks.forEach(fw => {
        fw.x += fw.vx;
        fw.y += fw.vy;
        fw.vy += 0.1; // Gravity
        fw.life--;
        fw.size *= 0.98;
    });
    
    fireworks = fireworks.filter(fw => fw.life > 0);
}

// Create Tet Decoration (Flying messages) - DISABLED
function createTetDecoration() {
    // Disabled to remove flying text
    return;
}

// Update Tet Decorations - DISABLED
function updateTetDecorations() {
    // Disabled to remove flying text
    return;
}

// Check Milestone and Trigger Fireworks
function checkMilestone() {
    const currentScore = Math.floor(score / 10);
    if (currentScore > 0 && currentScore % 50 === 0 && currentScore !== lastMilestone) {
        lastMilestone = currentScore;
        // Create fireworks at random positions
        for (let i = 0; i < 3; i++) {
            setTimeout(() => {
                createFirework(
                    100 + Math.random() * (canvas.width - 200),
                    50 + Math.random() * 100
                );
            }, i * 200);
        }
    }
}

// Create Particle
function createParticle(x, y, color) {
    for (let i = 0; i < 10; i++) {
        particles.push({
            x: x,
            y: y,
            vx: (Math.random() - 0.5) * 4,
            vy: (Math.random() - 0.5) * 4,
            size: Math.random() * 4 + 2,
            color: color,
            life: 30
        });
    }
}

// Update Particles
function updateParticles() {
    if (gamePaused) return;
    
    particles.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;
        p.life--;
        p.size *= 0.95;
    });
    
    particles = particles.filter(p => p.life > 0);
}

// Draw Collectibles
function drawCollectibles() {
    collectibles.forEach(item => {
        ctx.save();
        ctx.translate(item.x + item.width / 2, item.y + item.height / 2);
        
        // Rotate for visual effect
        item.rotation += 0.05;
        ctx.rotate(item.rotation);
        
        // Draw using sprite if available
        if (item.sprite && item.sprite.complete) {
            ctx.drawImage(item.sprite, -item.width / 2, -item.height / 2, item.width, item.height);
        } else {
            // Fallback drawing based on type
            if (item.type === 'gold') {
                ctx.fillStyle = '#ffd700';
                ctx.beginPath();
                ctx.arc(0, 0, item.width / 2, 0, Math.PI * 2);
                ctx.fill();
                ctx.strokeStyle = '#b8860b';
                ctx.lineWidth = 2;
                ctx.stroke();
            } else if (item.type === 'silver') {
                ctx.fillStyle = '#c0c0c0';
                ctx.beginPath();
                ctx.arc(0, 0, item.width / 2, 0, Math.PI * 2);
                ctx.fill();
                ctx.strokeStyle = '#808080';
                ctx.lineWidth = 2;
                ctx.stroke();
            } else if (item.type === 'bronze') {
                ctx.fillStyle = '#cd7f32';
                ctx.beginPath();
                ctx.arc(0, 0, item.width / 2, 0, Math.PI * 2);
                ctx.fill();
                ctx.strokeStyle = '#8b4513';
                ctx.lineWidth = 2;
                ctx.stroke();
            } else if (item.type === 'carrot') {
                // Draw simple carrot
                ctx.fillStyle = '#ff6b35';
                ctx.beginPath();
                ctx.moveTo(0, -item.height / 3);
                for (let i = 0; i < 3; i++) {
                    ctx.lineTo(-item.width / 4, -item.height / 2);
                    ctx.lineTo(item.width / 4, -item.height / 2);
                }
                ctx.lineTo(0, item.height / 2);
                ctx.fill();
            }
        }
        
        ctx.restore();
    });
}

// Draw Power-Ups
function drawPowerUps() {
    powerUps.forEach(item => {
        // Draw using sprite if available
        if (item.sprite && item.sprite.complete) {
            ctx.drawImage(item.sprite, item.x, item.y, item.width, item.height);
        } else {
            // Fallback drawing
            if (item.type === 'shield') {
                ctx.fillStyle = '#3b82f6';
                ctx.beginPath();
                ctx.moveTo(item.x + item.width / 2, item.y);
                ctx.lineTo(item.x + item.width, item.y + item.height / 3);
                ctx.lineTo(item.x + item.width, item.y + item.height * 2 / 3);
                ctx.lineTo(item.x + item.width / 2, item.y + item.height);
                ctx.lineTo(item.x, item.y + item.height * 2 / 3);
                ctx.lineTo(item.x, item.y + item.height / 3);
                ctx.closePath();
                ctx.fill();
            } else if (item.type === 'doubleJump') {
                ctx.fillStyle = '#10b981';
                ctx.beginPath();
                ctx.arc(item.x + item.width / 2, item.y + item.height / 2, item.width / 2, 0, Math.PI * 2);
                ctx.fill();
                ctx.fillStyle = 'white';
                ctx.font = 'bold 16px Arial';
                ctx.textAlign = 'center';
                ctx.fillText('2x', item.x + item.width / 2, item.y + item.height / 2 + 6);
            } else if (item.type === 'magnet') {
                ctx.fillStyle = '#ef4444';
                ctx.beginPath();
                ctx.arc(item.x + 8, item.y + 15, 8, 0, Math.PI, true);
                ctx.arc(item.x + 22, item.y + 15, 8, 0, Math.PI, true);
                ctx.rect(item.x + 8, item.y + 15, 14, 10);
                ctx.fill();
            }
        }
    });
}

// Draw Particles
function drawParticles() {
    particles.forEach(p => {
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.life / 30;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
    });
    ctx.globalAlpha = 1;
}

// Draw Falling Decorations
function drawFallingDecorations() {
    fallingDecorations.forEach(dec => {
        ctx.save();
        ctx.translate(dec.x, dec.y);
        ctx.rotate(dec.rotation);
        ctx.globalAlpha = dec.opacity;
        
        if (dec.type === 'petal') {
            // Draw petal
            ctx.fillStyle = '#f472b6';
            ctx.beginPath();
            ctx.ellipse(0, 0, dec.size, dec.size * 1.5, 0, 0, Math.PI * 2);
            ctx.fill();
        } else if (dec.type === 'confetti') {
            // Draw confetti
            const colors = ['#ff0000', '#ffd700', '#ff6b6b'];
            ctx.fillStyle = colors[Math.floor(dec.rotation * colors.length / (Math.PI * 2)) % colors.length];
            ctx.fillRect(-dec.size / 2, -dec.size / 2, dec.size, dec.size);
        } else if (dec.type === 'star') {
            // Draw star
            ctx.fillStyle = '#fbbf24';
            ctx.beginPath();
            for (let i = 0; i < 5; i++) {
                const angle = (Math.PI * 2 * i) / 5 - Math.PI / 2;
                const x = Math.cos(angle) * dec.size;
                const y = Math.sin(angle) * dec.size;
                if (i === 0) ctx.moveTo(x, y);
                else ctx.lineTo(x, y);
            }
            ctx.closePath();
            ctx.fill();
        }
        
        ctx.restore();
    });
    ctx.globalAlpha = 1;
}

// Draw Fireworks
function drawFireworks() {
    fireworks.forEach(fw => {
        ctx.fillStyle = fw.color;
        ctx.globalAlpha = fw.life / fw.maxLife;
        ctx.beginPath();
        ctx.arc(fw.x, fw.y, fw.size, 0, Math.PI * 2);
        ctx.fill();
    });
    ctx.globalAlpha = 1;
}

// Draw Tet Decorations
function drawTetDecorations() {
    tetDecorations.forEach(dec => {
        ctx.save();
        ctx.translate(dec.x, dec.y + Math.sin(dec.wobble) * 5);
        ctx.scale(dec.scale, dec.scale);
        ctx.globalAlpha = dec.opacity;
        
        // Draw golden text with shadow
        ctx.shadowColor = 'rgba(0, 0, 0, 0.3)';
        ctx.shadowBlur = 5;
        ctx.shadowOffsetX = 2;
        ctx.shadowOffsetY = 2;
        
        ctx.fillStyle = '#fbbf24';
        ctx.font = 'bold 24px Manrope, Arial, sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(dec.text, 0, 0);
        
        // Outline
        ctx.strokeStyle = '#dc2626';
        ctx.lineWidth = 2;
        ctx.strokeText(dec.text, 0, 0);
        
        ctx.restore();
    });
    ctx.globalAlpha = 1;
    ctx.shadowColor = 'transparent';
}

// Draw UI Elements
function drawUI() {
    // Draw lives
    ctx.fillStyle = '#e11d48';
    ctx.font = 'bold 20px Arial';
    ctx.textAlign = 'left';
    for (let i = 0; i < lives; i++) {
        ctx.fillText('❤️', 10 + i * 30, 35);
    }
    
    // Draw coins
    ctx.fillStyle = '#ffd700';
    ctx.font = 'bold 20px Arial';
    ctx.textAlign = 'left';
    ctx.fillText('🪙 ' + coins, 10, 65);
    
    // Draw combo
    if (combo > 1) {
        ctx.fillStyle = '#f97316';
        ctx.font = 'bold 24px Arial';
        ctx.fillText('Combo x' + combo, 10, 95);
    }
    
    // Draw active power-ups
    let powerUpY = canvas.height - 40;
    if (hasShield) {
        ctx.fillStyle = '#3b82f6';
        ctx.font = 'bold 16px Arial';
        ctx.textAlign = 'left';
        ctx.fillText('🛡️ Shield: ' + Math.ceil(powerUpTimer / 60) + 's', 10, powerUpY);
        powerUpY -= 25;
    }
    if (hasDoubleJump) {
        ctx.fillStyle = '#10b981';
        ctx.fillText('⬆️ Double Jump: ' + Math.ceil(powerUpTimer / 60) + 's', 10, powerUpY);
        powerUpY -= 25;
    }
    if (hasMagnet) {
        ctx.fillStyle = '#ef4444';
        ctx.fillText('🧲 Magnet: ' + Math.ceil(powerUpTimer / 60) + 's', 10, powerUpY);
    }
    
    // Draw shield effect around player
    if (hasShield) {
        ctx.strokeStyle = '#3b82f6';
        ctx.lineWidth = 3;
        ctx.globalAlpha = 0.6 + Math.sin(Date.now() / 100) * 0.4;
        ctx.beginPath();
        ctx.arc(player.x + player.width / 2, player.y + player.height / 2, player.width / 2 + 10, 0, Math.PI * 2);
        ctx.stroke();
        ctx.globalAlpha = 1;
    }
}

// Check Collectible Collision
function checkCollectibleCollision() {
    // Add negative margin to make collectibles easier to pick up
    const pickupMargin = -5;
    
    collectibles.forEach(item => {
        if (!item.collected &&
            player.x + pickupMargin < item.x + item.width &&
            player.x + player.width - pickupMargin > item.x &&
            player.y + pickupMargin < item.y + item.height &&
            player.y + player.height - pickupMargin > item.y
        ) {
            item.collected = true;
            coins++;
            combo++;
            score += item.value * combo; // Bonus points with combo based on item value
            
            // Different colors for different items
            let particleColor = '#ffd700';
            if (item.type === 'lixi') particleColor = '#dc2626';
            else if (item.type === 'banhchung') particleColor = '#4ade80';
            else if (item.type === 'flower') particleColor = '#f472b6';
            
            createParticle(item.x + item.width / 2, item.y + item.height / 2, particleColor);
            
            if (soundEnabled && jumpSound) {
                jumpSound.currentTime = 0;
                jumpSound.play().catch(() => {});
            }
        }
    });
}

// Check Power-Up Collision
function checkPowerUpCollision() {
    // Add negative margin to make power-ups easier to pick up
    const pickupMargin = -5;
    
    powerUps = powerUps.filter(item => {
        if (player.x + pickupMargin < item.x + item.width &&
            player.x + player.width - pickupMargin > item.x &&
            player.y + pickupMargin < item.y + item.height &&
            player.y + player.height - pickupMargin > item.y
        ) {
            activatePowerUp(item.type);
            createParticle(item.x + item.width / 2, item.y + item.height / 2, '#3b82f6');
            return false;
        }
        return true;
    });
}

// Activate Power-Up
function activatePowerUp(type) {
    if (type === 'shield') {
        hasShield = true;
        powerUpTimer = 300; // 5 seconds at 60fps
    } else if (type === 'doubleJump') {
        hasDoubleJump = true;
        canDoubleJump = false;
        powerUpTimer = 300;
    } else if (type === 'magnet') {
        hasMagnet = true;
        powerUpTimer = 300;
    }
}

// Update Power-Up Timer
function updatePowerUpTimer() {
    if (gamePaused) return;
    
    if (powerUpTimer > 0) {
        powerUpTimer--;
        
        if (powerUpTimer <= 0) {
            hasShield = false;
            hasDoubleJump = false;
            hasMagnet = false;
            canDoubleJump = false;
        }
    }
}

// Enhanced Jump with Double Jump
function enhancedJump() {
    if (player.grounded && gameRunning && !gamePaused) {
        player.dy = player.jumpPower;
        player.grounded = false;
        canDoubleJump = hasDoubleJump;
        
        if (soundEnabled && jumpSound) {
            jumpSound.currentTime = 0;
            jumpSound.play().catch(() => {});
        }
    } else if (canDoubleJump && !player.grounded && gameRunning && !gamePaused) {
        player.dy = player.jumpPower * 0.85;
        canDoubleJump = false;
        
        createParticle(player.x + player.width / 2, player.y + player.height, '#10b981');
        
        if (soundEnabled && jumpSound) {
            jumpSound.currentTime = 0;
            jumpSound.play().catch(() => {});
        }
    }
}

// Reset Combo
function resetCombo() {
    if (combo > 0) {
        combo = 0;
    }
}

// Check Collision
function checkCollision() {
    // Add collision margin to make detection more accurate
    const collisionMargin = 8;
    
    for (let obs of obstacles) {
        if (
            player.x + collisionMargin < obs.x + obs.width &&
            player.x + player.width - collisionMargin > obs.x &&
            player.y + collisionMargin < obs.y + obs.height &&
            player.y + player.height - collisionMargin > obs.y
        ) {
            if (hasShield) {
                // Shield protects player
                hasShield = false;
                powerUpTimer = 0;
                createParticle(player.x + player.width / 2, player.y + player.height / 2, '#3b82f6');
                
                // Remove the obstacle
                obstacles = obstacles.filter(o => o !== obs);
                return false;
            } else {
                // Lose a life
                lives--;
                resetCombo();
                createParticle(player.x + player.width / 2, player.y + player.height / 2, '#e11d48');
                
                // Remove the obstacle so player doesn't lose multiple lives
                obstacles = obstacles.filter(o => o !== obs);
                
                if (lives <= 0) {
                    return true; // Game over
                }
                return false;
            }
        }
    }
    return false;
}

// Update Score
function updateScore() {
    if (gameRunning && !gamePaused) {
        score++;
        scoreDisplay.textContent = Math.floor(score / 10);
        
        // Increase difficulty
        const diff = difficulties[currentDifficulty];
        if (score % 500 === 0) {
            gameSpeed += diff.speedIncrease;
        }
    }
}

// Draw Score on Canvas
function drawScore() {
    ctx.fillStyle = 'rgba(31, 31, 31, 0.7)';
    ctx.font = 'bold 24px Manrope, sans-serif';
    ctx.textAlign = 'right';
    ctx.fillText('Điểm: ' + Math.floor(score / 10), canvas.width - 20, 40);
}

// Draw Pause Overlay
function drawPauseOverlay() {
    ctx.fillStyle = 'rgba(31, 31, 31, 0.7)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    ctx.fillStyle = 'white';
    ctx.font = 'bold 48px Playfair Display, serif';
    ctx.textAlign = 'center';
    ctx.fillText('TẠM DỪNG', canvas.width / 2, canvas.height / 2);
    
    ctx.font = '20px Manrope, sans-serif';
    ctx.fillText('Nhấn P hoặc nút Tạm dừng để tiếp tục', canvas.width / 2, canvas.height / 2 + 40);
}

// Game Over
function gameOver() {
    gameRunning = false;
    
    if (soundEnabled && gameOverSound) {
        gameOverSound.currentTime = 0;
        gameOverSound.play().catch(() => {});
    }
    
    const finalScore = Math.floor(score / 10);
    finalScoreDisplay.textContent = finalScore;
    
    // Update stats
    gamesPlayed++;
    totalScore = parseInt(totalScore) + finalScore;
    
    localStorage.setItem('tetGamesPlayed', gamesPlayed);
    localStorage.setItem('tetTotalScore', totalScore);
    
    gamesPlayedEl.textContent = gamesPlayed;
    totalScoreEl.textContent = totalScore;
    
    if (finalScore > highScore) {
        highScore = finalScore;
        localStorage.setItem('tetGameHighScore', highScore);
        highScoreDisplay.textContent = highScore;
        currentHighScoreDisplay.textContent = highScore;
    }
    
    if (obstaclesPassed > recordObstacles) {
        recordObstacles = obstaclesPassed;
        localStorage.setItem('tetRecordObstacles', recordObstacles);
        recordObstaclesEl.textContent = recordObstacles;
    }
    
    gameOverScreen.classList.add('show');
}

// Reset Game
function resetGame() {
    const diff = difficulties[currentDifficulty];
    gameSpeed = diff.speed;
    score = 0;
    obstaclesPassed = 0;
    obstacles = [];
    collectibles = [];
    powerUps = [];
    particles = [];
    fallingDecorations = [];
    fireworks = [];
    tetDecorations = [];
    coins = 0;
    combo = 0;
    lives = maxLives;
    hasShield = false;
    hasDoubleJump = false;
    hasMagnet = false;
    powerUpTimer = 0;
    canDoubleJump = false;
    lastMilestone = 0;
    player.x = 50;
    player.y = groundHeight - player.height;
    player.dy = 0;
    player.grounded = true;
    gameRunning = true;
    gameStarted = true;
    gamePaused = false;
    gameOverScreen.classList.remove('show');
    scoreDisplay.textContent = '0';
    obstaclesCountDisplay.textContent = '0';
    pauseBtn.innerHTML = '<i class="fas fa-pause"></i> Tạm dừng';
    pauseBtn.classList.remove('active');
    initClouds();
    
    // Random ground tile for variety
    const tileTypes = [groundTiles.grass, groundTiles.sand, groundTiles.snow, groundTiles.stone, groundTiles.wood, groundTiles.cake];
    currentGroundTile = tileTypes[Math.floor(Math.random() * tileTypes.length)];
}

// Toggle Pause
function togglePause() {
    if (!gameStarted || !gameRunning) return;
    
    gamePaused = !gamePaused;
    
    if (gamePaused) {
        pauseBtn.innerHTML = '<i class="fas fa-play"></i> Tiếp tục';
        pauseBtn.classList.add('active');
    } else {
        pauseBtn.innerHTML = '<i class="fas fa-pause"></i> Tạm dừng';
        pauseBtn.classList.remove('active');
    }
}

// Toggle Sound
function toggleSound() {
    soundEnabled = !soundEnabled;
    
    if (soundEnabled) {
        soundToggle.innerHTML = '<i class="fas fa-volume-up"></i> Âm thanh';
        soundToggle.classList.remove('muted');
    } else {
        soundToggle.innerHTML = '<i class="fas fa-volume-mute"></i> Âm thanh';
        soundToggle.classList.add('muted');
    }
}

// Change Difficulty
function changeDifficulty() {
    if (gameStarted && gameRunning) {
        alert('Không thể thay đổi độ khó khi đang chơi!');
        difficultySelect.value = currentDifficulty;
        return;
    }
    
    currentDifficulty = difficultySelect.value;
}

// Game Loop
function gameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    drawBackground();
    updateBackground();
    updateClouds();
    
    // Update and draw falling decorations (background layer)
    updateFallingDecorations();
    drawFallingDecorations();
    
    // Update and draw Tet decorations
    updateTetDecorations();
    drawTetDecorations();
    
    drawGround();
    
    // Update player animation
    updatePlayerAnimation();
    
    if (!gameStarted) {
        ctx.fillStyle = 'rgba(31, 31, 31, 0.8)';
        ctx.font = 'bold 28px Playfair Display, serif';
        ctx.textAlign = 'center';
        ctx.fillText('Nhấn SPACE hoặc Click để bắt đầu', canvas.width / 2, canvas.height / 2 - 20);
        ctx.font = '18px Manrope, sans-serif';
        ctx.fillText('Chúc em bé vượt qua nhiều chướng ngại vật!', canvas.width / 2, canvas.height / 2 + 20);
        
        drawPlayer();
    } else if (gameRunning) {
        updatePlayer();
        updateObstacles();
        updateCollectibles();
        updatePowerUps();
        updateParticles();
        updatePowerUpTimer();
        updateScore();
        updateFireworks();
        
        checkCollectibleCollision();
        checkPowerUpCollision();
        checkMilestone();
        
        if (checkCollision()) {
            gameOver();
        }
        
        drawPlayer();
        obstacles.forEach(obs => drawObstacle(obs));
        drawCollectibles();
        drawPowerUps();
        drawParticles();
        drawFireworks();
        drawScore();
        drawUI();
        
        if (gamePaused) {
            drawPauseOverlay();
        }
    } else {
        drawPlayer();
        obstacles.forEach(obs => drawObstacle(obs));
    }
    
    requestAnimationFrame(gameLoop);
}

// Event Listeners
document.addEventListener('keydown', (e) => {
    if (e.code === 'Space') {
        e.preventDefault();
        if (!gameStarted) {
            resetGame();
        } else {
            jump();
        }
    }
    
    if (e.code === 'KeyP') {
        e.preventDefault();
        togglePause();
    }
});

canvas.addEventListener('click', () => {
    if (!gameStarted) {
        resetGame();
    } else {
        jump();
    }
});

canvas.addEventListener('touchstart', (e) => {
    e.preventDefault();
    if (!gameStarted) {
        resetGame();
    } else {
        jump();
    }
});

restartBtn.addEventListener('click', resetGame);
pauseBtn.addEventListener('click', togglePause);
soundToggle.addEventListener('click', toggleSound);
difficultySelect.addEventListener('change', changeDifficulty);

// Character Selection
const bunny1Btn = document.getElementById('bunny1Btn');
const bunny2Btn = document.getElementById('bunny2Btn');

function selectCharacter(character) {
    selectedCharacter = character;
    
    // Update button states
    document.querySelectorAll('.character-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    
    if (character === 'bunny1') {
        bunny1Btn.classList.add('active');
    } else {
        bunny2Btn.classList.add('active');
    }
    
    // Update player sprite immediately
    updatePlayerAnimation();
}

bunny1Btn.addEventListener('click', () => selectCharacter('bunny1'));
bunny2Btn.addEventListener('click', () => selectCharacter('bunny2'));

// Back Home Function
function backHome() {
    window.location.href = "../index.html";
}

// Countdown Timer to Tet
function updateCountdown() {
    const tetDate = new Date('2026-02-17T00:00:00'); // 00:00 ngày 17 tháng 2 năm 2026
    const now = new Date();
    const diff = tetDate - now;
    
    if (diff > 0) {
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);
        
        document.getElementById('days').textContent = String(days).padStart(2, '0');
        document.getElementById('hours').textContent = String(hours).padStart(2, '0');
        document.getElementById('minutes').textContent = String(minutes).padStart(2, '0');
        document.getElementById('seconds').textContent = String(seconds).padStart(2, '0');
    } else {
        document.getElementById('countdownMessage').textContent = '🎉 Đã đến ngày 17/2/2026! Chúc em bé xinh đẹp, học giỏi, luôn vui vẻ bên anh! 🎊💝';
    }
}

// Update countdown every second
setInterval(updateCountdown, 1000);
updateCountdown();

// Set Momo Link (User will update this)
document.getElementById('lixiLink').href = 'https://lixi.momo.vn/lixi/PM6ZbVg0ZlJd64D';

// Initialize
initClouds();
gameLoop();
