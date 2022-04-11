function formatDate(timestamp) {
  let currently = new Date();
  let days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  let day = days[currently.getDay()];
  let months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  let month = months[currently.getMonth()];
  let date = currently.getDate();
  let yr = currently.getFullYear();
  let hrs = currently.getHours();
  hrs = ((hrs + 11) % 12) + 1;
  let mins = currently.getMinutes();
  if (mins < 10) {
    mins = `0${mins}`;
  }
  let period = " ";
  if (currently.getHours() >= 12) {
    period = "PM";
  } else {
    period = "AM";
  }
  return `${day}, ${month} ${date}, ${yr} <br/> ${hrs}:${mins} ${period}`;
}

function displayWeatherInfo(response) {
  getForecast(response.data.coord);
  document.querySelector("#city-and-country").innerHTML =
    response.data.name + "," + response.data.sys.country;
  fahrenheitTemp = response.data.main.temp;
  document.querySelector("#current-temp").innerHTML =
    Math.round(response.data.main.temp) + "°";
  document.querySelector("#current-max-temp").innerHTML = Math.round(
    response.data.main.temp_max
  );
  document.querySelector("#current-min-temp").innerHTML = Math.round(
    response.data.main.temp_min
  );
  document.querySelector("#humidity").innerHTML = response.data.main.humidity;
  windSpeed = response.data.wind.speed;
  document.querySelector("#wind").innerHTML =
    Math.round(windSpeed * 0.621371) + "mph";
  document.querySelector("#weather-description").innerHTML =
    response.data.weather[0].description;
  document.querySelector("#current-date").innerHTML = formatDate(
    response.data.dt * 1000
  );
  document
    .querySelector("#weather-icon")
    .setAttribute(
      "src",
      `http://openweathermap.org/img/wn/${response.data.weather[0].icon}@2x.png`
    );
  document
    .querySelector("#weather-icon")
    .setAttribute("alt", response.data.weather[0].description);
}

function searchLocation(position) {
  let latitude = position.coords.latitude;
  let longitude = position.coords.longitude;
  let apiKey = "683e4b4c8da99f743787774373494a6d";
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=imperial&appid=${apiKey}`;
  axios.get(apiUrl).then(displayWeatherInfo);
}

function getCurrentLocation(event) {
  event.preventDefault();
  navigator.geolocation.getCurrentPosition(searchLocation);
}

let locationButton = document.querySelector("#location-btn");
locationButton.addEventListener("click", getCurrentLocation);

function searchCity(city) {
  let apiKey = "683e4b4c8da99f743787774373494a6d";
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=imperial&appid=${apiKey}`;
  axios.get(apiUrl).then(displayWeatherInfo);
}

function handleSubmit(event) {
  event.preventDefault();
  let city = document.querySelector("#city-input").value;
  if (city.length <= 0) {
    alert(`please type a city`);
  } else {
    searchCity(city);
  }
}

let locationForm = document.querySelector("#location-form");
locationForm.addEventListener("submit", handleSubmit);

function showCelsiusTemperature(event) {
  fahrenheitButton.classList.remove("active");
  celsiusButton.classList.add("active");
  let celsiusTemp = ((fahrenheitTemp - 32) * 5) / 9;
  document.querySelector("#current-temp").innerHTML =
    Math.round(celsiusTemp) + "°";
}

let celsiusButton = document.querySelector("#celsius-btn");
celsiusButton.addEventListener("click", showCelsiusTemperature);

function showFahrenheitTemperature(event) {
  celsiusButton.classList.remove("active");
  fahrenheitButton.classList.add("active");
  document.querySelector("#current-temp").innerHTML =
    Math.round(fahrenheitTemp) + "°";
}
let fahrenheitButton = document.querySelector("#fahrenheit-btn");
fahrenheitButton.addEventListener("click", showFahrenheitTemperature);

let fahrenheitTemp = null;

function displayWeatherForecast(response) {
  let dailyForecast = response.data.daily;
  let forecast = document.querySelector("#forecast");
  let forecastHTML = `<div class="row" style="margin:0 auto 5px">`;
  dailyForecast.forEach(function (forecastDay, index) {
    if (index < 7 && index > 0) {
      forecastHTML =
        forecastHTML +
        `
            <div class="six-day-forecast pulse col">
            <span class="forecast-day">${formatDay(forecastDay.dt)}</span>
            <img 
            src="http://openweathermap.org/img/wn/${
              forecastDay.weather[0].icon
            }@2x.png" alt="" width="75"/><br /><span
            class="forecast-max-temp"
            >${Math.round(forecastDay.temp.max)}</span
            >°/<span class="forecast-min-temp">${Math.round(
              forecastDay.temp.min
            )}</span>°
            </div>
            `;
    }
  });
  forecastHTML = forecastHTML + `</div>`;
  forecast.innerHTML = forecastHTML;
}

function getForecast(coordinates) {
  let apiKey = "683e4b4c8da99f743787774373494a6d";
  let apiUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${coordinates.lat}&lon=${coordinates.lon}&units=imperial&appid=${apiKey}`;
  axios.get(apiUrl).then(displayWeatherForecast);
}

function formatDay(timestamp) {
  let date = new Date(timestamp * 1000);
  let day = date.getDay();
  let days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  return days[day];
}

searchCity("New York");
