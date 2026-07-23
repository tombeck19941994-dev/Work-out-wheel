// Workout exercises database
const workoutExercises = [
    { name: 'Push-ups', sets: 3, reps: 15, duration: '1 min', color: '#FF6B6B' },
    { name: 'Squats', sets: 4, reps: 20, duration: '2 min', color: '#4ECDC4' },
    { name: 'Burpees', sets: 3, reps: 10, duration: '1.5 min', color: '#45B7D1' },
    { name: 'Plank Hold', sets: 3, reps: 1, duration: '1 min', color: '#FFA07A' },
    { name: 'Jumping Jacks', sets: 3, reps: 30, duration: '1.5 min', color: '#98D8C8' },
    { name: 'Lunges', sets: 3, reps: 20, duration: '1.5 min', color: '#F7DC6F' },
    { name: 'Sit-ups', sets: 3, reps: 25, duration: '1.5 min', color: '#BB8FCE' },
    { name: 'Mountain Climbers', sets: 3, reps: 20, duration: '1 min', color: '#85C1E2' },
];

// Game State
let gameState = {
    coins: localStorage.getItem('coins') ? parseInt(localStorage.getItem('coins')) : 0,
    isPremium: localStorage.getItem('isPremium') === 'true',
    coinMultiplier: localStorage.getItem('isPremium') === 'true' ? 2 : 1,
    workoutHistory: JSON.parse(localStorage.getItem('workoutHistory') || '[]'),
    totalReps: parseInt(localStorage.getItem('totalReps') || '0'),
    isSpinning: false,
    wheelRotation: 0,
};

let currentExercise = null;
let animationFrameId = null;

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
    setupEventListeners();
    drawWheel();
    updateUI();
});

function initializeApp() {
    // Initialize Google Ads
    if (window.adsbygoogle) {
        (adsbygoogle = window.adsbygoogle || []).push({});
    }
    
    // Check if it's a new day, reset workout count
    const lastDate = localStorage.getItem('lastDate');
    const today = new Date().toDateString();
    if (lastDate !== today) {
        localStorage.setItem('workoutHistory', '[]');
        localStorage.setItem('lastDate', today);
        gameState.workoutHistory = [];
    }
}

function setupEventListeners() {
    const spinButton = document.getElementById('spinButton');
    const completeBtn = document.getElementById('completeBtn');
    const skipBtn = document.getElementById('skipBtn');
    const watchAdBtn = document.getElementById('watchAdBtn');
    const premiumBtn = document.querySelector('.btn-premium');
    const buyPremiumBtn = document.getElementById('buyPremium');
    const freeTrialBtn = document.getElementById('freeTrial');
    const closeModal = document.querySelector('.close');

    if (spinButton) spinButton.addEventListener('click', spinWheel);
    if (completeBtn) completeBtn.addEventListener('click', completeWorkout);
    if (skipBtn) skipBtn.addEventListener('click', skipWorkout);
    if (watchAdBtn) watchAdBtn.addEventListener('click', watchAdForCoins);
    if (premiumBtn) premiumBtn.addEventListener('click', openPremiumModal);
    if (buyPremiumBtn) buyPremiumBtn.addEventListener('click', purchasePremium);
    if (freeTrialBtn) freeTrialBtn.addEventListener('click', startFreeTrial);
    if (closeModal) closeModal.addEventListener('click', closePremiumModal);

    // Close modal when clicking outside
    window.addEventListener('click', function(event) {
        const modal = document.getElementById('premiumModal');
        if (modal && event.target === modal) {
            closePremiumModal();
        }
    });
}

// Draw the wheel with smooth graphics
function drawWheel() {
    const canvas = document.getElementById('wheelCanvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const radius = canvas.width / 2 - 15;
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;

    // Clear canvas with smooth background
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw shadow
    ctx.shadowColor = 'rgba(0, 0, 0, 0.3)';
    ctx.shadowBlur = 20;
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 10;

    const sliceAngle = (Math.PI * 2) / workoutExercises.length;

    // Draw each slice with gradient
    workoutExercises.forEach((exercise, index) => {
        const startAngle = index * sliceAngle + gameState.wheelRotation;
        const endAngle = startAngle + sliceAngle;

        // Create gradient for each slice
        const gradient = ctx.createLinearGradient(centerX, centerY, centerX + radius * Math.cos(startAngle + sliceAngle / 2), centerY + radius * Math.sin(startAngle + sliceAngle / 2));
        gradient.addColorStop(0, adjustBrightness(exercise.color, 20));
        gradient.addColorStop(1, exercise.color);

        // Draw slice
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius, startAngle, endAngle);
        ctx.lineTo(centerX, centerY);
        ctx.fill();

        // Draw border with glow effect
        ctx.strokeStyle = '#fff';
        ctx.lineWidth = 3;
        ctx.stroke();

        // Draw text
        ctx.save();
        ctx.translate(centerX, centerY);
        ctx.rotate(startAngle + sliceAngle / 2);
        ctx.textAlign = 'right';
        ctx.fillStyle = '#fff';
        ctx.font = 'bold 13px Arial';
        ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';
        ctx.shadowBlur = 4;
        ctx.shadowOffsetX = 1;
        ctx.shadowOffsetY = 1;
        ctx.fillText(exercise.name, radius - 30, 5);
        ctx.restore();
    });

    // Clear shadow for center
    ctx.shadowColor = 'transparent';

    // Draw center circle with gradient
    const centerGradient = ctx.createRadialGradient(centerX, centerY, 10, centerX, centerY, 35);
    centerGradient.addColorStop(0, '#ffffff');
    centerGradient.addColorStop(1, '#f0f0f0');
    ctx.fillStyle = centerGradient;
    ctx.beginPath();
    ctx.arc(centerX, centerY, 35, 0, Math.PI * 2);
    ctx.fill();

    // Draw center border
    ctx.strokeStyle = '#667eea';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Draw pointer/arrow at top
    ctx.fillStyle = '#667eea';
    ctx.beginPath();
    ctx.moveTo(centerX - 12, 15);
    ctx.lineTo(centerX + 12, 15);
    ctx.lineTo(centerX, 35);
    ctx.closePath();
    ctx.fill();
}

// Adjust brightness of color
function adjustBrightness(color, percent) {
    const num = parseInt(color.replace("#",""), 16);
    const amt = Math.round(2.55 * percent);
    const R = (num >> 16) + amt;
    const G = (num >> 8 & 0x00FF) + amt;
    const B = (num & 0x0000FF) + amt;
    return "#" + (0x1000000 + (R<255?R<1?0:R:255)*0x10000 +
        (G<255?G<1?0:G:255)*0x100 +
        (B<255?B<1?0:B:255))
        .toString(16).slice(1);
}

// Spin the wheel with smooth animation
function spinWheel() {
    if (gameState.isSpinning) return;

    const spinButton = document.getElementById('spinButton');
    if (!spinButton) return;

    spinButton.disabled = true;
    gameState.isSpinning = true;

    // Clear any existing animation
    if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
    }

    const spinDuration = 4000; // 4 seconds
    const totalRotation = (Math.PI * 2) * 5 + (Math.random() * Math.PI * 2); // 5+ full rotations
    const startTime = Date.now();
    const canvas = document.getElementById('wheelCanvas');

    const animate = () => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / spinDuration, 1);

        // Easing function for smooth deceleration (cubic ease-out)
        const easeOut = 1 - Math.pow(1 - progress, 3);
        const rotation = totalRotation * easeOut;

        gameState.wheelRotation = rotation;
        drawWheel();

        if (progress < 1) {
            animationFrameId = requestAnimationFrame(animate);
        } else {
            // Spin complete
            gameState.isSpinning = false;
            spinButton.disabled = false;

            // Calculate selected exercise
            const normalizedRotation = (totalRotation % (Math.PI * 2));
            const sliceAngle = (Math.PI * 2) / workoutExercises.length;
            
            // Calculate index accounting for pointer at top
            let selectedIndex = Math.floor((Math.PI * 2 - (normalizedRotation % (Math.PI * 2))) / sliceAngle);
            selectedIndex = selectedIndex % workoutExercises.length;

            currentExercise = workoutExercises[selectedIndex];
            showResult();
        }
    };

    animationFrameId = requestAnimationFrame(animate);
}

// Show result
function showResult() {
    if (!currentExercise) return;

    const resultDisplay = document.getElementById('resultDisplay');
    if (!resultDisplay) return;

    document.getElementById('resultExercise').textContent = currentExercise.name;
    document.getElementById('resultSets').textContent = currentExercise.sets;
    document.getElementById('resultReps').textContent = currentExercise.reps;
    document.getElementById('resultDuration').textContent = currentExercise.duration;

    const coinsEarned = 10 * gameState.coinMultiplier;
    document.getElementById('coinsEarned').textContent = `+${coinsEarned} Coins!`;

    resultDisplay.classList.remove('hidden');
    resultDisplay.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

// Complete workout
function completeWorkout() {
    if (!currentExercise) return;

    const coinsEarned = 10 * gameState.coinMultiplier;
    gameState.coins += coinsEarned;
    gameState.totalReps += currentExercise.reps;

    // Add to history
    const workout = {
        name: currentExercise.name,
        sets: currentExercise.sets,
        reps: currentExercise.reps,
        time: new Date().toLocaleTimeString(),
    };
    gameState.workoutHistory.push(workout);

    // Save to localStorage
    localStorage.setItem('coins', gameState.coins);
    localStorage.setItem('totalReps', gameState.totalReps);
    localStorage.setItem('workoutHistory', JSON.stringify(gameState.workoutHistory));

    updateUI();
    hideResult();
    showCelebration('🎉 Great Job! Workout Completed!');
}

// Skip workout
function skipWorkout() {
    hideResult();
}

// Hide result
function hideResult() {
    const resultDisplay = document.getElementById('resultDisplay');
    if (resultDisplay) {
        resultDisplay.classList.add('hidden');
    }
    currentExercise = null;
}

// Show celebration animation
function showCelebration(message) {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
        padding: 20px 30px;
        border-radius: 10px;
        font-weight: bold;
        z-index: 1001;
        animation: slideInRight 0.3s ease;
        box-shadow: 0 10px 25px rgba(0, 0, 0, 0.3);
    `;
    notification.textContent = message;
    document.body.appendChild(notification);

    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Watch ad for coins
function watchAdForCoins() {
    const adContainer = document.getElementById('adContainer');
    if (!adContainer) return;

    adContainer.innerHTML = `
        <div style="padding: 20px; background: white; border-radius: 10px; text-align: center;">
            <p style="color: #666; margin-bottom: 15px; font-weight: bold;">Loading Advertisement...</p>
            <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); height: 250px; border-radius: 8px; display: flex; align-items: center; justify-content: center; color: white; font-size: 18px; margin-bottom: 15px;">
                📺 Video Advertisement
            </div>
            <button id="adCloseBtn" style="padding: 12px 24px; background: #667eea; color: white; border: none; border-radius: 8px; cursor: pointer; width: 100%; font-weight: bold; font-size: 16px;">
                Close Ad & Claim Coins
            </button>
        </div>
    `;

    const closeBtn = document.getElementById('adCloseBtn');
    if (closeBtn) {
        closeBtn.addEventListener('click', function() {
            const coinsEarned = 50 * gameState.coinMultiplier;
            gameState.coins += coinsEarned;
            localStorage.setItem('coins', gameState.coins);
            updateUI();
            adContainer.innerHTML = '';
            showCelebration(`+${coinsEarned} Coins from Ad!`);
        });
    }
}

// Update UI
function updateUI() {
    const coinCount = document.getElementById('coinCount');
    const workoutCount = document.getElementById('workoutCount');
    const totalReps = document.getElementById('totalReps');
    const streak = document.getElementById('streak');

    if (coinCount) coinCount.textContent = gameState.coins;
    if (workoutCount) workoutCount.textContent = gameState.workoutHistory.length;
    if (totalReps) totalReps.textContent = gameState.totalReps;
    if (streak) streak.textContent = gameState.workoutHistory.length > 0 ? '🔥 Active' : 'Start Now';

    updateWorkoutHistory();
}

// Update workout history display
function updateWorkoutHistory() {
    const historyContainer = document.getElementById('workoutHistory');
    if (!historyContainer) return;

    if (gameState.workoutHistory.length === 0) {
        historyContainer.innerHTML = '<p class="empty">No workouts yet. Start spinning!</p>';
        return;
    }

    historyContainer.innerHTML = gameState.workoutHistory.map((workout, index) => `
        <div class="workout-item">
            <div class="workout-item-info">
                <h4>${index + 1}. ${workout.name}</h4>
                <p>${workout.time}</p>
            </div>
            <div class="workout-item-stats">
                ${workout.sets}x${workout.reps}
            </div>
        </div>
    `).join('');
}

// Premium Features
function openPremiumModal() {
    const modal = document.getElementById('premiumModal');
    if (modal) {
        modal.classList.remove('hidden');
    }
}

function closePremiumModal() {
    const modal = document.getElementById('premiumModal');
    if (modal) {
        modal.classList.add('hidden');
    }
}

function purchasePremium() {
    gameState.isPremium = true;
    gameState.coinMultiplier = 2;
    localStorage.setItem('isPremium', 'true');
    closePremiumModal();
    updateUI();
    showCelebration('✨ Premium Unlocked!');
}

function startFreeTrial() {
    const trialEndDate = new Date();
    trialEndDate.setDate(trialEndDate.getDate() + 7);
    localStorage.setItem('trialEndDate', trialEndDate.toISOString());
    gameState.isPremium = true;
    gameState.coinMultiplier = 2;
    localStorage.setItem('isPremium', 'true');
    closePremiumModal();
    updateUI();
    showCelebration('🎁 7-Day Free Trial Started!');
}

// Add keyframe animations to document
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from {
            opacity: 0;
            transform: translateX(100px);
        }
        to {
            opacity: 1;
            transform: translateX(0);
        }
    }
    
    @keyframes slideOutRight {
        from {
            opacity: 1;
            transform: translateX(0);
        }
        to {
            opacity: 0;
            transform: translateX(100px);
        }
    }
`;
document.head.appendChild(style);

// Handle window resize for responsive canvas
window.addEventListener('resize', function() {
    const canvas = document.getElementById('wheelCanvas');
    if (canvas && !gameState.isSpinning) {
        drawWheel();
    }
});

// Cleanup on page unload
window.addEventListener('beforeunload', function() {
    if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
    }
});