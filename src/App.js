import logo from "./logo.svg";
import "./App.css";
import WeatherDashboard from "./Components/WeatherDashboard";
import { createContext, useEffect, useState } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import FavouriteCities from "./Components/FavouriteCities";
export const context = createContext();

function App() {
  const [Query, setQuery] = useState("");
  const [id, setId] = useState("");
  const [city, setCity] = useState("");
  const [favouriteCitiesdata, setfavouriteCities] = useState([]);
  const [currentDayWeatherData, setcurrentDayWeatherData] = useState(null);
  const [weeklyWeatherData, setWeeklyWeatherData] = useState([]);
  const API_KEY = "3dda862b68989ef1dd87c929cb493640";
  //To get the live location
  useEffect(() => {
    fetch("http://ip-api.com/json")
      .then((res) => {
        res.json().then((data) => {
          setCity(data.city);
        });
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);
  return (
    <>
      <context.Provider
        value={{
          Query,
          city,
          id,
          setId,
          setCity,
          setQuery,
          currentDayWeatherData,
          setcurrentDayWeatherData,
          weeklyWeatherData,
          setWeeklyWeatherData,
          API_KEY,
          favouriteCitiesdata,
          setfavouriteCities,
        }}
      >
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<WeatherDashboard />} />
            <Route path="/favourites" element={<FavouriteCities />} />
          </Routes>
        </BrowserRouter>
      </context.Provider>
    </>
  );
}

export default App;
