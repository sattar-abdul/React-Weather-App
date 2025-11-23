import { useState } from "react";
import axios from "axios";
import "./Weather.css";
import WeatherSearch from "./WeatherSearch";
import WeatherHistory from "./WeatherHistory";
import WeatherCard from "./WeatherCard";
import ForecastList from "./ForecastList";

export default function WeatherApp() {
  const API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY;

  const [forecast, setForecast] = useState([]);
  const [city, setCity] = useState("");
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [history, setHistory] = useState(() => {
    const saved = localStorage.getItem("weatherHistory");
    return saved ? JSON.parse(saved) : [];
  });

  const fetchWeather = async (inputCity = city) => {
    setError("");
    if (!inputCity.trim()) {
      setError("Please enter a city name");
      return;
    }

    setLoading(true); // start loading

    try {
      const currentRes = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?q=${inputCity}&units=metric&appid=${API_KEY}`
      );
      setWeather(currentRes.data);

      const forecastRes = await axios.get(
        `https://api.openweathermap.org/data/2.5/forecast?q=${inputCity}&units=metric&appid=${API_KEY}`
      );

      const daily = forecastRes.data.list.filter((item) =>
        item.dt_txt.includes("12:00:00")
      );
      setForecast(daily);

      // update history
      setHistory((prev) => {
        const updated = [
          inputCity,
          ...prev.filter((item) => item !== inputCity),
        ].slice(0, 5);
        localStorage.setItem("weatherHistory", JSON.stringify(updated));
        return updated;
      });
    } catch {
      setError("Failed to fetch weather data. Please try again.");
    }

    setLoading(false); // stop loading
  };

  return (
    <div className="weather-container">
      <div className="app-layout">
        {/* LEFT SIDE - Search + History + Main Weather */}
        <div className="left-section">
          <WeatherSearch city={city} setCity={setCity} onSearch={fetchWeather} />

          {error && <p className="error">{error}</p>}

          <WeatherHistory
            history={history}
            onSelectCity={(item) => {
              setCity(item);
              fetchWeather(item);
            }}
          />

          <WeatherCard weather={weather} loading={loading} />
        </div>

        {/* RIGHT SIDE — FORECAST */}
        <ForecastList forecast={forecast} />
      </div>
    </div>
  );
}
