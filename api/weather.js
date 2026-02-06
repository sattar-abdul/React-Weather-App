const handler = async (req, res) => {
  const apiKey = process.env.OPENWEATHER_API_KEY;
  if (!apiKey) {
    res.status(500).json({ error: "Missing OPENWEATHER_API_KEY" });
    return;
  }

  const city = req.query?.city;
  if (!city) {
    res.status(400).json({ error: "Missing city parameter" });
    return;
  }

  const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(
    city
  )}&units=metric&appid=${apiKey}`;

  try {
    const response = await fetch(url);
    const data = await response.json();
    res.status(response.status).json(data);
  } catch {
    res.status(502).json({ error: "Upstream request failed" });
  }
};

export default handler;
