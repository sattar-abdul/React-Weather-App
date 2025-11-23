const SkeletonCard = () => (
  <div className="weather-card skeleton">
    <div className="skeleton-title"></div>
    <div className="skeleton-icon"></div>
    <div className="skeleton-temp"></div>
    <div className="skeleton-details"></div>
  </div>
);

const getWeatherEffect = (weather) => {
  if (!weather) return "";

  const condition = weather.weather[0].main.toLowerCase();

  if (condition.includes("rain")) return "rain";
  if (condition.includes("snow")) return "snow";
  if (condition.includes("cloud")) return "clouds";
  if (condition.includes("clear")) return "clear";

  return "";
};

export default function WeatherCard({ weather, loading }) {
  if (loading) {
    return <SkeletonCard />;
  }

  if (!weather) {
    return null;
  }

  return (
    <div className={`weather-card fade-in ${getWeatherEffect(weather)}`}>
      <h2>
        {weather.name}, {weather.sys.country}
      </h2>

      <img
        src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
        alt="Weather icon"
      />

      <h1>{Math.round(weather.main.temp)}°C</h1>
      <p className="description">{weather.weather[0].description}</p>

      <div className="details">
        <p>Humidity: {weather.main.humidity}%</p>
        <p>Wind: {weather.wind.speed} km/h</p>
      </div>
    </div>
  );
}