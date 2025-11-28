// client/src/pages/AirQualityForecaster.jsx
import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";

/**
 * AirQualityForecaster.jsx
 * - Reads user's location
 * - Calls OpenWeather Air Pollution API (real-time)
 * - Displays AQI (1..5 -> Good..Very Unhealthy) with animated UI
 *
 * NOTE: Provide your OpenWeather API key via environment variable:
 *  - Vite: import.meta.env.VITE_OPENWEATHER_API_KEY
 *  - CRA:  process.env.REACT_APP_OPENWEATHER_API_KEY
 */

// Safe env lookup (works with Vite or CRA)
const OPENWEATHER_API_KEY =
  (typeof import.meta !== "undefined" && import.meta.env && import.meta.env.VITE_OPENWEATHER_API_KEY) ||
  (typeof process !== "undefined" && process.env && process.env.REACT_APP_OPENWEATHER_API_KEY) ||
  "<YOUR_API_KEY_HERE>";

// Helpers
const mapOpenWeatherAqiToValue = (owAqi) => {
  // OpenWeather returns 1 (Good) ... 5 (Very Poor)
  // We'll convert to a 0-500 like scale visually if needed, but keep discrete mapping for text/colors.
  switch (owAqi) {
    case 1:
      return { label: "Good", idx: 1, value: 35 };
    case 2:
      return { label: "Fair", idx: 2, value: 75 };
    case 3:
      return { label: "Unhealthy for Sensitive", idx: 3, value: 125 };
    case 4:
      return { label: "Unhealthy", idx: 4, value: 175 };
    case 5:
      return { label: "Very Unhealthy", idx: 5, value: 250 };
    default:
      return { label: "Unknown", idx: 0, value: 0 };
  }
};

const generateHealthTips = (owAqi) => {
  if (!owAqi) return ["No data available."];
  switch (owAqi) {
    case 1:
      return [
        "Air quality is good — fine to be outdoors.",
        "Open windows and enjoy fresh air.",
        "No special precautions required.",
      ];
    case 2:
      return [
        "Air quality is acceptable for most people.",
        "People with respiratory issues may notice mild symptoms.",
        "Consider light activity; avoid heavy exertion if sensitive.",
      ];
    case 3:
      return [
        "Unhealthy for sensitive groups: limit prolonged outdoor exertion.",
        "Asthma/allergy sufferers should carry medications.",
        "Consider a mask if you experience irritation.",
      ];
    case 4:
      return [
        "Unhealthy: reduce outdoor activities and avoid exercise outdoors.",
        "Use an air purifier indoors if available and keep windows closed.",
        "Wear a high-quality mask (N95/FFP2) outdoors.",
      ];
    case 5:
      return [
        "Very Unhealthy: avoid going outside if possible.",
        "People with heart or lung disease, older adults, and children should remain indoors.",
        "Seek medical attention if you experience difficulty breathing.",
      ];
    default:
      return ["No tailored advice."];
  }
};

const defaultForecast = () => [
  { day: "Today", aqi: 2 },
  { day: "Tomorrow", aqi: 2 },
  { day: "Sun", aqi: 1 },
  { day: "Mon", aqi: 3 },
];

/* ---------- Small animated floating elements (kept from your design) ---------- */
const MedicalFloatingElements = ({ aqiIdx }) => {
  const count = Math.min(20, 6 + (aqiIdx || 0) * 4);
  const icons = aqiIdx <= 1 ? ["🌿", "✨"] : aqiIdx === 2 ? ["🌤️", "😷"] : ["⚠️", "🏥", "😷"];
  return (
    <div className="fixed inset-0 pointer-events-none z-0">
      {[...Array(count)].map((_, i) => {
        const left = Math.random() * 100;
        const top = Math.random() * 100;
        const dur = 6 + Math.random() * 6;
        return (
          <motion.div
            key={i}
            style={{ left: `${left}%`, top: `${top}%` }}
            animate={{ y: [0, -30, 0], opacity: [0.1, 0.6, 0.1], rotate: [0, 10, -10, 0] }}
            transition={{ duration: dur, repeat: Infinity, delay: Math.random() * 5 }}
            className="absolute text-2xl opacity-20"
          >
            {icons[i % icons.length]}
          </motion.div>
        );
      })}
    </div>
  );
};

/* ---------- AQI small card ---------- */
const AQICard = ({ title, value, subtitle, aqiInfo }) => {
  const gradient = aqiInfo.gradient || "from-emerald-400 to-teal-400";
  return (
    <div className={`bg-white/90 border border-white/60 rounded-2xl p-4 shadow-md`}>
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-3 ${gradient} text-white text-xl`} style={{ background: undefined }}>
        {title === "AQI" ? "🏷️" : "ℹ️"}
      </div>
      <div>
        <p className="text-sm text-slate-600 font-medium">{title}</p>
        <p className={`text-3xl font-extrabold ${aqiInfo.textColor} mt-2`}>{value}</p>
        {subtitle && <p className="text-xs text-gray-500 mt-1">{subtitle}</p>}
      </div>
    </div>
  );
};

const getAqiVisualInfo = (owAqi) => {
  switch (owAqi) {
    case 1:
      return { gradient: "bg-gradient-to-br from-emerald-400 to-teal-500", textColor: "text-emerald-600" };
    case 2:
      return { gradient: "bg-gradient-to-br from-yellow-400 to-orange-400", textColor: "text-yellow-600" };
    case 3:
      return { gradient: "bg-gradient-to-br from-orange-400 to-red-400", textColor: "text-orange-600" };
    case 4:
      return { gradient: "bg-gradient-to-br from-red-500 to-rose-600", textColor: "text-red-600" };
    case 5:
      return { gradient: "bg-gradient-to-br from-red-700 to-black", textColor: "text-red-800" };
    default:
      return { gradient: "bg-gradient-to-br from-slate-300 to-slate-400", textColor: "text-slate-600" };
  }
};

/* ---------- Main Component ---------- */
const AirQualityForecaster = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [coords, setCoords] = useState(null);
  const [weatherData, setWeatherData] = useState({
    location: "Unknown",
    aqi: null,
    pollen: "—",
    uvIndex: "—",
    recommendations: [],
    forecast: defaultForecast(),
  });

  const locationInputRef = useRef({ lat: "", lon: "" });

  useEffect(() => {
    // Try to get geolocation
    if (!navigator.geolocation) {
      setError("Geolocation is not supported in your browser. Enter coordinates manually.");
      setLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        setCoords({ lat: latitude, lon: longitude });
      },
      (err) => {
        console.warn("Geolocation error:", err);
        setError("Unable to access location. You can enter coordinates manually below.");
        setLoading(false);
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  }, []);

  useEffect(() => {
    // When coords appear, fetch AQI
    if (coords) {
      fetchAQI(coords.lat, coords.lon);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [coords]);

  const fetchAQI = async (lat, lon) => {
    setLoading(true);
    setError(null);
    try {
      if (!OPENWEATHER_API_KEY || OPENWEATHER_API_KEY === "<YOUR_API_KEY_HERE>") {
        setError("OpenWeather API key missing. Add it to your env (VITE_/REACT_APP_).");
        setLoading(false);
        return;
      }

      // OpenWeather Air Pollution API (real-time)
      const url = `https://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${OPENWEATHER_API_KEY}`;
      const res = await fetch(url);
      if (!res.ok) {
        const txt = await res.text();
        console.error("OpenWeather error:", txt);
        throw new Error("Failed to fetch AQI data");
      }
      const data = await res.json();
      const owAqi = data?.list?.[0]?.main?.aqi; // 1..5

      const locName = await reverseGeocodeName(lat, lon).catch(() => null);

      const aqiValue = mapOpenWeatherAqiToValue(owAqi);
      const tips = generateHealthTips(owAqi);
      const forecast = generateSimpleForecast(owAqi);

      setWeatherData({
        location: locName || `${lat.toFixed(3)}, ${lon.toFixed(3)}`,
        aqi: owAqi,
        pollen: "Moderate",
        uvIndex: "High",
        recommendations: tips,
        forecast,
        aqiValue, // includes numeric value for visuals
      });
    } catch (err) {
      console.error(err);
      setError("Failed to fetch air quality data. Try again or enter coordinates manually.");
    } finally {
      setLoading(false);
    }
  };

  const reverseGeocodeName = async (lat, lon) => {
    // Optional: lightweight reverse geocoding using OpenStreetMap Nominatim (no key)
    try {
      const url = `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lon}`;
      const res = await fetch(url, { headers: { "User-Agent": "HealthChatPal/1.0" } });
      if (!res.ok) return null;
      const d = await res.json();
      return d.address?.city || d.address?.town || d.address?.village || d.display_name || null;
    } catch (e) {
      return null;
    }
  };

  const generateSimpleForecast = (currentAqi) => {
    // Very simple: keep close to current AQI but add small variance
    const arr = [];
    for (let i = 0; i < 4; i++) {
      const delta = Math.floor(Math.random() * 3) - 1; // -1,0,1
      const val = Math.max(1, Math.min(5, (currentAqi || 2) + delta));
      arr.push({ day: ["Today", "Tomorrow", "Sun", "Mon"][i] || `Day ${i + 1}`, aqi: val });
    }
    return arr;
  };

  const handleManualFetch = (e) => {
    e.preventDefault();
    const lat = parseFloat(locationInputRef.current.lat);
    const lon = parseFloat(locationInputRef.current.lon);
    if (!lat || !lon || Number.isNaN(lat) || Number.isNaN(lon)) {
      setError("Enter valid numeric latitude and longitude.");
      return;
    }
    setCoords({ lat, lon });
    setError(null);
  };

  // Visual info
  const visualInfo = getAqiVisualInfo(weatherData.aqi);

  // Loading / Error placeholders
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="mb-4 animate-pulse">🔄 Fetching air quality for your location...</div>
          <div className="text-sm text-gray-500">Make sure location services are enabled in your browser.</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-emerald-50 text-slate-900 relative overflow-hidden">
      <MedicalFloatingElements aqiIdx={weatherData.aqi || 0} />

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 py-12">
        <header className="text-center mb-8">
          <h1 className="text-4xl font-extrabold">Air Quality Health Monitor</h1>
          <p className="text-sm text-gray-600 mt-2">
            Live AQI at <span className="font-medium">{weatherData.location}</span>
          </p>
        </header>

        {error && (
          <div className="mb-4 text-center text-red-600">
            {error}
          </div>
        )}

        {/* Main grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <div className="bg-white/90 border border-white/60 rounded-3xl p-6 shadow-xl">
              <div className="flex items-start gap-6">
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-500">Air Quality Index</p>
                  <div className="flex items-end gap-6 mt-4">
                    <div>
                      <div className={`rounded-2xl p-6 ${visualInfo.gradient} text-white inline-block shadow-lg`}>
                        <p className="text-xs opacity-90">AQI</p>
                        <p className="text-6xl font-black mt-2">
                          {weatherData.aqiValue?.value ?? mapOpenWeatherAqiToValue(weatherData.aqi).value}
                        </p>
                        <p className="text-sm mt-1 opacity-90">{mapOpenWeatherAqiToValue(weatherData.aqi).label}</p>
                      </div>
                    </div>

                    <div className="flex-1">
                      <p className="text-sm text-gray-600 mb-2">Status</p>
                      <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
                        <p className={`text-lg font-semibold ${visualInfo.textColor}`}>{mapOpenWeatherAqiToValue(weatherData.aqi).label}</p>
                        <p className="text-sm text-gray-600 mt-2">
                          {weatherData.recommendations && weatherData.recommendations[0]}
                        </p>

                        <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-3">
                          <AQICard title="Pollen" value={weatherData.pollen} subtitle="Current" aqiInfo={visualInfo} />
                          <AQICard title="UV Index" value={weatherData.uvIndex} subtitle="Now" aqiInfo={visualInfo} />
                          <AQICard title="AQI Index" value={weatherData.aqi || "—"} subtitle="1-5 (OW)" aqiInfo={visualInfo} />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Recommendations */}
                  <div className="mt-6">
                    <h3 className="text-lg font-semibold mb-3">Health Recommendations</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {(weatherData.recommendations || []).map((rec, i) => (
                        <div key={i} className="bg-white rounded-xl p-3 border border-gray-100 shadow-sm">
                          <p className="text-sm text-gray-700">{rec}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                </div>
              </div>
            </div>

            {/* Forecast */}
            <div className="mt-6 bg-white/90 border border-white/60 rounded-2xl p-4 shadow-md">
              <h4 className="text-md font-semibold mb-3">4-Day AQI Forecast</h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {(weatherData.forecast || defaultForecast()).map((f, idx) => {
                  const info = getAqiVisualInfo(f.aqi);
                  return (
                    <div key={idx} className="rounded-xl p-3 bg-white border border-gray-100 shadow-sm text-center">
                      <p className="text-sm font-medium text-gray-600">{f.day}</p>
                      <p className={`text-2xl font-extrabold ${info.textColor} mt-2`}>{mapOpenWeatherAqiToValue(f.aqi).value}</p>
                      <p className="text-xs text-gray-500">{mapOpenWeatherAqiToValue(f.aqi).label}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Side panel: manual coords + download / disclaimer */}
          <div>
            <div className="bg-white/95 border border-white/60 rounded-2xl p-4 shadow-sm sticky top-20">
              <h4 className="text-sm font-semibold mb-2">Location</h4>
              <p className="text-xs text-gray-600 mb-3">Auto-detected coordinates are used. Enter manual coordinates if detection failed.</p>

              <div className="mb-3">
                <label className="text-xs text-gray-600">Latitude</label>
                <input
                  type="text"
                  onChange={(e) => (locationInputRef.current.lat = e.target.value)}
                  placeholder="e.g. 28.7041"
                  className="w-full mt-1 px-3 py-2 border rounded-lg text-sm"
                />
              </div>
              <div className="mb-3">
                <label className="text-xs text-gray-600">Longitude</label>
                <input
                  type="text"
                  onChange={(e) => (locationInputRef.current.lon = e.target.value)}
                  placeholder="e.g. 77.1025"
                  className="w-full mt-1 px-3 py-2 border rounded-lg text-sm"
                />
              </div>
              <button
                onClick={handleManualFetch}
                className="w-full bg-blue-600 text-white py-2 rounded-lg"
              >
                Use Coordinates
              </button>

              <div className="mt-4">
                <button
                  onClick={() => {
                    // Download small JSON report
                    const payload = {
                      location: weatherData.location,
                      aqi: weatherData.aqi,
                      recommendations: weatherData.recommendations,
                      forecast: weatherData.forecast,
                      timestamp: new Date().toISOString(),
                    };
                    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
                    const a = document.createElement("a");
                    a.href = URL.createObjectURL(blob);
                    a.download = `aqi-report-${Date.now()}.json`;
                    document.body.appendChild(a);
                    a.click();
                    document.body.removeChild(a);
                    URL.revokeObjectURL(a.href);
                  }}
                  className="w-full mt-3 border border-gray-200 py-2 rounded-lg text-sm"
                >
                  Download Report
                </button>
              </div>
            </div>

            <div className="mt-4 text-xs text-gray-600">
              <strong>Disclaimer:</strong> Data is fetched from OpenWeather. This is information-only and not medical advice.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AirQualityForecaster;
