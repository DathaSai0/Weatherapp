import React, { useContext, useEffect, useState } from "react";
import "./Search.css";
import { context } from "../App";
import locationImg from "../assets/location.jpg"; // Correct the import

function Search() {
  const { Query, setQuery, setCity } = useContext(context);
  const [cityErr, setCityErr] = useState("");

  const cityValidation = () => {
    if (Query.trim() === "") {
      setCityErr("City name cannot be empty");
      return;
    }
    setCity(Query);
    setQuery("");
    setCityErr("");
  };

  const fetchLocation = () => {
    fetch("http://ip-api.com/json")
      .then((res) => res.json())
      .then((data) => {
        if (data.city) {
          setCity(data.city);
          setCityErr("");
        } else {
          setCityErr("Could not fetch location data");
        }
      })
      .catch((err) => {
        console.log(err);
        setCityErr("Error fetching location data");
      });
  };

  return (
    <>
      <div className="search-div">
        <input
          placeholder="Enter the name of the city"
          value={Query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <img
          src={locationImg}
          onClick={fetchLocation}
          className="img-location"
          alt="location icon"
        />
        <button onClick={cityValidation}>Search</button>
      </div>
      {cityErr && (
        <p style={{ color: "red", textAlign: "center" }}>{cityErr}</p>
      )}
    </>
  );
}

export default Search;
