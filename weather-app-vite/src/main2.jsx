import {useEffect, useState} from 'react';
import './Main.css';

function Main() {
    const [city,setCity] = useState("");
    const [search,setSearch] = useState("");
    const [loading,setLoading] = useState(false);
    const [weather,setWeather] = useState(null);
    const [error,setError] = useState("");

    const apiKey = import.meta.env.VITE_WEATHER_API_KEY;

    const handleInput = (e) => {
        setSearch(e.target.value);
    }

    const handleSearch = () => {
      setCity(search);  
    };

    useEffect(() => {
      if (city==="") return;
      setLoading(true);
      setError("");

      fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`
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
    }, [city]);


    return (
        <div className='weather-container'>
            <input type='text' placeholder='Enter city name' value={search} onChange={handleInput} />
            <button onClick={handleSearch}>Search</button>
            {loading && <p>Loading weather...</p>}
            {error && <p style={{color:"red"}}>{error}</p>}

      {weather && !loading && (
        <div>
          <h2>{weather.name}, {weather.sys.country}</h2>
          <img 
  src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`} 
  alt="Weather icon"
/>
          
          <p>🌡 Temp: {weather.main.temp} °C</p>
          <p>🌥 Condition: {weather.weather[0].description}</p>
        </div>
      )}
        </div>
    );

}
export default Main;