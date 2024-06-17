import React, { useContext, useEffect, useState } from "react";
import "./WeatherAndForecast.css";
import cloud from "../assets/cloud.png";
import thermo from "../assets/thermometer.jpeg";
import wind from "../assets/wind.png";
import humidity from "../assets/water.png";
import { context } from "../App";

function WeatherAndForecast() {
  const {
    city,
    currentDayWeatherData,
    setcurrentDayWeatherData,
    weeklyWeatherData,
    setWeeklyWeatherData,
    API_KEY,
    favouriteCitiesdata,
    setfavouriteCities,
  } = useContext(context);

  let date = new Date().toString();

  useEffect(() => {
    if (city) {
      getcurrentDayWeatherData();
    }
  }, [city]);

  useEffect(() => {
    if (currentDayWeatherData?.coord) {
      getweeklyWeatherData(
        currentDayWeatherData.coord.lat,
        currentDayWeatherData.coord.lon
      );
    }
  }, [currentDayWeatherData]);

  const getcurrentDayWeatherData = async () => {
    try {
      const res = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}`
      );
      let data = await res.json();
      setcurrentDayWeatherData(data);
    } catch (err) {
      console.log(err);
    }
  };

  const getweeklyWeatherData = async (lat, lon) => {
    try {
      const res = await fetch(
        `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
      );
      let data = await res.json();
      setWeeklyWeatherData(data.list.filter((obj, i) => i % 8 === 0));
    } catch (err) {
      console.log(err);
    }
  };

  // const addToFavourites = async () => {
  //   try {
  //     if (
  //       favouriteCitiesdata.some(
  //         (fav) => fav.city.toLowerCase() === city.toLowerCase()
  //       )
  //     ) {
  //       alert("City is already in favourites");
  //       return;
  //     }

  //     const res = await fetch(
  //       "https://weatherdata-zjsc.onrender.com/FavouriteCities",
  //       {
  //         method: "POST",
  //         headers: {
  //           "Content-Type": "application/json",
  //         },
  //         body: JSON.stringify({
  //           id: String(favouriteCitiesdata.length + 1),
  //           city: city,
  //         }),
  //       }
  //     );

  //     if (res.ok) {
  //       const newFavourite = await res.json();
  //       setfavouriteCities([...favouriteCitiesdata, newFavourite]);
  //       alert("city is added to favourite lists");
  //     } else {
  //       console.error("Failed to add to favourites:", res.statusText);
  //     }
  //   } catch (error) {
  //     console.error("Error in addToFavourites:", error);
  //   }
  // };

  return (
    <>
      <div className="weather-forecast-container">
        {currentDayWeatherData && currentDayWeatherData.cod == 200 ? (
          <div className="weather-container">
            <div className="current-weather">
              <div className="weather-div">
                <h1>CURRENT WEATHER</h1>
                {/* <button onClick={addToFavourites}>Add to Favourites</button> */}
              </div>
              <div className="weather-details">
                <div>
                  <h3>{currentDayWeatherData.name}</h3>
                  <p>{date.slice(0, 10)}</p>
                </div>
                <div>
                  <h3>
                    {Math.floor(currentDayWeatherData.main.temp - 273)}
                    <sup>o</sup>C
                  </h3>
                  <p>{currentDayWeatherData.weather[0].description}</p>
                </div>
                <div>
                  <img
                    src={`https://openweathermap.org/img/wn/${currentDayWeatherData.weather[0].icon}@2x.png`}
                    width="100px"
                    alt="weather icon"
                  />
                </div>
              </div>
            </div>
            <div className="current-weather">
              <h1>AIR CONDITIONS</h1>
              <div className="weather-details">
                <div>
                  <div className="img-span">
                    <img src={thermo} width="30px" alt="thermometer icon" />
                    <p>Real feel</p>
                  </div>
                  <h3>
                    {Math.floor(currentDayWeatherData.main.feels_like - 273)}
                    <sup>o</sup>C
                  </h3>
                </div>
                <div>
                  <div className="img-span">
                    <img src={wind} width="30px" alt="wind icon" />
                    <p>Wind</p>
                  </div>
                  <h3>{currentDayWeatherData.wind.speed} m/s</h3>
                </div>
                <div>
                  <div className="img-span">
                    <img src={cloud} width="30px" alt="cloud icon" />
                    <p>Clouds</p>
                  </div>
                  <h3>{currentDayWeatherData.clouds.all} %</h3>
                </div>
                <div>
                  <div className="img-span">
                    <img src={humidity} width="30px" alt="humidity icon" />
                    <p>Humidity</p>
                  </div>
                  <h3>{currentDayWeatherData.main.humidity} %</h3>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <h1 style={{ textAlign: "center" }}>Please Enter the valid city</h1>
        )}
        <div className="forecast-container">
          <h1>WEEKLY FORECAST</h1>
          {currentDayWeatherData && currentDayWeatherData.cod == 200
            ? weeklyWeatherData.map((obj, index) => (
                <div key={index} className="weekly-forecast-card">
                  <div className="forecast-data">
                    <h3>
                      {new Date(obj.dt * 1000).toLocaleDateString("en-US", {
                        weekday: "long",
                      })}
                    </h3>
                    <div>
                      <img
                        src={`https://openweathermap.org/img/wn/${obj.weather[0].icon}.png`}
                        width="30px"
                        alt="weather icon"
                      />
                      <span>{obj.weather[0].description}</span>
                    </div>
                  </div>
                  <div className="forecast-data">
                    <div>
                      <img src={thermo} width="30px" alt="thermometer icon" />
                      <span>
                        {Math.floor(obj.main.temp)}
                        <sup>o</sup>C
                      </span>
                    </div>
                    <div>
                      <img src={cloud} width="20px" alt="cloud icon" />
                      <span>{obj.clouds.all} %</span>
                    </div>
                  </div>
                  <div className="forecast-data">
                    <div>
                      <img src={wind} width="20px" alt="wind icon" />
                      <span>{obj.wind.speed} m/s</span>
                    </div>
                    <div>
                      <img src={humidity} width="20px" alt="humidity icon" />
                      <span>{obj.main.humidity} %</span>
                    </div>
                  </div>
                </div>
              ))
            : ""}
        </div>
      </div>
    </>
  );
}

export default WeatherAndForecast;
