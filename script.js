const userLocation = document.getElementById("userLocation")
const converter = document.getElementById("converter")
const weatherIcon = document.querySelector(".weather-icon")
const temperature = document.querySelector(".temperature")
const feelsLike = document.querySelector(".feels-like")
const description = document.querySelector(".description")
const date = document.querySelector(".date")
const city = document.querySelector(".city")

const HValue = document.getElementById("HValue")
const WValue = document.getElementById("WValue")
const SRValue = document.getElementById("SRValue")
const SSValue = document.getElementById("SSValue")
const CValue = document.getElementById("CValue")
const VValue = document.getElementById("VValue")
const PValue = document.getElementById("PValue")

const forecast = document.querySelector(".forecast")

const APP_ID = `2c1b6f72b975592f989451ca24a31d54`
const WEATHER_API_ENDPOINT = `https://api.openweathermap.org/data/2.5/weather?appid=${APP_ID}&q=`

function findUserLocation() {
    fetch(WEATHER_API_ENDPOINT + userLocation.value)
    .then(response => response.json())
    .then(data => {
        if (data.cod != '' && data.cod != 200) {
            alert(data.message)
            return
        }
        console.log(data)

        city.innerHTML = data.name + ", " + data.sys.country
        weatherIcon.style.background = `url(https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png)`
        temperature.innerHTML = tempConverter(data.main.temp)
        feelsLike.innerHTML = "Feels like " + tempConverter(data.main.feels_like)
        description.innerHTML = `<i class="fa-brands fa-cloudversify"></i>&nbsp;` + data.weather[0].description
        const options = {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
            hour: "numeric",
            minute: "numeric",
            hour12: true,
        }
        date.innerHTML = getLongFormatDateTime(
            data.dt,
            data.timezone,
            options
        )

        HValue.innerHTML = Math.round(data.main.humidity) + ' ' + "<span>%</span>"
        WValue.innerHTML = Math.round(data.wind.speed) + ' ' + "<span>km/h</span>"
        const options1 = {
            hour: "numeric",
            minute: "numeric",
            hour12: true,
        }
        SRValue.innerHTML = getLongFormatDateTime(data.sys.sunrise, data.timezone, options1)
        SSValue.innerHTML = getLongFormatDateTime(data.sys.sunset, data.timezone, options1)
        CValue.innerHTML = Math.round(data.clouds.all) + ' ' + "<span>%</span>"
        VValue.innerHTML = Math.round(data.visibility)
        PValue.innerHTML = Math.round(data.main.pressure) + ' ' + "<span>hPa</span>"
    })
}

function formatUnixTime(dtValue, offset, options = {}) {
    const date = new Date((dtValue + offset) * 1000)
    return date.toLocaleTimeString([], { timeZone: "UTC", ...options })
}

function getLongFormatDateTime(dtValue, offset, options) {
    return formatUnixTime(dtValue, offset, options)
}

function tempConverter(temp) {
    let tempValue = Math.round(temp - 273.15)
    let message = ""
    if (converter.value == "C") {
        message = tempValue + "<span>" + "\xB0C</span>"
    }
    if (converter.value == "F") {
        let toFahrenheit = Math.round((tempValue * 9) / 5 + 32)
        message = toFahrenheit + "<span>" + "\xB0F</span>"
    }
    return message
}

function displayWeatherData(data) {
  city.innerHTML = `${data.name}, ${data.sys.country}`;
  weatherIcon.style.backgroundImage = `url(https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png)`;
  temperature.innerHTML = tempConverter(data.main.temp);
  feelsLike.innerHTML = "Feels like " + tempConverter(data.main.feels_like);
  description.innerHTML = `<i class="fas fa-cloud-sun"></i>&nbsp;${data.weather[0].description}`;

  const options = {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
    hour12: true,
  };
  date.innerHTML = getLongFormatDateTime(data.dt, data.timezone, options);

  HValue.innerHTML = Math.round(data.main.humidity) + " %";
  WValue.innerHTML = Math.round(data.wind.speed) + " km/h";
  CValue.innerHTML = Math.round(data.clouds.all) + " %";
  VValue.innerHTML = Math.round(data.visibility) + " m";
  PValue.innerHTML = Math.round(data.main.pressure) + " hPa";

  const timeOpts = { hour: "numeric", minute: "numeric", hour12: true };
  SRValue.innerHTML = getLongFormatDateTime(data.sys.sunrise, data.timezone, timeOpts);
  SSValue.innerHTML = getLongFormatDateTime(data.sys.sunset, data.timezone, timeOpts);
}

converter.addEventListener("change", () => {
  if (lastData) {
    temperature.innerHTML = tempConverter(lastData.main.temp);
    feelsLike.innerHTML = "Feels like " + tempConverter(lastData.main.feels_like);
  }
});

userLocation.addEventListener("keypress", function (event) {
  if (event.key === "Enter") {
    findUserLocation();
  }
});

// Default search on load
window.onload = () => {
  userLocation.value = "";
  converter.value = "C";
  fetch(WEATHER_API_ENDPOINT + "Delhi")
    .then((response) => response.json())
    .then((data) => {
      if (data.cod === 200) {
        lastData = data;
        displayWeatherData(data);
      }
    });
};
