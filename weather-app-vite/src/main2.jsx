import {useEffect, useState} from 'react';
import './Main.css';

function Main() {
    // State variables
    const [city,setCity] = useState("");
    const [search,setSearch] = useState("");
    const [loading,setLoading] = useState(false);
    const [weather,setWeather] = useState(null);
    const [error,setError] = useState("");
    const [weatherLogs, setWeatherLogs] = useState([]);

    // Geolocation state
    const [coords, setCoords] = useState(null);
    
    // Search history state
    const [searchHistory, setSearchHistory] = useState(()=> {
      const saved = localStorage.getItem("searchHistory");
      return saved ? JSON.parse(saved) : [];
    });
    // Unit state
    const [unit, setUnit] = useState("metric");

    const [hasUsedCoords, setHasUsedCoords] = useState(false);

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [token, setToken] = useState(localStorage.getItem("token") || "");

    const apiKey = import.meta.env.VITE_WEATHER_API_KEY;

    const handleInput = (e) => {
        setSearch(e.target.value);
    }

    // Theme state
    const [theme, setTheme] = useState(() => {
      return localStorage.getItem("weather_theme") || "light";
    });

    useEffect(() => {
      document.body.className = ""; // clear previous
      document.body.classList.add(`${theme}-mode`);
    }, [theme]);

    const [favorites, setFavorites] = useState(() => {
      const saved = localStorage.getItem("weather_favorites");
      return saved ? JSON.parse(saved) : [];
    });
    

    const handleSearch = () => {
      if (search) {
        setCity(search); 
      }
    };

    const handleRegister = () => {
      fetch("http://localhost:8000/api/register/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.message) alert("Registered! Now log in.");
          else alert(data.error || "Registration failed.");
        });
    };

    const handleLogin = () => {
      fetch("http://localhost:8000/api/token/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.access) {
            setToken(data.access);
            localStorage.setItem("token", data.access);
            alert("Login successful");
          } else {
            alert("Login failed");
          }
        });
    };

    useEffect(() => {
      if (city==="") return;
      setLoading(true);
      setError("");

      fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=${unit}`

      )
        .then((res) => res.json())
        .then((data) => {
          if(data.cod === "404"){
            setError("City not found");
            setWeather(null);
          }else{
            setWeather(data);
          }
          setLoading(false);
        })
        .catch((err) => {
          console.error(err);
          setError("Error fetching weather data");
          setWeather(null);
          setLoading(false);
        });
    }, [city, unit]);

    useEffect(() => {
      if (!weather) return;
    
      const latestCity = weather.name;
    
      if (latestCity && !searchHistory.includes(latestCity)) {
        const updatedHistory = [latestCity, ...searchHistory].slice(0, 5);
        setSearchHistory(updatedHistory);
        localStorage.setItem("searchHistory", JSON.stringify(updatedHistory));
    
        fetch("http://localhost:8000/api/logs/", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          Authorization: `Bearer ${token}`,
          body: JSON.stringify({
            city: latestCity,
            temperature: weather.main.temp,
            unit: unit === "metric" ? "C" : "F",
          }),
        })
          .then((res) => res.json())
          .then((data) => console.log("✅ Logged to backend:", data))
          .catch((err) => console.error("❌ Backend log error:", err));
      }
    }, [weather]);

    useEffect(() => {
      if (!token) return;
    
      fetch("http://localhost:8000/api/logs/", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then((res) => res.json())
        .then((data) => {
          console.log("User logs:", data);
          setWeatherLogs(data);
        })
        .catch((err) => console.error("Failed to fetch logs", err));
    }, [token]);

    useEffect(() => {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCoords({
            lat: position.coords.latitude,
            lon: position.coords.longitude,
          });
        },
        (error) => {
          console.error("Geolocation error:", error);
        }
      );
    }, []);

    useEffect(() => {
      if (!coords || hasUsedCoords) return;
    
      setLoading(true);
      setError("");
    
      fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=${coords.lat}&lon=${coords.lon}&appid=${apiKey}&units=${unit}`
      )
        .then((res) => res.json())
        .then((data) => {
          setWeather(data);
          setCity(data.name);
          setHasUsedCoords(true); // ✅ prevent it from running again
          setLoading(false);
        })
        .catch((err) => {
          console.error(err);
          setError("Error fetching weather for your location");
          setWeather(null);
          setLoading(false);
        });
    }, [coords]);



return (
  
  <div className="weather-wrapper">
    {/* Weather Info Card */}
    <div style={{ marginBottom: "20px" }}>
  <h3>Login / Register</h3>
  <input
    type="text"
    placeholder="Username"
    value={username}
    onChange={(e) => setUsername(e.target.value)}
  />
  <input
    type="password"
    placeholder="Password"
    value={password}
    onChange={(e) => setPassword(e.target.value)}
  />
  <button onClick={handleLogin}>Login</button>
  <button onClick={handleRegister}>Register</button>

  {token && (
    <button
      style={{ marginLeft: "10px", backgroundColor: "darkred", color: "#fff" }}
      onClick={() => {
        setToken("");
        localStorage.removeItem("token");
        alert("Logged out successfully.");
      }}
    >
      Logout
    </button>
  )}
</div>

    <div className="weather-container">
    <button onClick={() => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    localStorage.setItem("weather_theme", newTheme);
  }}
  style={{ marginBottom: "10px" }}>Switch to {theme === "light" ? "Dark" : "Light"} Mode
</button>
      <input
        type="text"
        placeholder="Enter city name"
        value={search}
        onChange={handleInput}
      />
      <button onClick={handleSearch}>Search</button>
      <button onClick={() =>
          setUnit((prev) => (prev === "metric" ? "imperial" : "metric"))} style={{ marginBottom: "10px" }}>
          Switch to {unit === "metric" ? "°F" : "°C"}
      </button>

      {loading && <p>Loading weather...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      {weather && !loading && ( 
        <div>
          <h2>
            {weather.name}, {weather.sys.country}
          </h2>
          <img
            src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
            alt="Weather icon"
          />
          <p>🌡 Temp: {weather.main.temp} {unit === "metric" ? "°C" : "°F"}</p>
          <p>🌥 Condition: {weather.weather[0].description}</p>
        </div>
      )}
      {favorites.includes(city) ? (
  <button
    onClick={() => {
      const updatedFavs = favorites.filter((fav) => fav !== city);
      setFavorites(updatedFavs);
      localStorage.setItem("weather_favorites", JSON.stringify(updatedFavs));
    }}
    style={{ marginTop: "10px", backgroundColor: "red" }}
  >
    🗑️ Remove from Favorites
  </button>
) : (
  <button
    onClick={() => {
      const updatedFavs = [city, ...favorites].slice(0, 5);
      setFavorites(updatedFavs);
      localStorage.setItem("weather_favorites", JSON.stringify(updatedFavs));
    }}
    style={{ marginTop: "10px" }}
  >
    ❤️ Save to Favorites
  </button>
)}
    </div>

    {/* Search History Card */}
    <div className="history-card">
      <h3>Recent Searches</h3>
      {searchHistory.length === 0 && <p>No history yet</p>}
      {searchHistory.map((item, index) => (
        <button
          key={index}
          onClick={() => {
            setSearch(item);
            setCity(item);
          }}
          style={{ margin: "5px" }}
        >
          {item}
        </button>
      ))}
    </div>

    <div className="favorites-card">
  <h3>Favorite Cities</h3>
  {favorites.length === 0 && <p>No favorites yet</p>}
  {favorites.map((item, index) => (
    <button
      key={index}
      onClick={() => {
        setSearch(item);
        setCity(item);
      }}
      style={{ margin: "5px" }}
    >
      {item}
    </button>
  ))}
</div>
{token && (
  <div className="logs-card">
    <h3>Your Search Logs</h3>
    {weatherLogs.length === 0 ? (
      <p>No logs yet</p>
    ) : (
      weatherLogs.map((log, index) => (
        <div key={index} style={{ marginBottom: "10px" }}>
          <p>
            📍 <strong>{log.city}</strong> – 🌡 {log.temperature}°{log.unit} <br />
            🕒 {new Date(log.timestamp).toLocaleString()}
          </p>
        </div>
      ))
    )}
  </div>
)}
  </div>
  
);

}
export default Main;