export default function WeatherSearch({ city, setCity, onSearch }) {
  return (
    <div className="search-row">
      <input
        type="text"
        placeholder="Search city..."
        value={city}
        onChange={(e) => setCity(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && onSearch()}
      />
      <button onClick={onSearch}>Search</button>
    </div>
  );
}