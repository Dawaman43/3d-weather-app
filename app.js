const apiKey = 'a5791138a69b4127a00134332252105'; // Your WeatherAPI.com key
const apiUrl = 'https://api.weatherapi.com/v1/current.json?key=';

const searchBox = document.querySelector('#city-input');
const searchBtn = document.querySelector('#search-btn');
const cityName = document.querySelector('#city-name');
const temperature = document.querySelector('#temperature');
const weatherDescription = document.querySelector('#weather-description');
const weatherIcon = document.querySelector('#weather-icon');
const humidity = document.querySelector('#humidity');
const windSpeed = document.querySelector('#wind-speed');
const cityImage = document.querySelector('#city-image-src');
const suggestions = document.querySelector('#suggestions');
const body = document.querySelector('body');
const themeBtn = document.querySelector('#theme-btn');

const iconMap = {
  1000: 'fas fa-sun', // Sunny
  1003: 'fas fa-cloud-sun', // Partly cloudy
  1006: 'fas fa-cloud', // Cloudy
  1009: 'fas fa-cloud-meatball', // Overcast
  1030: 'fas fa-smog', // Mist
  1063: 'fas fa-cloud-rain', // Patchy rain
  1066: 'fas fa-snowflake', // Patchy snow
  1069: 'fas fa-cloud-meatball', // Patchy sleet
  1087: 'fas fa-bolt', // Thundery outbreaks
  1135: 'fas fa-smog', // Fog
  1189: 'fas fa-cloud-rain', // Heavy rain
  1195: 'fas fa-cloud-showers-heavy', // Heavy rain at times
  1219: 'fas fa-snowflake', // Moderate snow
  1225: 'fas fa-snowflake', // Heavy snow
  1237: 'fas fa-snowflake', // Ice pellets
  1276: 'fas fa-bolt', // Moderate or heavy rain with thunder
};

// Toggle day/night mode
themeBtn.addEventListener('click', () => {
  body.classList.toggle('night-mode');
  if (body.classList.contains('night-mode')) {
    themeBtn.innerHTML = '<i class="fas fa-sun"></i>';
  } else {
    themeBtn.innerHTML = '<i class="fas fa-moon"></i>';
  }
});

// Fetch city image from Unsplash
async function fetchCityImage(city) {
  const unsplashAccessKey = 'YOUR_UNSPLASH_ACCESS_KEY'; // Replace with your Unsplash access key
  const response = await fetch(`https://api.unsplash.com/search/photos?query=${city}&client_id=${unsplashAccessKey}`);
  const data = await response.json();
  if (data.results.length > 0) {
    cityImage.src = data.results[0].urls.regular;
  } else {
    cityImage.src = 'https://images.pexels.com/photos/2448749/pexels-photo-2448749.jpeg';
  }
}

// Fetch search suggestions
async function fetchSuggestions(query) {
  const response = await fetch(`https://api.weatherapi.com/v1/search.json?key=${apiKey}&q=${query}`);
  const data = await response.json();
  suggestions.innerHTML = '';
  data.forEach((city) => {
    const suggestion = document.createElement('div');
    suggestion.textContent = `${city.name}, ${city.country}`;
    suggestion.addEventListener('click', () => {
      searchBox.value = city.name;
      suggestions.innerHTML = '';
      checkWeather(city.name);
    });
    suggestions.appendChild(suggestion);
  });
}

// Check weather
async function checkWeather(city) {
  try {
    const response = await fetch(`${apiUrl}${apiKey}&q=${city}`);
    const data = await response.json();

    if (response.status === 400) {
      alert('City not found');
      return;
    }

    const location = data.location;
    const current = data.current;

    cityName.textContent = `${location.name}, ${location.country}`;
    temperature.textContent = `${current.temp_c}°C`;
    weatherDescription.textContent = current.condition.text;
    humidity.textContent = `${current.humidity}%`;
    windSpeed.textContent = `${current.wind_kph} km/h`;

    const iconCode = current.condition.code;
    weatherIcon.innerHTML = `<i class="${iconMap[iconCode] || 'fas fa-cloud'}"></i>`;

    // Fetch city image
    fetchCityImage(location.name);
  } catch (error) {
    console.error('Error fetching weather data:', error);
    alert('Error fetching weather data. Please try again.');
  }
}

// Event listeners
searchBtn.addEventListener('click', () => {
  const city = searchBox.value.trim();
  if (city) {
    checkWeather(city);
  }
});

searchBox.addEventListener('input', () => {
  const query = searchBox.value.trim();
  if (query.length > 2) {
    fetchSuggestions(query);
  } else {
    suggestions.innerHTML = '';
  }
});

// Initial weather check for a default city
window.addEventListener('load', () => {
  checkWeather('London');
});