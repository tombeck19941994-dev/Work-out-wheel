# 🏋️ Spin the Wheel - Workout Generator App

A fun, interactive fitness app that generates random workouts using a spinning wheel. Users earn coins for completing workouts, which can be redeemed for premium features. Monetized with Google AdSense for revenue generation.

## 📋 Features

### Core Features
- **Interactive Spinning Wheel**: Smooth canvas-based wheel animation with 8 different exercises
- **Workout Generator**: Randomly selects exercises with sets, reps, and duration
- **Coin System**: Earn coins for completing workouts
- **Workout History**: Track completed workouts with timestamps
- **Daily Stats**: Monitor daily workouts, total reps, and streaks
- **Responsive Design**: Works on desktop, tablet, and mobile devices

### Monetization Features
- **Google AdSense Integration**: Banner ads and interstitial ad spaces
- **Premium Subscription**: 
  - 2x coin multiplier
  - Ad-free experience
  - Custom workout creation (future feature)
  - Unlimited spins
- **Watch Ads for Coins**: Users can watch ads to earn bonus coins (50 coins per ad)
- **Free Trial**: 7-day premium trial to encourage conversions

## 🚀 Getting Started

### Prerequisites
- Modern web browser (Chrome, Firefox, Safari, Edge)
- GitHub Pages enabled (for free hosting)
- Google AdSense account (for monetization)

### Installation

1. **Clone the Repository**
   ```bash
   git clone https://github.com/tombeck19941994-dev/Work-out-wheel.git
   cd Work-out-wheel
   ```

2. **Set Up Google AdSense**
   - Create a Google AdSense account at [adsense.google.com](https://adsense.google.com)
   - Replace `ca-pub-xxxxxxxxxxxxxxxx` in `index.html` with your AdSense publisher ID
   - Replace ad slot IDs `1234567890` and `9876543210` with your actual ad slots

3. **Deploy to GitHub Pages**
   - Push to your repository
   - Enable GitHub Pages in repository settings
   - Select main branch as source
   - App will be available at: `https://tombeck19941994-dev.github.io/Work-out-wheel/`

4. **Local Testing**
   - Run a local server:
     ```bash
     python -m http.server 8000
     # or
     npx http-server
     ```
   - Navigate to `http://localhost:8000`

## 💰 Monetization Strategy

### Revenue Streams

#### 1. **Google AdSense (Primary Revenue)**
- **Banner Ads**: Display ads at top and bottom of app
- **Interstitial Ads**: Full-screen ads (recommended for premium upsell)
- **Video Ads**: Encouraged through "Watch Ad for Coins" feature
- **Estimated Revenue**: $0.25 - $2.00 per 1,000 impressions (RPM varies by traffic quality)

#### 2. **Premium Subscription**
- **Price**: $4.99/month or $49.99/year
- **Benefits**:
  - 2x coin multiplier (faster rewards)
  - No ads (improves user experience)
  - Future features (custom workouts, achievements)
- **Conversion Strategy**: 
  - Free tier with ads and 1x multiplier
  - Free 7-day trial to reduce friction
  - Premium button prominently displayed
  - Show benefits modal after first 3 workouts

#### 3. **In-App Purchases (Future)**
- Cosmetic items (wheel themes, exercise avatars)
- Workout packs (new exercise collections)
- Challenge passes (seasonal fitness challenges)

### Implementation Guide

#### Google AdSense Setup

1. **Get Approved**
   - Apply at adsense.google.com
   - Ensure site has quality content and traffic
   - Approval usually takes 1-2 weeks

2. **Add Ad Units**
   - Ad Unit 1: Banner at top (300x250 or 728x90)
   - Ad Unit 2: Banner at bottom (300x250 or 728x90)
   - Ad Unit 3: In-feed ads in workout history (future)

3. **Optimization Tips**
   - Place ads above the fold
   - Use responsive ad units for mobile
   - Match ad colors to your design
   - Monitor through AdSense dashboard

#### Premium Purchase Integration

Current implementation uses localStorage (for demo). To enable real purchases:

**Option 1: Stripe Integration**
```javascript
// Add to app.js
function purchasePremium() {
    fetch('https://your-backend.com/create-checkout', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({userId: 'user123', plan: 'monthly'})
    })
    .then(r => r.json())
    .then(data => window.location = data.url);
}
```

**Option 2: Google Play Billing (Mobile App)**
```javascript
// For React Native / Flutter apps
const billingClient = BillingClient.newBuilder(context).build();
billingClient.querySkuDetails(queryParams);
```

**Option 3: RevenueCat (Easiest)**
- Cross-platform purchase management
- Automatic subscription handling
- Analytics dashboard

## 📊 Expected Monetization Metrics

### Assumptions
- 1,000 MAU (Monthly Active Users) by month 3
- 10% premium conversion rate
- Average 3 sessions per user per day
- $1.50 CPM (Cost Per Mille) for AdSense

### Projected Monthly Revenue

```
Ad Revenue:
- 1,000 users × 30 days × 3 sessions × 5 impressions = 450,000 impressions
- 450,000 / 1,000 × $1.50 = $675/month

Premium Subscriptions:
- 1,000 users × 10% = 100 subscribers
- 100 × $4.99 = $499/month

Total Monthly Revenue: ~$1,174
```

### Year 1 Growth Projection
| Month | Users | Revenue |
|-------|-------|---------|
| 1     | 100   | $47     |
| 3     | 1,000 | $1,174  |
| 6     | 5,000 | $5,869  |
| 12    | 15,000| $17,608 |

## 🔧 Technical Architecture

### Files
- **index.html**: Main UI structure with Google Ad slots
- **styles.css**: Responsive design with animations
- **app.js**: Game logic, wheel animation, localStorage management

### Key Technologies
- **HTML5 Canvas**: Smooth wheel graphics and animations
- **CSS3**: Gradients, animations, responsive grid
- **Vanilla JavaScript**: No dependencies (fast loading)
- **localStorage**: Client-side user data persistence

### Browser Support
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## 🎮 Game Mechanics

### Scoring System
| Action | Coins |
|--------|-------|
| Complete Workout | 10 (20 with Premium) |
| Watch Ad | 50 (100 with Premium) |
| Daily Bonus | +5 (Daily login) |

### Workout Database
```javascript
[
  Push-ups: 3×15 (1 min)
  Squats: 4×20 (2 min)
  Burpees: 3×10 (1.5 min)
  Plank Hold: 3×1 (1 min)
  Jumping Jacks: 3×30 (1.5 min)
  Lunges: 3×20 (1.5 min)
  Sit-ups: 3×25 (1.5 min)
  Mountain Climbers: 3×20 (1 min)
]
```

## 📱 Mobile Optimization

- Responsive design tested on iPhone 6s through iPhone 14
- Touch-optimized buttons (44px minimum)
- Smooth performance with 60 FPS animations
- Optimized ad placement for mobile screens

## 🐛 Known Issues & Fixes

| Issue | Status | Fix |
|-------|--------|-----|
| Wheel selection off by one | ✅ Fixed | Added proper angle calculation |
| Ad code not loading | ✅ Fixed | Added adsbygoogle check |
| Modal close button not working | ✅ Fixed | Added proper event listeners |
| Coins not persisting | ✅ Fixed | Implemented localStorage |

## 🚀 Deployment

### GitHub Pages (Free)
```bash
# Already configured
# Just push to main branch
git add .
git commit -m "Update app"
git push origin main
```

### Vercel (Recommended for faster performance)
```bash
npm install -g vercel
vercel
```

### Firebase Hosting
```bash
npm install -g firebase-tools
firebase login
firebase deploy
```

## 📈 Growth Strategies

### User Acquisition
1. **App Store**: Wrap with React Native → iPhone/Android
2. **Social Media**: Share workouts on TikTok, Instagram
3. **SEO**: Optimize for "workout wheel generator" keywords
4. **Referral Program**: 100 coins for referrals

### Engagement
1. **Push Notifications**: Daily reminders (PWA)
2. **Challenges**: Weekly fitness challenges
3. **Leaderboards**: Compete with friends
4. **Achievements**: Badges for milestones

### Monetization Optimization
1. **A/B Testing**: Test ad placements
2. **Pricing Strategy**: Test $2.99 vs $4.99
3. **Paywall Timing**: Show after 5 workouts
4. **Retention**: Track D1, D7, D30 retention

## 📞 Support & Feedback

For issues, feature requests, or feedback:
- Open an issue on GitHub
- Contact: tombeck19941994@gmail.com

## 📄 License

MIT License - feel free to modify and distribute

## 🎯 Future Roadmap

- [ ] User accounts and cloud sync
- [ ] Social sharing features
- [ ] Custom workout creation
- [ ] Music integration
- [ ] Achievement system
- [ ] Mobile app (React Native)
- [ ] Workout statistics dashboard
- [ ] Friend challenges
- [ ] Seasonal events
- [ ] AR workout visualization

---

**Made with ❤️ for fitness enthusiasts**

*Last updated: July 2026*