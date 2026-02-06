import { useState } from "react";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import WeatherApp from "./WeatherApp";
import { Switch, FormControlLabel } from "@mui/material";
import "./App.css";
import darkBackground from "/night_background.jpg";
import lightBackground from "/day_background.png";
import WeatherEffectsCanvas from "./WeatherEffectsCanvas";

export default function App() {
  const [mode, setMode] = useState("dark");
  const [weatherEffect, setWeatherEffect] = useState({
    type: "",
    heavyRain: false,
  });

  const theme = createTheme({
    palette: {
      mode: mode,
    },
  });

  const handleToggle = () => {
    setMode((prevMode) => (prevMode === "light" ? "dark" : "light"));
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <div
        className="app-root"
        data-theme={mode}
        style={{
          backgroundImage: `url(${
            mode === "dark" ? darkBackground : lightBackground
          })`,
          backgroundColor: mode === "dark" ? "#0b0f1a" : "#f3f6ff",
          backgroundSize: "cover",
          backgroundPosition: "center",
          minHeight: "100vh",
          transition: "background-color 0.5s ease, background-image 0.5s ease",
        }}
      >
        <WeatherEffectsCanvas effect={weatherEffect} />
        <div className="Toggler">
          <FormControlLabel
            control={
              <Switch checked={mode === "dark"} onChange={handleToggle} />
            }
            label={mode === "dark" ? "Dark Mode" : "Light Mode"}
          />
        </div>
        <WeatherApp onEffectChange={setWeatherEffect} />
      </div>
    </ThemeProvider>
  );
}
