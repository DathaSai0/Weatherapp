import React, { useContext } from "react";
import Search from "./Search";
import "./WeatherDashboard.css";
import WeatherAndForecast from "./WeatherAndForecast";
import { useNavigate } from "react-router-dom";
import { context } from "../App";
import { toast } from "react-toastify";

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
        toast.info("City is already in favourites");
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
      console.log(res.ok);
      if (res.ok) {
        const newFavourite = await res.json();
        setfavouriteCities([...favouriteCitiesdata, newFavourite]);
        toast.success("City is added to favourite lists");
      } else {
        console.error("Failed to add to favourites:", res.statusText);
        toast.error("Failed to add city to favourites");
      }
    } catch (error) {
      console.error("Error in addToFavourites:", error);
      toast.error("An error occurred while adding city to favourites");
    }
  };

  return (
    <div>
      <div className="Top-div">
        <h1>Weather</h1>
        <div className="favourites-div">
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
