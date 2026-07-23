# Weather Dashboard - Setup Guide

## 🌤️ Overview

A fully functional weather dashboard that fetches real-time weather data from OpenWeatherMap API. Features include current weather display, hourly forecast, 5-day forecast, saved locations, and temperature unit toggle.

## 📋 Features

✅ **Real-time Weather Data** - Current temperature, conditions, humidity, wind speed
✅ **Hourly Forecast** - Next 8 hours of weather predictions
✅ **5-Day Forecast** - Extended weather outlook
✅ **City Search** - Search for any city with autocomplete suggestions
✅ **Geolocation** - Get weather for your current location
✅ **Saved Locations** - Save favorite cities (up to 5)
✅ **Temperature Toggle** - Switch between Celsius and Fahrenheit
✅ **Local Storage** - Saved locations persist in browser
✅ **Responsive Design** - Works on all devices
✅ **Error Handling** - User-friendly error messages

## 🚀 Quick Start (5 Minutes)

### Step 1: Get OpenWeatherMap API Key

1. Visit: **https://openweathermap.org/api**
2. Click **"Sign Up"** or log in
3. Go to your **API keys** section
4. Copy your **API Key** (looks like: `a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6`)

### Step 2: Add API Key to Code

Open `weather-dashboard/weather-app.js` and replace:

```javascript
const API_KEY = 'YOUR_API_KEY_HERE';
```

With your actual API key:

```javascript
const API_KEY = 'a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6';
```

### Step 3: Deploy

```bash
git add .
git commit -m "Add OpenWeatherMap API key"
git push origin main
```

Your app will be live at: **https://tombeck19941994-dev.github.io/Work-out-wheel/weather-dashboard/**

## 📁 File Structure

```
weather-dashboard/
├── index.html              # HTML structure
├── weather-styles.css      # Beautiful responsive styling
├── weather-app.js          # Complete API integration & logic
└── README.md              # This file
```

## 🔧 Technical Details

### API Endpoints Used

1. **Geocoding API** - Convert city names to coordinates
   ```
   https://api.openweathermap.org/geo/1.0/direct
   ```

2. **Current Weather** - Real-time weather data
   ```
   https://api.openweathermap.org/data/2.5/weather
   ```

3. **Forecast API** - 5-day weather forecast
   ```
   https://api.openweathermap.org/data/2.5/forecast
   ```

### Data Cached

- **Current Weather Data** - Updated on each search
- **Saved Locations** - Stored in LocalStorage
- **Forecast Data** - Fetched with current weather

### Temperature Conversion

- **Celsius to Fahrenheit**: `(C × 9/5) + 32`
- **Wind Speed**: Converted from m/s to km/h

## 🎨 Customization

### Change Color Scheme

Edit `weather-styles.css` and update the gradient:

```css
body {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    /* Try: #ff6b6b to #ee5a6f, or #4facfe to #00f2fe */
}
```

### Change Default City

In `weather-app.js`, find the initialization:

```javascript
// Load weather for default city
searchWeather('London');
```

Change `'London'` to any city you prefer.

### Adjust Forecast Length

For hourly forecast (currently 8 hours), in `displayHourlyForecast()`:

```javascript
const hourlyData = currentForecastData.list.slice(0, 8);
// Change 8 to any number
```

## 🌍 OpenWeatherMap API

### Free Plan Details

- ✅ Free forever
- ✅ Current weather & 5-day forecast
- ✅ 60 calls/minute
- ✅ Historical data available
- ❌ Real-time alerts (Premium)
- ❌ Air quality data (Premium)

### API Response Example

```json
{
  "coord": {"lon": -0.1257, "lat": 51.5085},
  "weather": [{"id": 500, "main": "Rain", "description": "light rain"}],
  "main": {
    "temp": 15.4,
    "feels_like": 14.8,
    "humidity": 72,
    "pressure": 1013
  },
  "wind": {"speed": 5.2},
  "clouds": {"all": 90}
}
```

## 🛠️ Troubleshooting

### "API Key not working"
- Make sure you're using the **correct API key** (not App ID)
- Allow 5 minutes after creating the key for activation
- Check API key has **no spaces**

### "City not found"
- Try different spelling or full name (e.g., "New York" instead of "NYC")
- Use official city names from OpenWeatherMap
- Try coordinates instead of city name

### "Permission denied for geolocation"
- Browser needs HTTPS to use geolocation (GitHub Pages uses HTTPS ✓)
- Check browser permissions for location access
- Allow when prompted

### "Forecast not showing"
- Wait for current weather to load first
- Check browser console (F12) for errors
- Verify API key is valid

### "No data appearing"
- Open Browser DevTools (F12)
- Check **Console** tab for error messages
- Verify API_KEY is replaced in weather-app.js
- Check **Network** tab to see API responses

## �� Performance Tips

1. **Cache API Responses** - Implement 30-minute cache to reduce API calls
2. **Lazy Load Images** - Weather icons load on demand
3. **Minify Code** - Use production build tools
4. **CDN** - Deploy via CDN for faster loading

## 🔐 Security Considerations

⚠️ **Warning**: Your API key is exposed in client-side code. For production:

1. Create a **backend API** that calls OpenWeatherMap
2. Keep API key **server-side only**
3. Frontend calls your backend, which calls OpenWeatherMap
4. This also allows request rate limiting

### Example Backend (Node.js)

```javascript
// server.js
app.get('/api/weather/:city', async (req, res) => {
  const { city } = req.params;
  const response = await fetch(
    `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${process.env.API_KEY}`
  );
  const data = await response.json();
  res.json(data);
});
```

## 📈 Next Steps

### Level 1: Enhance Frontend
- [ ] Add weather alerts and warnings
- [ ] Implement historical data view
- [ ] Add weather charts/graphs
- [ ] Create custom themes

### Level 2: Add Backend
- [ ] Secure API key
- [ ] Implement caching
- [ ] Add user authentication
- [ ] Store user preferences

### Level 3: Go Mobile
- [ ] Convert to React Native
- [ ] Add push notifications
- [ ] Offline support
- [ ] App Store deployment

## 📚 Resources

### OpenWeatherMap
- [API Documentation](https://openweathermap.org/api)
- [Weather Icons](https://openweathermap.org/weather-conditions)
- [Free Plans](https://openweathermap.org/price)

### Web APIs
- [Fetch API](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API)
- [Geolocation API](https://developer.mozilla.org/en-US/docs/Web/API/Geolocation_API)
- [LocalStorage](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage)

### CSS/JavaScript
- [CSS Gradients](https://developer.mozilla.org/en-US/docs/Web/CSS/gradient)
- [CSS Grid](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Grid_Layout)
- [Promise & Async/Await](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)

## 🐛 Known Issues

- Suggestions dropdown may overlap on small screens (mobile)
- Geolocation requires HTTPS (works on GitHub Pages)
- Free API has 60 calls/minute limit

## ✅ Testing Checklist

- [ ] Search for a city
- [ ] Toggle temperature units
- [ ] View hourly forecast
- [ ] View 5-day forecast
- [ ] Save a location
- [ ] Use geolocation button
- [ ] Test on mobile device
- [ ] Test error handling (invalid city)
- [ ] Clear saved locations
- [ ] Refresh page and verify data persists

## 🎉 Deployment Status

✅ **Live & Ready**
- Hosted on GitHub Pages
- No backend required
- Real-time weather data
- 100% functional

## 💡 Pro Tips

1. **Bookmark favorite cities** for quick access
2. **Check before going out** - hourly forecast is very accurate
3. **Monitor pressure changes** - indicates weather changes coming
4. **Wind speed matters** - especially for outdoor activities
5. **Humidity affects feel** - same temp feels different at different humidity

---

**Need Help?** Check the browser console (F12) for error messages
**API Issues?** Visit https://openweathermap.org/faq

Created with ❤️ for weather enthusiasts 🌤️