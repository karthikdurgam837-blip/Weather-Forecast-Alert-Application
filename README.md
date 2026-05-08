# SkyGuard: Weather Forecast & Alert Application

SkyGuard is a professional-grade weather monitoring system designed for real-time atmospheric analysis and predictive risk alerting. This project serves as a comprehensive portfolio piece for Python Developers, API Integration Specialists, and Data Analysts.

## 🌟 Key Features
- **Real-time Dashboard**: Interactive UI built with React & Recharts for live weather visualization.
- **Predictive Risk Engine**: Automated detection of Heatwaves, Heavy Rain, and Wind Storms using tiered threshold logic.
- **Global Reach**: Multi-city tracking support using the Open-Meteo REST API.
- **Reporting System**: Historical data tracking and automated report generation.
- **Cross-Platform Logic**: Includes both a High-Performance Web Dashboard and a Modular Python Script for course submission.

## 🛠️ Tech Stack
- **Frontend**: React (Vite), Tailwind CSS, Framer Motion, Recharts.
- **Backend**: Express.js (Node.js) for API orchestration.
- **Science Data**: Open-Meteo REST API.
- **Simulation/Script**: Python 3.x (Requests, CSV, Datetime).

## 📁 Project Structure
```
SkyGuard/
├── data/           # Simulated datasets
├── src/            # Full-stack Dashboard Source
│   ├── lib/        # Weather logic & types
│   └── App.tsx     # Main Dashboard UI
├── docs/           # Documentation & Python Course Script
├── reports/        # Generated CSV Reports
├── server.ts       # Express API Gateway
└── README.md
```

## 🚀 Installation & Setup

### 1. Web Dashboard
```bash
# Install dependencies
npm install

# Start development server
npm run dev
```
Open `http://localhost:3000` to view the SkyGuard Command Center.

### 2. Python Simulation (For Course Submission)
```bash
# Navigate to docs
cd docs

# Run the simulation script
python PYTHON_COURSE_SCRIPT.py
```

## 🧠 Technical Workflow
1. **Request**: The user selects a city; the frontend triggers a backend GET request.
2. **Fetch**: The Express server hits Open-Meteo with Geospatial coordinates (Lat/Lon).
3. **Analyze**: The backend parses 48-hour hourly data to check for precipitation probability > 60%.
4. **Alert**: If thresholds are met, a "Risk Object" is injected into the JSON response.
5. **Visualize**: Frontend renders a "Critical" or "Warn" badge and updates the atmospheric trend charts.

## 📊 Sample Output
| Metric | Value | Alert Triggered |
| :--- | :--- | :--- |
| Temperature | 38.5°C | CRITICAL HEAT |
| Rain Prob. | 72% | RAIN WARNING |
| Wind Speed | 18 km/h | WIND ADVISORY |

## 🎓 Interview Questions & Answers

**Q: How do you handle non-existent city data?**
*A: I implemented a robust Error Handler in the backend that returns a 400 Bad Request status with a clear message if coordinates are missing or the API provider is unreachable.*

**Q: Why choose the Open-Meteo API?**
*A: It provides high-resolution time-series data using a public endpoint, perfect for scalable simulations and quick deployment without complex credential management.*

**Q: Explain your Risk Engine logic.**
*A: It uses a Look-Ahead algorithm. Instead of just checking current data, it scans the next 12 hourly intervals to predict imminent rain, allowing for proactive rather than reactive alerts.*

---
*Created by Karthik D. for the 2024 Python Cloud Architecture Showcase.*
