import requests
import json
import csv
from datetime import datetime

# ==========================================
# 1. Configuration & Thresholds
# ==========================================
TEMP_THRESHOLD = 35.0  # Celsius
RAIN_PROB_THRESHOLD = 60.0  # Percentage
WIND_THRESHOLD = 15.0  # km/h

# Using Open-Meteo API (Free, No API Key Required)
# Documentation: https://open-meteo.com/en/docs
BASE_URL = "https://api.open-meteo.com/v1/forecast"

# ==========================================
# 2. Main Logic
# ==========================================
def fetch_weather(lat, lon, city_name):
    print(f"\n[INFO] Fetching weather for {city_name}...")
    params = {
        "latitude": lat,
        "longitude": lon,
        "current_weather": "true",
        "hourly": "temperature_2m,relative_humidity_2m,precipitation_probability,wind_speed_10m",
        "timezone": "auto"
    }
    
    try:
        response = requests.get(BASE_URL, params=params)
        response.raise_for_status()
        data = response.json()
        return data
    except Exception as e:
        print(f"[ERROR] Failed to fetch data: {e}")
        return None

def analyze_and_alert(data, city_name):
    alerts = []
    current = data['current_weather']
    temp = current['temperature']
    wind = current['windspeed']
    
    # Current Stats
    print(f"--- Current Weather in {city_name} ---")
    print(f"Temperature: {temp}°C")
    print(f"Wind Speed: {wind} km/h")
    print(f"Weather Code: {current['weathercode']}")
    
    # Check Alerts
    if temp >= TEMP_THRESHOLD:
        alerts.append(f"CRITICAL HEAT ALERT: Current temperature {temp}°C exceeds threshold of {TEMP_THRESHOLD}°C!")
    
    if wind >= WIND_THRESHOLD:
        alerts.append(f"WIND WARNING: Current wind speed {wind} km/h exceeds threshold of {WIND_THRESHOLD} km/h.")
        
    # Forecast Check (Next 12 Hours)
    hourly_rain_prob = data['hourly']['precipitation_probability'][:12]
    max_rain_prob = max(hourly_rain_prob)
    if max_rain_prob >= RAIN_PROB_THRESHOLD:
        alerts.append(f"PREDICTIVE RAIN ALERT: {max_rain_prob}% probability of rain detected in the next 12 hours.")

    return alerts

def save_report(city_name, temp, alerts):
    filename = f"reports/weather_report_{datetime.now().strftime('%Y%m%d_%H%M')}.csv"
    try:
        with open(filename, mode='w', newline='') as file:
            writer = csv.writer(file)
            writer.writerow(["Timestamp", "City", "Temperature", "Alerts"])
            writer.writerow([datetime.now().isoformat(), city_name, temp, "; ".join(alerts) if alerts else "None"])
        print(f"\n[SUCCESS] Report saved to {filename}")
    except Exception as e:
        print(f"[ERROR] Could not save report: {e}")

# ==========================================
# 3. Execution
# ==========================================
def main():
    print("Welcome to SkyGuard: Weather Alert Simulation")
    
    # Preset Cities (Students can input their own)
    cities = {
        "1": {"name": "Delhi", "lat": 28.6, "lon": 77.2},
        "2": {"name": "Mumbai", "lat": 19.1, "lon": 72.9},
        "3": {"name": "London", "lat": 51.5, "lon": -0.1}
    }
    
    print("\nSelect City:")
    for key, val in cities.items():
        print(f"{key}. {val['name']}")
    
    choice = input("\nEnter choice (1-3): ")
    if choice not in cities:
        print("Invalid choice.")
        return
    
    city = cities[choice]
    weather_data = fetch_weather(city['lat'], city['lon'], city['name'])
    
    if weather_data:
        alerts = analyze_and_alert(weather_data, city['name'])
        
        if alerts:
            print("\n!!! ACTIVE ALERTS !!!")
            for alert in alerts:
                print(f"- {alert}")
        else:
            print("\n[INFO] No alerts triggered. Weather is stable.")
            
        save_report(city['name'], weather_data['current_weather']['temperature'], alerts)

if __name__ == "__main__":
    main()
