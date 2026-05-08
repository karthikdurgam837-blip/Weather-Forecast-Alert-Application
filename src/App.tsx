import React, { useState, useEffect } from 'react';
import { 
  Cloud, CloudRain, Sun, Wind, AlertCircle, 
  Map as MapIcon, BarChart3, Settings, 
  Search, Bell, FileText, Github, 
  ChevronRight, Thermometer, Droplets, Info,
  Navigation, MapPin, MousePointer2, Sunrise, Sunset,
  Eye, Gauge, Umbrella, Zap, Activity
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer 
} from 'recharts';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { CITIES, WeatherData, Alert, getWeatherIcon } from './lib/weather';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export default function App() {
  const [selectedCity, setSelectedCity] = useState(CITIES[0]);
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(false);
  const [showCityList, setShowCityList] = useState(false);
  const [isLocating, setIsLocating] = useState(false);
  const [logs, setLogs] = useState<string[]>([]);
  
  useEffect(() => {
    const messages = [
      "Initializing SkyGuard Core...",
      "Syncing with Meteo-SAT-9...",
      "Recalculating atmospheric pressure...",
      "Optimizing data stream...",
      "Security handshake successful.",
      "Parsing hyperlocal flux..."
    ];
    let i = 0;
    const interval = setInterval(() => {
      setLogs(prev => [messages[i % messages.length], ...prev.slice(0, 4)]);
      i++;
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    fetchWeather();
  }, [selectedCity]);

  const handleLiveLocation = () => {
    if (!navigator.geolocation) return;
    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setSelectedCity({
          name: "Local Position",
          lat: pos.coords.latitude,
          lon: pos.coords.longitude
        });
        setIsLocating(false);
      },
      (err) => {
        console.error(err);
        setIsLocating(false);
      }
    );
  };

  const fetchWeather = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/weather?lat=${selectedCity.lat}&lon=${selectedCity.lon}&city=${selectedCity.name}`);
      const data = await res.json();
      setWeatherData(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (!weatherData && loading) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-[#0f172a]">
        <div className="w-10 h-10 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin" />
      </div>
    );
  }

const current = weatherData?.current_weather;

  const getTheme = (temp?: number, code?: number) => {
    if (temp === undefined || code === undefined) return { 
      bg: 'bg-[#0f172a]', 
      card: 'bg-[#1e293b]', 
      accent: 'text-blue-400', 
      border: 'border-[#334155]',
      button: 'bg-blue-600 hover:bg-blue-500'
    };
    
    // High Heat (> 30°C)
    if (temp > 30) return { 
      bg: 'bg-[#1a120b]', 
      card: 'bg-[#2d2417]', 
      accent: 'text-orange-400', 
      border: 'border-[#453625]',
      button: 'bg-orange-600 hover:bg-orange-500'
    };
    
    // Rain/Storms (codes 51-99)
    if (code >= 51) return { 
      bg: 'bg-[#0b0e14]', 
      card: 'bg-[#151921]', 
      accent: 'text-indigo-400', 
      border: 'border-[#262c38]',
      button: 'bg-indigo-600 hover:bg-indigo-500'
    };
    
    // Clear/Sunny (code 0)
    if (code === 0) return { 
      bg: 'bg-[#071324]', 
      card: 'bg-[#0f1f36]', 
      accent: 'text-sky-400', 
      border: 'border-[#1e324a]',
      button: 'bg-sky-600 hover:bg-sky-500'
    };
    
    // Default / Cloudy
    return { 
      bg: 'bg-[#0f172a]', 
      card: 'bg-[#1e293b]', 
      accent: 'text-slate-400', 
      border: 'border-[#334155]',
      button: 'bg-blue-600 hover:bg-blue-500'
    };
  };

  const theme = getTheme(current?.temperature, current?.weathercode);

  return (
    <div className={cn("min-h-screen transition-colors duration-1000 font-sans selection:bg-blue-500/30 pb-20", theme.bg, theme.accent)}>
      <div className="max-w-[1400px] mx-auto p-4 md:p-8 space-y-6">
        
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/5 pb-6">
          <div className="flex flex-col md:flex-row md:items-center gap-6">
            <div className="flex items-center gap-3">
              <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center border shadow-lg", theme.card, theme.border)}>
                <Activity size={24} className="text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white tracking-tighter">SKYGUARD<span className="text-slate-500 font-normal">.PRIME</span></h1>
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">System Online</span>
                </div>
              </div>
            </div>

            <div className="relative">
              <button 
                onClick={() => setShowCityList(!showCityList)}
                className={cn("flex items-center gap-2 px-4 py-2 border rounded-lg transition-colors text-sm font-semibold shadow-sm", theme.card, theme.border)}
              >
                <MapPin size={16} className={theme.accent} />
                <span className="text-white">{selectedCity.name}</span>
                <ChevronRight size={14} className={cn("text-slate-500 transition-transform", showCityList && "rotate-90")} />
              </button>
              
              <AnimatePresence>
                {showCityList && (
                  <motion.div 
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 5 }}
                    className={cn("absolute top-full left-0 mt-2 w-56 border rounded-xl shadow-2xl z-50 p-2", theme.card, theme.border)}
                  >
                    {CITIES.map(city => (
                      <button
                        key={city.name}
                        onClick={() => { setSelectedCity(city); setShowCityList(false); }}
                        className="w-full text-left px-3 py-2 hover:bg-white/5 rounded-lg text-sm transition-colors text-white"
                      >
                        {city.name}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          <div className="flex items-center gap-3">
             {weatherData?.alerts.map((alert, i) => (
                <div key={i} className="flex items-center gap-2 px-3 py-1.5 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-xs font-bold">
                  <AlertCircle size={14} />
                  <span>{alert.msg}</span>
                </div>
             ))}
             {!weatherData?.alerts.length && (
                <div className={cn("flex items-center gap-2 px-3 py-1.5 border rounded-lg text-xs font-bold", theme.card.replace('bg-', 'bg-opacity-10 '), theme.border)}>
                  <Activity size={14} />
                  <span>Monitoring: Nominal</span>
                </div>
             )}
          </div>
        </header>

        {/* Advanced Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          
          {/* Main Telemetry Panel */}
          <div className={cn("md:col-span-12 lg:col-span-8 p-10 flex flex-col justify-between min-h-[450px] border rounded-2xl shadow-2xl relative overflow-hidden", theme.card, theme.border)}>
             {/* Technical Grid Overlay */}
             <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '30px 30px' }} />
             
             <div className="relative z-10 flex flex-col md:flex-row md:items-start justify-between gap-8">
               <div>
                 <div className="flex items-center gap-2 mb-4">
                    <span className="text-[10px] font-black bg-blue-500/20 text-blue-400 px-2 py-0.5 rounded tracking-tighter">PHASE_01</span>
                    <div className="h-[1px] w-12 bg-white/10" />
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Atmospheric Analysis</span>
                 </div>
                 
                 <div className="flex flex-col mb-10">
                   <div className="text-[120px] font-black leading-none tracking-tighter text-white -ml-2">
                     {Math.round(current?.temperature ?? 0)}<span className="text-4xl text-slate-500 align-top mt-8 inline-block select-none">°C</span>
                   </div>
                   <div className="flex items-center gap-4 mt-2">
                     <div className="text-4xl">{getWeatherIcon(current?.weathercode ?? 0)}</div>
                     <div>
                        <div className="text-2xl font-bold text-white uppercase tracking-tighter">Vortex Status: Low</div>
                        <div className="text-sm text-slate-400 font-medium">Hyperlocal precision within 500m</div>
                     </div>
                   </div>
                 </div>
               </div>

               {/* Side Diagnostics */}
               <div className="w-full md:w-64 space-y-6">
                  <div className="p-4 bg-black/20 rounded-xl border border-white/5 space-y-4">
                    <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Environment Risk</div>
                    <div className="space-y-2">
                       <RiskLevel label="Visibility" value={95} color="bg-emerald-500" />
                       <RiskLevel label="Stability" value={82} color="bg-blue-500" />
                       <RiskLevel label="Turbulence" value={14} color="bg-amber-500" />
                    </div>
                  </div>

                  <div className="p-4 bg-black/20 rounded-xl border border-white/5">
                    <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-3 text-center">System Logs</div>
                    <div className="font-mono text-[9px] space-y-1 h-20 overflow-hidden text-blue-400/70">
                       {logs.map((log, idx) => (
                         <div key={idx} className={cn("flex gap-2", idx === 0 && "text-blue-200")}>
                           <span>{idx === 0 ? ">>" : "> "}</span>
                           <span>{log}</span>
                         </div>
                       ))}
                    </div>
                  </div>
               </div>
             </div>

             <div className="grid grid-cols-2 md:grid-cols-6 gap-8 pt-10 border-t border-white/10 relative z-10">
               <MiniMetric icon={<Umbrella className="text-blue-400" size={14}/>} label="Rain" value={`${weatherData?.hourly.precipitation_probability[0]}%`} />
               <MiniMetric icon={<Wind className="text-emerald-400" size={14}/>} label="Wind" value={`${current?.windspeed} km/h`} />
               <MiniMetric icon={<Droplets className="text-sky-400" size={14}/>} label="Humid" value={`${weatherData?.hourly.relative_humidity_2m[0]}%`} />
               <MiniMetric icon={<Sun className="text-amber-400" size={14}/>} label="Index" value="0.2" />
               <MiniMetric icon={<Gauge className="text-purple-400" size={14}/>} label="Press" value={`${weatherData?.hourly.pressure_msl[0]}`} />
               <MiniMetric icon={<Activity className="text-pink-400" size={14}/>} label="AQI" value={(weatherData as any)?.aqi ?? '24'} />
             </div>
          </div>

          {/* Sync & Radar Visualization */}
          <div className={cn("md:col-span-12 lg:col-span-4 p-8 flex flex-col justify-between border rounded-2xl shadow-2xl relative overflow-hidden", theme.card, theme.border)}>
             <div>
                <div className="flex items-center justify-between mb-8">
                   <div className="flex flex-col">
                     <h3 className={cn("text-sm font-black uppercase tracking-tighter", theme.accent)}>Geo-Positioning</h3>
                     <span className="text-[9px] text-slate-500 font-bold uppercase tracking-[0.2em]">Live Telemetry Feed</span>
                   </div>
                   <div className="w-12 h-12 rounded-xl bg-black/30 border border-white/5 flex items-center justify-center">
                     <Navigation size={20} className={cn(isLocating && "animate-spin")} />
                   </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="w-1 h-12 bg-blue-500 rounded-full" />
                    <div className="flex flex-col gap-1 flex-1">
                      <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Latitional Node</span>
                      <span className="text-2xl font-bold text-white tabular-nums tracking-tighter">{selectedCity.lat.toFixed(4)}°</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="w-1 h-12 bg-purple-500 rounded-full" />
                    <div className="flex flex-col gap-1 flex-1">
                      <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Longitudinal Node</span>
                      <span className="text-2xl font-bold text-white tabular-nums tracking-tighter">{selectedCity.lon.toFixed(4)}°</span>
                    </div>
                  </div>
                </div>
             </div>

             <div className="mt-12 space-y-4">
                <button 
                  onClick={handleLiveLocation}
                  disabled={isLocating}
                  className={cn("w-full py-5 text-white rounded-2xl text-xs font-black transition-all shadow-xl flex items-center justify-center gap-3 uppercase tracking-[0.2em] transform active:scale-[0.98]", theme.button)}
                >
                  {isLocating ? <Activity size={18} className="animate-spin" /> : <MapPin size={18} />}
                  {isLocating ? "Initiating Sync..." : "Sync Global Position"}
                </button>
             </div>
          </div>
        </div>

        {/* Forecast */}
        <section className={cn("p-6 border rounded-xl shadow-lg", theme.card, theme.border)}>
           <div className="flex items-center justify-between mb-6 px-2">
             <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400">14-Day Cycle</h3>
           </div>
           <div className="flex gap-4 overflow-x-auto no-scrollbar pb-2">
             {weatherData?.daily.time.map((time, i) => (
                <div key={time} className="flex-shrink-0 w-24 bg-black/10 border border-white/5 p-4 rounded-xl flex flex-col items-center text-center">
                   <div className="text-[10px] font-bold text-slate-500 uppercase mb-2">
                     {i === 0 ? "Now" : new Date(time).toLocaleDateString('en-US', { weekday: 'short' })}
                   </div>
                   <div className="text-2xl mb-3">{getWeatherIcon(weatherData.daily.weather_code[i])}</div>
                   <div className="text-sm font-bold text-white">{Math.round(weatherData.daily.temperature_2m_max[i])}°</div>
                   <div className="text-[9px] text-blue-400 font-bold mt-2">{weatherData.daily.precipitation_probability_max[i]}%</div>
                </div>
             ))}
           </div>
        </section>

        {/* Charts */}
        <div className={cn("overflow-hidden border rounded-xl shadow-lg", theme.card, theme.border)}>
           <div className="p-8">
             <div className="mb-8">
                <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-1">Atmospheric Trend</h3>
                <div className="text-2xl font-bold text-white">24-Hour Variance</div>
             </div>

             <div className="h-[200px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={weatherData?.hourly.time.slice(0, 24).map((time, i) => ({
                    time: new Date(time).getHours() + 'h',
                    temp: weatherData.hourly.temperature_2m[i],
                  }))}>
                    <defs>
                      <linearGradient id="chartColor" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.2}/>
                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
                    <XAxis dataKey="time" stroke="#475569" fontSize={10} tickLine={false} axisLine={false} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px', fontSize: '10px' }}
                    />
                    <Area type="monotone" dataKey="temp" stroke="#3b82f6" fillOpacity={1} fill="url(#chartColor)" strokeWidth={2} isAnimationActive={false} />
                  </AreaChart>
                </ResponsiveContainer>
             </div>
           </div>
        </div>

      </div>
    </div>
  );
}

function MiniMetric({ icon, label, value }: { icon: React.ReactNode, label: string, value: string }) {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-2 text-slate-500">
        {icon}
        <span className="text-[9px] font-black uppercase tracking-widest leading-none">{label}</span>
      </div>
      <div className="text-sm font-bold text-white tabular-nums">{value}</div>
    </div>
  );
}

function RiskLevel({ label, value, color }: { label: string, value: number, color: string }) {
  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between text-[9px] font-bold text-slate-500 uppercase tracking-tighter">
        <span>{label}</span>
        <span className="text-white font-mono">{value}%</span>
      </div>
      <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
        <div className={cn("h-full rounded-full transition-all duration-1000", color)} style={{ width: `${value}%` }} />
      </div>
    </div>
  );
}
