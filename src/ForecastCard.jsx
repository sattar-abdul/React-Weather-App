export default function ForecastCard({ day, index }) {
  return (
    <div
      className="forecast-card"
      style={{ animationDelay: `${index * 0.12}s` }}
    >
      <p>
        {new Date(day.dt * 1000).toLocaleDateString("en-US", {
          weekday: "short",
        })}
      </p>

      <img
        src={`https://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png`}
        alt="icon"
      />

      <h3>{Math.round(day.main.temp)}°C</h3>
      <p className="desc">{day.weather[0].main}</p>
    </div>
  );
}