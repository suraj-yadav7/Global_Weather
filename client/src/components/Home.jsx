import React, { useState,useEffect,useRef } from 'react'
import { Chart as ChartJS,  PointElement, LineElement, CategoryScale, LinearScale, Title, Tooltip, Legend } from 'chart.js';
import { Line } from 'react-chartjs-2';
import axios from 'axios'
import { cities } from '../utilities/famousCities.js';

ChartJS.register(LineElement, PointElement, CategoryScale, LinearScale, Title, Tooltip, Legend);
function Home() {
    const base_url = import.meta.env.VITE_BASE_URL
    const apiKey   = import.meta.env.VITE_KEY

    /** Required states of application */
    const [cityName, setCityName]     = useState('')
    const [weather, setWeather]       = useState()
    const [suggestion, setSuggestion] = useState([])
    const inputRef                    = useRef(null)

    const [chartData, setChartData] = useState({
        labels: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
        datasets: [
            {
                label: 'Temperature (°C)',
                data: [10, 20, 30, 40, 50, 60, 70],
                fill: false,
                backgroundColor: 'rgba(255, 99, 132, 0.8)',
                borderColor: 'rgba(255, 99, 132, 1)',
            },
            {
                label: 'Visibility (km)',
                data: [5, 7, 10, 4, 6, 8, 9],
                fill: false,
                backgroundColor: 'rgba(75, 192, 192, 0.8)',
                borderColor: 'rgba(75, 192, 192, 1)',
            },
            {
                label: 'Wind Speed (km/h)',
                data: [15, 20, 25, 10, 30, 35, 40],
                fill: false,
                backgroundColor: 'rgba(255, 205, 86, 0.8)',
                borderColor: 'rgba(255, 205, 86, 1)',
            },
        ],
    });

    /** Fetch function to get weather data */
    const fetchWeatherData = async (city) => {
        try {
            let response   = await axios.post(`${base_url}/api/current`, { city });
            setWeather(response.data.data);
            const {cloud, humidity, vis_km, wind_kph} = response.data.data.current
            const labelItem=[cloud, vis_km, humidity, wind_kph]
            // setChartData((prev)=> ({
            //     ...prev,
            //     datasets:[{
            //         ...prev.datasets[0],
            //         data:labelItem
            //     }]
            // }))
            setCityName('');
            setSuggestion([]);
        } catch (error) {
            console.log("Error occurred while fetching data", error);
        };

        // Cursor at the end of the input field after selection
        if (inputRef.current) {
            inputRef.current.focus();
            inputRef.current.selectionStart = inputRef.current.value.length;
            inputRef.current.selectionEnd   = inputRef.current.value.length;
        }
    };

    /** Function to handle key press event for search */
    const fetchCityData = async (e) => {
        if (e.key === "Enter") {
            await fetchWeatherData(cityName);
        }
    };

    /** Handle input changes and suggest cities */
    const handleChange = (e) => {
        const { value } = e.target;
        setCityName(value);
        if (value.length > 0) {
            const filterSuggestion = cities.filter((elem) =>
                elem.toLocaleLowerCase().includes(value.toLocaleLowerCase())
            );
            setSuggestion(filterSuggestion.splice(0, 4));
        } else {
            setSuggestion([]);
        }
    };

    /** Function to run when the user clicks on a suggestion */
    const suggestionSearch = async (city) => {
        await fetchWeatherData(city);
    };

    const getCoordinates = async(cityname)=>{
        try{
            const response = await axios.get(`${base_url}/weather?q=${cityname}&appid=${apiKey}`)
            const coordinates = {
                lat:0,
                lon:0
            }
            console.log("rs: ", response)
            if(response.status === 200){
                setWeather(response.data)
                const {lon, lat} = response.data.coord
                coordinates.lat = lat
                coordinates.lon = lon
                return coordinates
            }
            else{
                return false
            }
        }
        catch(error){
            console.log("Error occur while getting coordinates: ", error)
            return false
        }
    };

    const getWeatherDataForecast = async(lat, lon)=>{
        try {
            let response = await axios.get(`${base_url}/forecast?lat=${lat}&lon=${lon}&dt=1697836800&appid=${apiKey}`)
            let weatherObj = {}
            if(response.status === 200){
                response.data.list.forEach(entry =>{
                    const date = new Date(entry.dt * 1000).toISOString().split("T")[0]
                    if(!weatherObj[date]){
                        weatherObj[date] = entry
                    }
                })
            }
            console.log("Weather object data: ", weatherObj)
        } catch (error) {
            console.log("Error occur while geting weather forecast data: ", error)
        }
    };

    const mainFunction = async(cityname)=>{
        const coordinatesData = await getCoordinates(cityname)
        if(coordinatesData){
            const {lat, lon} = coordinatesData
            // getWeatherDataForecast(lat, lon)
        }
    };
    console.log("weather data: ", weather)
    /** fetch initial city weather */
    useEffect(()=>{
        mainFunction("lucknow")
    },[]);

    /** Chart option to manage label styling */
    const options = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top',
                labels: {
                color: 'white',
                },
            },
                title: {
                display: true,
                text: 'Line Chart Example',
                color: 'white',
            },
        },
        scales: {
            x: {
                ticks: {
                color: 'white',
                },
            },
                y: {
                ticks: {
                color: 'white',
                },
            },
        },
    };


return (
    <>
        <div className='app'>
        <div className="search">
        <input type='text' placeholder='enter your city' ref={inputRef} onKeyDown={(e)=>fetchCityData(e)} value={cityName} onChange={(e)=>handleChange(e)} />
        {
            setSuggestion.length>0 && (
            <ul className='citiesList'>
            {
                suggestion.map((cities,index)=> (
                <li key={index} onClick={(e)=> {suggestionSearch(cities)}}>{cities}</li>
                ))
            }
            </ul>
        )}
        </div>
        <div className="container">
            <div className="top">
                <div className="location">
                    <p> {weather && weather.location?.name}</p>
                </div>
                <div className="temp">
                    <h2>{weather && (weather.current?.temp_c)} &deg;C</h2>
                </div>
                <div className="description">
                    <p>Clouds</p>
                    <p>{weather&& weather.current?.cloud} </p>
                </div>
            </div>
            <div className='middleContainer'>
				<Line  data={chartData}  options={options} className='chartContainer'/>
                <h2 className='region'>{weather && weather.location?.region}, <span className='city'>{weather && weather.location?.name}</span></h2>
                <p>{weather && weather.current?.condition?.text}</p>
            </div>
            <div className="bottom">
                <div className="feels">
                    <p className='bold'>{weather&& weather.current?.vis_km} <span className='bottom-text'> km</span></p>
                    <p>Visibility</p>
                </div>
                <div className="humidity">
                    <p className='bold'>{weather && weather.current?.humidity} </p>
                    <p>Humidity</p>
                </div>
                <div className="wind">
                    <p className='bold'>{weather && weather.current?.wind_kph} <sapn className='bottom-text'> kmph</sapn></p>
                    <p>wind speed</p>
                </div>
            </div>
        </div>
    </div>
    </>
    )
};
export default Home;