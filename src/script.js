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
  document.querySelector("#city-searched").innerHTML = response.data.name;
  document.querySelector("#current-temp").innerHTML = Math.round(
    response.data.main.temp
  );
  document.querySelector("#high-temp").innerHTML = Math.round(
    response.data.main.temp_max
  );
  document.querySelector("#low-temp").innerHTML = Math.round(
    response.data.main.temp_min
  );
  document.querySelector("#humidity").innerHTML = response.data.main.humidity;
  document.querySelector("#wind").innerHTML = Math.round(
    response.data.wind.speed
  );
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
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=${apiKey}`;
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
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`;
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

searchCity("Brooklyn");
