import axios from 'axios';
import { format } from 'date-fns';
import { toUpperCase, setValue, getIconUrl } from './helpers';

function renderCurrentWeather(currentData) {
  document
    .querySelector('[data-current-icon]')
    .setAttribute('src', getIconUrl(currentData.icon, { large: true }));
  setValue('[data-current-temp]', currentData.currentTemperature);
  setValue('[data-current-description]', toUpperCase(currentData.conditions));
  setValue('[data-current-high]', currentData.highTemperature);
  setValue('[data-current-fl-high]', currentData.feelsLikeHigh);
  setValue('[data-current-wind]', currentData.currentWindSpeed);
  setValue('[data-current-low]', currentData.lowTemperature);
  setValue('[data-current-fl-low]', currentData.feelsLikeLow);
  setValue('[data-current-precip]', currentData.precipitation);
}

function renderDailyWeather(dailyData) {
  const daySectionEl = document.querySelector('.day-section');
  const dayCardTemplate = document.querySelector('#day-card-template');

  daySectionEl.innerHTML = '';

  dailyData.forEach((day) => {
    const dayCardTemplateClone = dayCardTemplate.content.cloneNode(true);

    dayCardTemplateClone.querySelector('[data-day-card-icon]').src = getIconUrl(
      day.icon
    );

    setValue('.day-card-date', format(new Date(day.timestamp), 'EEE'), {
      parent: dayCardTemplateClone,
    });

    setValue('.day-card-temp', day.temperature, {
      parent: dayCardTemplateClone,
    });

    daySectionEl.appendChild(dayCardTemplateClone);
  });
}

function renderHourlyWeather(hourlyData) {
  const hourlyTableEl = document.querySelector('.hour-table');
  const hourlyRowTemplate = document.querySelector('#hour-row-template');

  hourlyTableEl.innerHTML = '';

  hourlyData.forEach((hour) => {
    const hourlyRowTemplateClone = hourlyRowTemplate.content.cloneNode(true);

    setValue('[data-hour-day]', format(new Date(hour.timestamp), 'EEEE'), {
      parent: hourlyRowTemplateClone,
    });

    setValue('[data-hour]', format(new Date(hour.timestamp), 'ha'), {
      parent: hourlyRowTemplateClone,
    });

    hourlyRowTemplateClone.querySelector('[data-hour-icon]').src = getIconUrl(
      hour.icon
    );

    setValue('[data-hour-temp]', hour.temperature, {
      parent: hourlyRowTemplateClone,
    });

    setValue('[data-hour-fl-temp]', hour.feelsLike, {
      parent: hourlyRowTemplateClone,
    });

    setValue('[data-hour-wind]', hour.windSpeed, {
      parent: hourlyRowTemplateClone,
    });

    setValue('[data-hour-precip]', hour.precipitation, {
      parent: hourlyRowTemplateClone,
    });

    hourlyTableEl.appendChild(hourlyRowTemplateClone);
  });
}

function renderWeather({ current, daily, hourly }) {
  document.body.classList.remove('blurred');
  renderCurrentWeather(current);
  renderDailyWeather(daily);
  renderHourlyWeather(hourly);
}

function getWeather(lat, lon) {
  axios
    .get('http://localhost:3001/weather', {
      params: {
        lat,
        lon,
      },
    })
    .then((res) => {
      console.log(res.data);
      renderWeather(res.data);
    })
    .catch((err) => {
      console.log(err);
      alert('Error getting weather data. Please, try again.');
    });
}

function positionSuccess({ coords: { latitude, longitude } }) {
  console.log(latitude, longitude);
  getWeather(latitude, longitude);
  // console.log(data);
}

function positionError() {
  alert(
    'Failed to get your position. Please, enable geolocation access in your browser.'
  );
}

if (navigator) {
  navigator.geolocation.getCurrentPosition(positionSuccess, positionError);
}
