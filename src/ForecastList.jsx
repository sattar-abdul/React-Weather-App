import ForecastCard from "./ForecastCard";

export default function ForecastList({ forecast }) {
  if (forecast.length === 0) return null;

  return (
    <div className="right-section">
      <div className="forecast-container">
        {forecast.map((day, index) => (
          <ForecastCard key={index} day={day} index={index} />
        ))}
      </div>
    </div>
  );
}