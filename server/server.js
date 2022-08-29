const express = require("express");
const cors = require("cors");
const axios = require("axios");
require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.urlencoded({ extended: true }));

function parseCurrentWeather({ current, daily }) {
  const { temp, weather, wind_speed } = current;
  const {
    temp: { max, min },
    feels_like,
    pop,
  } = daily[0];

  return {
    currentTemperature: Math.round(temp),
    icon: weather[0].icon,
    conditions: weather[0].description,
    currentWindSpeed: Math.round(wind_speed),
    highTemperature: Math.round(max),
    lowTemperature: Math.round(min),
    feelsLikeHigh: Math.round(Math.max(...Object.values(feels_like))),
    feelsLikeLow: Math.round(Math.min(...Object.values(feels_like))),
    precipitation: Math.round(pop * 100),
  };
}

function parseDailyWeather({ daily }) {
  return daily.slice(1).map((dayData) => {
    const {
      dt,
      weather,
      temp: { day },
    } = dayData;
    return {
      timestamp: dt * 1000,
      temperature: Math.round(day),
      icon: weather[0].icon,
    };
  });
}

function parseHourlyWeather({ current, hourly }) {
  const currentTimeInSec = current.dt;
  const HOURS_TO_RETURN = 12;
  const HOURS_IN_SECONDS = 3600;

  return hourly.reduce((curr, next) => {
    if (
      curr.length >= HOURS_TO_RETURN ||
      next.dt < currentTimeInSec - HOURS_IN_SECONDS
    )
      return curr;

    const { dt, weather, temp, feels_like, wind_speed, pop } = next;

    const newHour = {
      timestamp: dt * 1000,
      temperature: Math.round(temp),
      feelsLike: Math.round(feels_like),
      windSpeed: Math.round(wind_speed),
      precipitation: Math.round(pop * 100),
      icon: weather[0].icon,
      conditions: weather[0].description,
    };

    return [...curr, newHour];
  }, []);

  /* return hourly
    .filter((hour) => hour.dt > currentTime - HOURS_IN_SECONDS)
    .map((hour) => {
      const { dt, weather, temp, feels_like, wind_speed, pop } = hour;
      return {
        timestamp: dt * 1000,
        temperature: Math.round(temp),
        feelsLike: Math.round(feels_like),
        windSpeed: Math.round(wind_speed),
        precipitation: Math.round(pop * 100),
        icon: weather[0].icon,
        conditions: weather[0].description,
      };
    }); */
}

app.get("/weather", (req, res) => {
  const { lat, lon } = req.query;
  console.log(lat, lon);

  axios
    .get(`https://api.openweathermap.org/data/3.0/onecall`, {
      headers: {
        "Content-Type": "application/json",
      },
      params: {
        lat,
        lon,
        exclude: "minutely,alerts",
        units: "metric",
        appid: process.env.WEATHER_API_KEY,
      },
    })
    .then(({ data }) => {
      // console.log(data);
      res.json({
        current: parseCurrentWeather(data),
        daily: parseDailyWeather(data),
        hourly: parseHourlyWeather(data),
      });
    })
    .catch((err) => {
      res.sendStatus(500);
    });
});

app.listen(3001);
