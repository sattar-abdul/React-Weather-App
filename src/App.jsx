import { useState } from "react";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import WeatherApp from "./WeatherApp";
import { Switch, FormControlLabel } from "@mui/material";
import "./App.css";
import darkBackground from "/night_background.jpg";
import lightBackground from "/day_background.png";

export default function App() {
  const [mode, setMode] = useState("dark");

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
        style={{
          backgroundImage: `url(${
            mode === "dark" ? darkBackground : lightBackground
          })`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          minHeight: "100vh",
          transition: "0.5s",
        }}
      >
        <div className="Toggler">
          <FormControlLabel
            control={
              <Switch checked={mode === "dark"} onChange={handleToggle} />
            }
            label={mode === "dark" ? "Dark Mode" : "Light Mode"}
          />
        </div>
        <WeatherApp />
      </div>
    </ThemeProvider>
  );
}
