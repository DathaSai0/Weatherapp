import React, { useContext, useEffect, useState } from "react";
import { context } from "../App";
import "./FavouriteCities.css";
import { useNavigate } from "react-router-dom";

function FavouriteCities() {
  const navigate = useNavigate();
  let date = new Date().toString();
  const [favcityWeather, setfavcityWeather] = useState([]);
  const { favouriteCitiesdata, API_KEY, setfavouriteCities } =
    useContext(context);
  const [showUpdatePopup, setShowUpdatePopup] = useState(false);
  const [selectedCityId, setSelectedCityId] = useState(null);
  const [newCityName, setNewCityName] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    getFavouriteData();
  }, []);

  useEffect(() => {
    if (favouriteCitiesdata.length > 0) {
      fetchWeatherData();
    }
  }, [favouriteCitiesdata]);

  const getFavouriteData = async () => {
    try {
      let res = await fetch(
        "https://weatherdata-zjsc.onrender.com/FavouriteCities"
      );
      let data = await res.json();
      setfavouriteCities(data);
      console.log(data);
    } catch (error) {
      console.error("Error fetching favorite cities data:", error);
    }
  };

  const fetchWeatherData = async () => {
    try {
      const weatherDataPromises = favouriteCitiesdata.map((obj) =>
        fetch(
          `https://api.openweathermap.org/data/2.5/weather?q=${obj.city}&appid=${API_KEY}`
        ).then((res) => res.json())
      );
      const weatherData = await Promise.all(weatherDataPromises);
      setfavcityWeather(
        weatherData.map((city, index) => ({
          ...city,
          id: favouriteCitiesdata[index].id,
        }))
      );
      console.log(weatherData);
    } catch (error) {
      console.error("Error fetching weather data:", error);
    }
  };

  const deleteFunction = (id) => {
    fetch("https://weatherdata-zjsc.onrender.com/FavouriteCities/" + id, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then(() => {
        setfavcityWeather((prev) => prev.filter((obj) => obj.id !== id));
        setfavouriteCities((prev) => prev.filter((obj) => obj.id !== id));
      })
      .catch((error) => {
        console.error("Error deleting favorite city:", error);
      });
  };

  const updateCityName = (id) => {
    setSelectedCityId(id);
    setShowUpdatePopup(true);
  };

  const handleUpdateSubmit = async () => {
    try {
      let res = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${newCityName}&appid=${API_KEY}`
      );
      if (res.ok) {
        const updatedCity = { city: newCityName };
        let updateRes = await fetch(
          `https://weatherdata-zjsc.onrender.com/FavouriteCities/${selectedCityId}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(updatedCity),
          }
        );
        let updatedData = await updateRes.json();
        setfavouriteCities((prev) =>
          prev.map((city) => (city.id === selectedCityId ? updatedData : city))
        );
        setShowUpdatePopup(false);
        setNewCityName("");
        setErrorMessage("");
      } else {
        setErrorMessage("City not found. Please enter a valid city name.");
      }
    } catch (error) {
      console.error("Error updating city name:", error);
    }
  };
  function backfunc() {
    navigate("/");
  }
  if (favcityWeather.length === 0) {
    return <h1>loading...!</h1>;
  }

  return (
    <>
      <button onClick={backfunc} className="Back-btn">
        Back
      </button>
      <div className="favourite-city-div">
        <h1 style={{ textAlign: "center", marginBottom: "50px" }}>
          Favourite Cities Weather Details
        </h1>
        {favcityWeather.map((data, index) => (
          <div key={index} className="fav-weather-container">
            <h3 className="fav-name">{data.name}</h3>
            <p>{date.slice(0, 10)}</p>
            <h3>
              {Math.floor(data.main.temp - 273)}
              <sup>o</sup>C
            </h3>
            <div className="favCitiesBtns">
              <button onClick={() => updateCityName(data.id)}>Update</button>
              <button onClick={() => deleteFunction(data.id)}>Delete</button>
            </div>
          </div>
        ))}

        {showUpdatePopup && (
          <div className="update-popup">
            <div className="popup-content">
              <h3>Update City Name</h3>
              <input
                type="text"
                value={newCityName}
                onChange={(e) => setNewCityName(e.target.value)}
                placeholder="Enter new city name"
              />
              {errorMessage && <p className="error-message">{errorMessage}</p>}
              <button onClick={handleUpdateSubmit} disabled={!newCityName}>
                Submit
              </button>
              <button onClick={() => setShowUpdatePopup(false)}>Cancel</button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default FavouriteCities;
