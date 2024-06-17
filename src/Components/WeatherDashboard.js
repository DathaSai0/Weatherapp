import React, { useContext } from "react";
import Search from "./Search";
import "./WeatherDashboard.css";
import WeatherAndForecast from "./WeatherAndForecast";
import { useNavigate } from "react-router-dom";
import { context } from "../App";
function WeatherDashboard() {
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
  const navigate = useNavigate();
  const addToFavourites = async () => {
    try {
      if (
        favouriteCitiesdata.some(
          (fav) => fav.city.toLowerCase() === city.toLowerCase()
        )
      ) {
        alert("City is already in favourites");
        return;
      }

      const res = await fetch(
        "https://weatherdata-zjsc.onrender.com/FavouriteCities",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            id: String(favouriteCitiesdata.length + 1),
            city: city,
          }),
        }
      );

      if (res.ok) {
        const newFavourite = await res.json();
        setfavouriteCities([...favouriteCitiesdata, newFavourite]);
        alert("city is added to favourite lists");
      } else {
        console.error("Failed to add to favourites:", res.statusText);
      }
    } catch (error) {
      console.error("Error in addToFavourites:", error);
    }
  };
  return (
    <div>
      <div className="Top-div">
        <h1>Weather </h1>
        <div>
          <button onClick={addToFavourites} style={{ marginRight: "5px" }}>
            Add to Favourites
          </button>
          <button
            onClick={() => {
              navigate("/favourites");
            }}
          >
            Favourites
          </button>
        </div>
      </div>
      <Search />
      <WeatherAndForecast />
    </div>
  );
}

export default WeatherDashboard;
