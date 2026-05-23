// js/main.js

// Define the states here so all other files can use them
const GAME_STATES = {
    CLIMBING: 'CLIMBING',
    FALLING: 'FALLING',
    DESCENDING: 'DESCENDING'
};

// The main game loop
function gameLoop(timestamp) {
    // These functions live in physics.js and render.js
    updatePhysics();
    renderGraphics();
    
    // We will add updateAudio() back in when we build the Shepard Tone!
    
    requestAnimationFrame(gameLoop);
}

// --- INPUT LISTENERS (Mouse & Touch) ---
let startY = 0;

window.addEventListener('mousedown', (e) => {
    startY = e.clientY;
});
window.addEventListener('mousemove', (e) => {
    // If dragging upward aggressively
    if (startY - e.clientY > 10) {
        startDrag();
        startY = e.clientY; 
    } else {
        stopDrag();
    }
});
window.addEventListener('mouseup', stopDrag);

// Mobile touch equivalents
window.addEventListener('touchstart', (e) => {
    startY = e.touches[0].clientY;
});
window.addEventListener('touchmove', (e) => {
    if (startY - e.touches[0].clientY > 10) {
        startDrag();
        startY = e.touches[0].clientY;
    } else {
        stopDrag();
    }
});
window.addEventListener('touchend', stopDrag);

// Start the loop only once everything is loaded
window.onload = () => {
    requestAnimationFrame(gameLoop);
};
