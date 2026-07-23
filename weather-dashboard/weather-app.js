// OpenWeatherMap API Configuration
const API_KEY = 'YOUR_API_KEY_HERE'; // Get from https://openweathermap.org/api
const BASE_URL = 'https://api.openweathermap.org/data/2.5';
const GEO_URL = 'https://api.openweathermap.org/geo/1.0';

// DOM Elements
const searchInput = document.getElementById('searchInput');
const searchBtn = document.getElementById('searchBtn');
const locationBtn = document.getElementById('locationBtn');
const searchSuggestions = document.getElementById('searchSuggestions');
const currentWeatherSection = document.getElementById('currentWeather');
const hourlyForecastSection = document.getElementById('hourlyForecast');
const dailyForecastSection = document.getElementById('dailyForecast');
const loadingIndicator = document.getElementById('loadingIndicator');
const errorMessage = document.getElementById('errorMessage');
const unitToggle = document.getElementById('unitToggle');
const savedLocationsContainer = document.getElementById('savedLocations');

// State
let currentUnit = 'C';
let currentCity = null;
let currentWeatherData = null;
let currentForecastData = null;
let savedLocations = [];

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    loadSavedLocations();
    displaySavedLocations();
    setupEventListeners();
    
    // Load weather for default city
    searchWeather('London');
});

// Event Listeners
function setupEventListeners() {
    searchBtn.addEventListener('click', handleSearch);
    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') handleSearch();
    });
    searchInput.addEventListener('input', handleSearchInput);
    locationBtn.addEventListener('click', getCurrentLocation);
    unitToggle.addEventListener('change', toggleUnits);
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.search-section')) {
            searchSuggestions.classList.remove('active');
        }
    });
}

// Handle Search
function handleSearch() {
    const city = searchInput.value.trim();
    if (city) {
        searchWeather(city);
        searchInput.value = '';
        searchSuggestions.classList.remove('active');
    }
}

// Handle Search Input (Show Suggestions)
async function handleSearchInput(e) {
    const query = e.target.value.trim();
    if (query.length < 2) {
        searchSuggestions.classList.remove('active');
        return;
    }

    try {
        const response = await fetch(
            `${GEO_URL}/direct?q=${query}&limit=5&appid=${API_KEY}`
        );
        const data = await response.json();
        
        if (data.length > 0) {
            displaySuggestions(data);
            searchSuggestions.classList.add('active');
        }
    } catch (error) {
        console.error('Error fetching suggestions:', error);
    }
}

// Display Search Suggestions
function displaySuggestions(suggestions) {
    searchSuggestions.innerHTML = suggestions.map(city => `
        <div class="suggestion-item" onclick="selectSuggestion('${city.name}', '${city.country}')">
            ${city.name}, ${city.country}
        </div>
    `).join('');
}

// Select Suggestion
function selectSuggestion(cityName, country) {
    searchInput.value = `${cityName}, ${country}`;
    searchWeather(cityName);
    searchSuggestions.classList.remove('active');
}

// Get Current Location
function getCurrentLocation() {
    if (navigator.geolocation) {
        showLoading();
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const { latitude, longitude } = position.coords;
                getWeatherByCoordinates(latitude, longitude);
            },
            (error) => {
                showError('Could not get your location. ' + error.message);
                hideLoading();
            }
        );
    } else {
        showError('Geolocation is not supported by your browser');
    }
}

// Search Weather by City Name
async function searchWeather(city) {
    showLoading();
    try {
        // Get coordinates from city name
        const geoResponse = await fetch(
            `${GEO_URL}/direct?q=${city}&limit=1&appid=${API_KEY}`
        );
        const geoData = await geoResponse.json();
        
        if (geoData.length === 0) {
            showError('City not found. Please try again.');
            hideLoading();
            return;
        }
        
        const { lat, lon, name } = geoData[0];
        currentCity = name;
        getWeatherByCoordinates(lat, lon);
    } catch (error) {
        showError('Error fetching weather data: ' + error.message);
        hideLoading();
    }
}

// Get Weather by Coordinates
async function getWeatherByCoordinates(lat, lon) {
    try {
        // Fetch current weather and forecast
        const [weatherResponse, forecastResponse] = await Promise.all([
            fetch(`${BASE_URL}/weather?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`),
            fetch(`${BASE_URL}/forecast?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`)
        ]);
        
        currentWeatherData = await weatherResponse.json();
        currentForecastData = await forecastResponse.json();
        
        if (currentWeatherData.cod === 200) {
            displayCurrentWeather();
            displayHourlyForecast();
            displayDailyForecast();
            hideLoading();
            hideError();
        } else {
            showError('Error fetching weather data');
            hideLoading();
        }
    } catch (error) {
        showError('Error: ' + error.message);
        hideLoading();
    }
}

// Display Current Weather
function displayCurrentWeather() {
    const { name, sys, main, weather, wind, clouds, visibility, dt } = currentWeatherData;
    
    const temp = convertTemperature(main.temp);
    const feelsLike = convertTemperature(main.feels_like);
    const windSpeed = (wind.speed * 3.6).toFixed(1); // m/s to km/h
    const visibilityKm = (visibility / 1000).toFixed(1);
    
    const weatherIcon = `https://openweathermap.org/img/wn/${weather[0].icon}@4x.png`;
    const dateTime = new Date(dt * 1000).toLocaleString();
    
    document.getElementById('cityName').textContent = `${name}, ${sys.country}`;
    document.getElementById('dateTime').textContent = dateTime;
    document.getElementById('temperature').textContent = Math.round(temp);
    document.getElementById('weatherIcon').src = weatherIcon;
    document.getElementById('weatherDescription').textContent = weather[0].main + ' - ' + weather[0].description;
    document.getElementById('humidity').textContent = `${main.humidity}%`;
    document.getElementById('windSpeed').textContent = `${windSpeed} km/h`;
    document.getElementById('feelsLike').textContent = `${Math.round(feelsLike)}°${currentUnit}`;
    document.getElementById('pressure').textContent = `${main.pressure} hPa`;
    document.getElementById('visibility').textContent = `${visibilityKm} km`;
    document.getElementById('cloudiness').textContent = `${clouds.all}%`;
    
    // Update unit display
    document.querySelectorAll('.temp-unit').forEach(el => {
        el.textContent = `°${currentUnit}`;
    });
    
    currentWeatherSection.classList.remove('hidden');
}

// Display Hourly Forecast
function displayHourlyForecast() {
    const hourlyData = currentForecastData.list.slice(0, 8);
    const hourlyContainer = document.getElementById('hourlyContainer');
    
    hourlyContainer.innerHTML = hourlyData.map(item => {
        const temp = convertTemperature(item.main.temp);
        const time = new Date(item.dt * 1000).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
        const icon = `https://openweathermap.org/img/wn/${item.weather[0].icon}@2x.png`;
        
        return `
            <div class="hourly-item">
                <div class="hourly-time">${time}</div>
                <img src="${icon}" alt="Weather" class="hourly-icon">
                <div class="hourly-temp">${Math.round(temp)}°</div>
            </div>
        `;
    }).join('');
    
    hourlyForecastSection.classList.remove('hidden');
}

// Display Daily Forecast
function displayDailyForecast() {
    const dailyData = {};
    
    // Group by date
    currentForecastData.list.forEach(item => {
        const date = new Date(item.dt * 1000).toLocaleDateString();
        if (!dailyData[date]) {
            dailyData[date] = [];
        }
        dailyData[date].push(item);
    });
    
    const dailyContainer = document.getElementById('dailyContainer');
    const dailyArray = Object.entries(dailyData).slice(0, 5);
    
    dailyContainer.innerHTML = dailyArray.map(([date, items]) => {
        const temps = items.map(item => item.main.temp);
        const maxTemp = convertTemperature(Math.max(...temps));
        const minTemp = convertTemperature(Math.min(...temps));
        const weather = items[Math.floor(items.length / 2)].weather[0];
        const icon = `https://openweathermap.org/img/wn/${weather.icon}@2x.png`;
        
        return `
            <div class="daily-item">
                <div class="daily-date">${date}</div>
                <img src="${icon}" alt="Weather" class="daily-icon">
                <div class="daily-desc">${weather.main}</div>
                <div class="daily-temps">
                    <span class="daily-temp-high">${Math.round(maxTemp)}°</span>
                    <span class="daily-temp-low">${Math.round(minTemp)}°</span>
                </div>
            </div>
        `;
    }).join('');
    
    dailyForecastSection.classList.remove('hidden');
}

// Toggle Temperature Units
function toggleUnits(e) {
    currentUnit = e.target.checked ? 'F' : 'C';
    if (currentWeatherData) {
        displayCurrentWeather();
        displayHourlyForecast();
        displayDailyForecast();
    }
}

// Convert Temperature
function convertTemperature(kelvin) {
    if (currentUnit === 'F') {
        return (kelvin * 9/5) + 32;
    }
    return kelvin;
}

// Save Location
function saveLocation(cityName) {
    if (!savedLocations.includes(cityName) && savedLocations.length < 5) {
        savedLocations.push(cityName);
        localStorage.setItem('savedLocations', JSON.stringify(savedLocations));
        displaySavedLocations();
    }
}

// Load Saved Locations
function loadSavedLocations() {
    const saved = localStorage.getItem('savedLocations');
    savedLocations = saved ? JSON.parse(saved) : [];
}

// Display Saved Locations
function displaySavedLocations() {
    if (savedLocations.length === 0) {
        savedLocationsContainer.innerHTML = '<p class="empty-message">No saved locations yet. Search for a city and save it!</p>';
        return;
    }
    
    savedLocationsContainer.innerHTML = savedLocations.map(location => `
        <div class="location-card" onclick="searchWeather('${location}')">
            <div class="location-name">${location}</div>
            <div class="location-temp">--°</div>
            <button class="remove-location" onclick="removeLocation('${location}', event)">✕</button>
        </div>
    `).join('');
    
    // Load temperatures for saved locations
    savedLocations.forEach(location => {
        loadLocationWeather(location);
    });
}

// Load Location Weather Data
async function loadLocationWeather(location) {
    try {
        const geoResponse = await fetch(
            `${GEO_URL}/direct?q=${location}&limit=1&appid=${API_KEY}`
        );
        const geoData = await geoResponse.json();
        
        if (geoData.length > 0) {
            const { lat, lon } = geoData[0];
            const weatherResponse = await fetch(
                `${BASE_URL}/weather?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`
            );
            const weatherData = await weatherResponse.json();
            
            const temp = convertTemperature(weatherData.main.temp);
            const card = document.querySelector(`[onclick*="${location}"]`);
            if (card) {
                card.querySelector('.location-temp').textContent = `${Math.round(temp)}°${currentUnit}`;
            }
        }
    } catch (error) {
        console.error('Error loading location weather:', error);
    }
}

// Remove Location
function removeLocation(location, event) {
    event.stopPropagation();
    savedLocations = savedLocations.filter(loc => loc !== location);
    localStorage.setItem('savedLocations', JSON.stringify(savedLocations));
    displaySavedLocations();
}

// Add Save Button Functionality
const saveLocationBtn = document.querySelector('.save-location-btn');
if (currentWeatherData) {
    const saveBtn = document.createElement('button');
    saveBtn.className = 'add-btn';
    saveBtn.innerHTML = '⭐ Save Location';
    saveBtn.onclick = () => {
        if (currentCity) {
            saveLocation(currentCity);
            alert(`${currentCity} saved to favorites!`);
        }
    };
}

// Show/Hide Loading
function showLoading() {
    loadingIndicator.classList.remove('hidden');
}

function hideLoading() {
    loadingIndicator.classList.add('hidden');
}

// Show/Hide Error
function showError(message) {
    errorMessage.textContent = message;
    errorMessage.classList.remove('hidden');
}

function hideError() {
    errorMessage.classList.add('hidden');
}