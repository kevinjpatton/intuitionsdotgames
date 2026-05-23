// js/render.js

const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Keep the canvas tightly fitted to the window, preventing scroll bars
function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

// --- RENDERING CONSTANTS ---
const visuals = {
    mountainColor: '#111111',  // Stark black/dark gray for the silhouette
    boulderRadius: 40,
    skyGradientStart: '#2b1055', // Deep cosmic purple
    skyGradientEnd: '#7597de',   // Fading to lighter blue
    descentColor: '#e0c38c'      // Warm golden hour for the walk down
};

// --- MAIN RENDER LOOP ---
// This is called every frame by gameLoop() in main.js
function renderGraphics() {
    // Clear previous frame
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    drawBackground();
    drawMountain();
    drawBoulderAndSisyphus();
    updateUIElements();
}

// 1. The Indifferent Background
function drawBackground() {
    // If falling or descending, shift to the peaceful golden hour
    let isPeaceful = (state.phase === GAME_STATES.DESCENDING);
    
    let gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
    if (isPeaceful) {
        gradient.addColorStop(0, '#f9d976');
        gradient.addColorStop(1, '#efeedb');
    } else {
        gradient.addColorStop(0, visuals.skyGradientStart);
        gradient.addColorStop(1, visuals.skyGradientEnd);
    }
    
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // (Optional: Add a slow-moving parallax starfield or clouds here later)
}

// 2. The Mountain Silhouette
function drawMountain() {
    ctx.fillStyle = visuals.mountainColor;
    ctx.beginPath();
    
    // Draw a steep polygon from bottom-left to top-right
    ctx.moveTo(0, canvas.height); 
    ctx.lineTo(canvas.width, canvas.height * 0.2); // The peak
    ctx.lineTo(canvas.width, canvas.height); 
    ctx.closePath();
    ctx.fill();
}

// 3. The Struggle (Boulder & Figure)
function drawBoulderAndSisyphus() {
    // Map the physics Y coordinate to screen space
    // We use a baseline near the bottom-left, moving up the slope
    
    const slopeAngle = Math.atan2((canvas.height * 0.8), canvas.width); 
    
    // Calculate screen X and Y based on physics state.boulderY (which is negative)
    const screenX = canvas.width * 0.1 + (Math.abs(state.boulderY) * Math.cos(slopeAngle));
    const screenY = (canvas.height * 0.9) - (Math.abs(state.boulderY) * Math.sin(slopeAngle));

    // Draw Boulder
    ctx.fillStyle = visuals.mountainColor;
    ctx.beginPath();
    ctx.arc(screenX, screenY, visuals.boulderRadius, 0, Math.PI * 2);
    ctx.fill();

    // Draw Sisyphus (Abstract Silhouette)
    // He should be positioned just behind (left of) the boulder
    ctx.strokeStyle = visuals.mountainColor;
    ctx.lineWidth = 8;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    
    ctx.beginPath();
    // Torso leaning into the rock
    const hipX = screenX - 50;
    const hipY = screenY + 20;
    const shoulderX = screenX - 25;
    const shoulderY = screenY - 10;
    
    // If he is falling, change posture to standing up/defeated
    if (state.phase === GAME_STATES.FALLING || state.phase === GAME_STATES.DESCENDING) {
        ctx.moveTo(hipX - 20, hipY - 40); // Head upright
        ctx.lineTo(hipX - 20, hipY);      // Torso straight
    } else {
        // Pushing posture
        ctx.moveTo(shoulderX, shoulderY); // Head/Shoulder leaning in
        ctx.lineTo(hipX, hipY);           // Torso angled
        
        // Arms pushing
        ctx.moveTo(shoulderX, shoulderY);
        ctx.lineTo(screenX - 10, screenY + 5); 
    }
    
    ctx.stroke();
}

// 4. Connect HTML UI to Data
function updateUIElements() {
    const willpowerBar = document.getElementById('willpower-bar');
    const quoteContainer = document.getElementById('quote-container');
    
    // Update stamina bar width
    const staminaPercentage = (state.willpower / config.maxWillpower) * 100;
    willpowerBar.style.width = staminaPercentage + '%';
    
    // Handle the philosophical descent quotes
    if (state.phase === GAME_STATES.DESCENDING) {
        quoteContainer.classList.remove('hidden');
        quoteContainer.innerText = "The struggle itself toward the heights is enough to fill a man's heart.";
    } else {
        quoteContainer.classList.add('hidden');
    }
}