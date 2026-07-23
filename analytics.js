// Google Analytics Integration
function initializeAnalytics() {
    // Load Google Analytics
    if (!window.gtag) {
        const script = document.createElement('script');
        script.src = 'https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX';
        script.async = true;
        document.head.appendChild(script);
        
        window.dataLayer = window.dataLayer || [];
        window.gtag = function() {
            dataLayer.push(arguments);
        };
        gtag('js', new Date());
        gtag('config', 'G-XXXXXXXXXX');
    }
}

// Track custom events
function trackEvent(eventName, eventData = {}) {
    if (window.gtag) {
        gtag('event', eventName, eventData);
    }
}

// Track page views
function trackPageView(pageName) {
    trackEvent('page_view', {
        page_title: pageName,
        page_location: window.location.href
    });
}

// Track wheel spins
function trackWheelSpin() {
    trackEvent('wheel_spin', {
        is_premium: gameState.isPremium,
        total_coins: gameState.coins,
        workout_count: gameState.workoutHistory.length
    });
}

// Track completed workouts
function trackWorkoutCompleted(exercise) {
    trackEvent('workout_completed', {
        exercise_name: exercise.name,
        sets: exercise.sets,
        reps: exercise.reps,
        coins_earned: 10 * gameState.coinMultiplier,
        is_premium: gameState.isPremium
    });
}

// Track coin earnings
function trackCoinsEarned(amount, source) {
    trackEvent('coins_earned', {
        amount: amount,
        source: source,
        is_premium: gameState.isPremium,
        total_coins: gameState.coins
    });
}

// Track ad views
function trackAdView(adType) {
    trackEvent('ad_view', {
        ad_type: adType,
        is_premium: gameState.isPremium
    });
}

// Track premium interactions
function trackPremiumModal() {
    trackEvent('premium_modal_viewed', {
        is_premium: gameState.isPremium
    });
}

function trackPremiumPurchase(planType) {
    trackEvent('premium_purchase', {
        plan_type: planType,
        price: planType === 'monthly' ? 4.99 : 49.99,
        currency: 'USD'
    });
}

function trackFreeTrial() {
    trackEvent('free_trial_started', {
        duration_days: 7
    });
}

// Revenue tracking
function calculateMRR() {
    const premiumUsers = gameState.isPremium ? 1 : 0;
    const monthlyPrice = 4.99;
    return premiumUsers * monthlyPrice;
}

function trackRevenueMetrics() {
    const metrics = {
        active_users: 1,
        premium_users: gameState.isPremium ? 1 : 0,
        total_coins: gameState.coins,
        workouts_completed: gameState.workoutHistory.length,
        mrr: calculateMRR(),
        timestamp: new Date().toISOString()
    };
    
    trackEvent('revenue_metrics', metrics);
    console.log('[METRICS]', metrics);
}

// Initialize on page load
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
        initializeAnalytics();
        trackPageView('Workout Wheel Home');
    });
} else {
    initializeAnalytics();
    trackPageView('Workout Wheel Home');
}