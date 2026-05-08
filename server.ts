import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Route: Weather Fetching (Proxy to Open-Meteo)
  app.get("/api/weather", async (req, res) => {
    const { lat, lon, city } = req.query;
    try {
      if (!lat || !lon) {
        return res.status(400).json({ error: "Latitude and Longitude are required" });
      }
      
      const response = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&hourly=temperature_2m,relative_humidity_2m,dew_point_2m,apparent_temperature,precipitation_probability,precipitation,weather_code,pressure_msl,surface_pressure,cloud_cover,visibility,wind_speed_10m,wind_direction_10m,wind_gusts_10m,uv_index&daily=weather_code,temperature_2m_max,temperature_2m_min,apparent_temperature_max,apparent_temperature_min,sunrise,sunset,uv_index_max,precipitation_sum,precipitation_probability_max,wind_speed_10m_max&current_weather=true&timezone=auto&forecast_days=14`
      );
      
      if (!response.ok) throw new Error("Failed to fetch weather data");
      const data = await response.json();
      
      // AI/Simulation Logic for Alerts
      const alerts = [];
      const current = data.current_weather;
      
      if (current.temperature > 35) alerts.push({ type: "HEAT", level: "CRITICAL", msg: "Extreme heat warning. Avoid outdoor activity." });
      if (current.windspeed > 15) alerts.push({ type: "WIND", level: "WARN", msg: "Strong winds detected. Secure loose property." });
      
      const hourlyRain = data.hourly.precipitation_probability.slice(0, 24);
      if (hourlyRain.some((p: number) => p > 70)) {
        alerts.push({ type: "RAIN", level: "WARN", msg: "High probability of heavy rainfall soon." });
      }

      // Professional Simulation: AQI and Visibility Risk
      const aqi = Math.floor(Math.random() * 150) + 20; // Simulated AQI
      if (aqi > 100) {
        alerts.push({ type: "AIR", level: "WARN", msg: `Unhealthy air quality (AQI: ${aqi}). Sensitive groups should stay indoors.` });
      }

      res.json({ ...data, city, alerts, aqi });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // Mock endpoint for "Saved Reports"
  app.get("/api/reports", (req, res) => {
    res.json([
      { id: 1, city: "Delhi", date: "2024-05-01", status: "Severe Heat" },
      { id: 2, city: "Mumbai", date: "2024-05-02", status: "Heavy Rain Alert" },
    ]);
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
