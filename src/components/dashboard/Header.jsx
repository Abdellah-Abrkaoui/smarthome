import React, { useState, useEffect } from "react";
import { auth } from "../firebase";
import { onAuthStateChanged } from "firebase/auth";
import { Sun } from "lucide-react";

const Header = () => {
  const [user, setUser] = useState(null);
  const [weather, setWeather] = useState({
    temp: "--",
    description: "Loading...",
  });

  useEffect(() => {
    // Listen to Firebase auth
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });

    // Fetch weather using .env API key
    const fetchWeather = async () => {
      try {
        const apiKey = import.meta.env.VITE_WEATHER_API_KEY;
        if (!apiKey) {
          throw new Error("Weather API key missing");
        }

        const res = await fetch(
          `https://api.openweathermap.org/data/2.5/weather?q=Casablanca,MA&units=metric&appid=${apiKey}`
        );

        if (!res.ok) throw new Error("Weather fetch failed");

        const data = await res.json();
        setWeather({
          temp: Math.round(data.main.temp),
          description: data.weather[0].description,
        });
      } catch (err) {
        console.error("Weather error:", err);
        setWeather({
          temp: "--",
          description: "Weather unavailable",
        });
      }
    };

    fetchWeather();
    return () => unsubscribe();
  }, []);

  const displayName = user?.displayName || user?.email?.split("@")[0] || "User";

  return (
    <header className="bg-white shadow-sm p-6 mb-6 flex items-center justify-between">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-md">
          {displayName.charAt(0).toUpperCase()}
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            Hello, {displayName}!
          </h1>
          <p className="text-sm text-gray-500">
            Welcome back to your smart home
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2 bg-gray-50 px-4 py-2 rounded-full text-sm font-medium text-gray-700">
        <span className="text-yellow-500">
          <Sun className="w-5 h-5" />
        </span>
        <span>Outdoor</span>
        <span className="ml-1 font-bold text-gray-900">{weather.temp}°C</span>
      </div>
    </header>
  );
};

export default Header;
