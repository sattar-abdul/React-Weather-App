export default function WeatherHistory({ history, onSelectCity }) {
  if (history.length === 0) return null;

  return (
    <div className="history-container">
      {history.map((item, index) => (
        <button
          key={index}
          className="history-btn"
          onClick={() => onSelectCity(item)}
        >
          {item}
        </button>
      ))}
    </div>
  );
}