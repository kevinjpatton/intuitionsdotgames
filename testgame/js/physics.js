// js/physics.js

// --- CORE VARIABLES ---
const config = {
    gravity: 0.08,           // The constant downward pull. Needs to feel heavy.
    dragForce: -0.5,         // The upward force applied per swipe/drag tick.
    maxWillpower: 100,       // Total stamina pool.
    braceDrainRate: 0.8,     // How fast Willpower drains while bracing.
    dragDrainRate: 0.2,      // How fast Willpower drains while actively pushing.
    recoveryRate: 0.5,       // How fast Willpower recovers at the bottom.
    friction: 0.92,          // Simulates the slope's resistance to movement.
    mountainTopY: -5000      // The arbitrary "top" before it resets (the eternal loop).
};

// --- GAME STATE ---
let state = {
    boulderY: 0,             // Starts at the bottom (0). Negative goes UP the screen.
    velocity: 0,             // Current speed of the boulder.
    willpower: config.maxWillpower, 
    isDragging: false,
    isBracing: false,
    phase: GAME_STATES.CLIMBING // Pulled from main.js
};

// --- INPUT HANDLERS ---
// These will be hooked up to your touch/mouse event listeners
function startDrag() {
    if (state.phase === GAME_STATES.CLIMBING) state.isDragging = true;
}

function stopDrag() {
    state.isDragging = false;
}

function startBrace() {
    if (state.phase === GAME_STATES.CLIMBING) state.isBracing = true;
}

function stopBrace() {
    state.isBracing = false;
}

// --- THE PHYSICS LOOP ---
// This runs 60 times a second inside requestAnimationFrame
function updatePhysics() {
    if (state.phase === GAME_STATES.CLIMBING) {
        
        // 1. Handle Bracing (The Lock)
        if (state.isBracing && state.willpower > 0) {
            state.velocity = 0; // Boulder is locked in place
            state.willpower -= config.braceDrainRate;
        } 
        // 2. Handle Dragging (The Push)
        else if (state.isDragging && state.willpower > 0) {
            state.velocity += config.dragForce;
            state.willpower -= config.dragDrainRate;
        } 
        // 3. Handle Gravity (The Inevitable)
        else {
            state.velocity += config.gravity;
        }

        // Apply friction and update position
        state.velocity *= config.friction;
        state.boulderY += state.velocity;

        // 4. The Fall Condition
        if (state.willpower <= 0) {
            state.willpower = 0;
            state.isBracing = false;
            state.isDragging = false;
            state.phase = GAME_STATES.FALLING;
        }

        // 5. The Absurd Reset Condition (Reaching the top)
        if (state.boulderY <= config.mountainTopY) {
            // Sisyphus never wins. Immediately reset position.
            state.boulderY = 0;
            state.velocity = 0;
        }
    } 
    
    else if (state.phase === GAME_STATES.FALLING) {
        // Massive gravity takes over. No friction.
        state.velocity += (config.gravity * 3); 
        state.boulderY += state.velocity;

        // Check if it hit the bottom
        if (state.boulderY >= 0) {
            state.boulderY = 0;
            state.velocity = 0;
            state.phase = GAME_STATES.DESCENDING;
        }
    }

    else if (state.phase === GAME_STATES.DESCENDING) {
        // Boulder is resting. Sisyphus walks down.
        // Willpower only regenerates during this peaceful phase.
        if (state.willpower < config.maxWillpower) {
            state.willpower += config.recoveryRate;
        }
    }
}