import React, { useContext, useState } from "react";
import "./Search.css";
import { context } from "../App";
function Search() {
  const { Query, setQuery, setCity, currentDayWeatherData } =
    useContext(context);
  const [cityErr, setCityErr] = useState("");
  const cityValidation = () => {
    setCity(Query);
    setQuery("");
  };
  return (
    <>
      <div className="search-div">
        <input
          placeholder="Enter the name of the city "
          value={Query}
          onChange={(e) => {
            setQuery(e.target.value);
          }}
        />
        <button onClick={cityValidation}>Search</button>
      </div>
      {cityErr && <p style={{ color: "red" }}>{cityErr}</p>}
    </>
  );
}

export default Search;
