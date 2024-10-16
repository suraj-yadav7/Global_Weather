import React, { useState,useEffect,useRef } from 'react'
import {Chart as ChartJS, ArcElement, Tooltip, Legend} from 'chart.js'
import {Doughnut} from "react-chartjs-2";
import axios from 'axios'
import { cities } from '../utilities/famousCities.js';

ChartJS.register(ArcElement, Tooltip, Legend);
function Home() {
    const base_url = import.meta.env.VITE_BASE_URL

    /** Required states of application */
    const [cityName, setCityName]     = useState('')
    const [weather, setWeather]       = useState()
    const [suggestion, setSuggestion] = useState([])
    const inputRef                    = useRef(null)

    const [chartData, setChartData] = useState({
        labels:["cloud", "visibility", "humidity", "wind-speed"],
        datasets: [
            {
                label: "%",
                data:[0,0,0,0],
                backgroundColor: ["rgba(255, 205, 86, 0.8)", "rgba(75, 192, 192, 0.8)", "rgba(255, 99, 132, 0.8)", "rgba(153, 102, 255, 0.8)"],
                borderColor: ["rgba(255, 205, 86, 0.8)", "rgba(75, 192, 192, 0.8)", "rgba(255, 99, 132, 0.8)", "rgba(153, 102, 255, 0.8)"],
                borderWidth:30,
                borderRadius:32,
                spacing: 8,
                cutout: 118,
            }
        ]
    })

    /** Fetch function to get weather data */
    const fetchWeatherData = async (city) => {
        try {
            let response   = await axios.post(`${base_url}/api/current`, { city });
            setWeather(response.data.data);
            const {cloud, humidity, vis_km, wind_kph} = response.data.data.current
            const labelItem=[cloud, vis_km, humidity, wind_kph]
            setChartData((prev)=> ({
                ...prev,
                datasets:[{
                    ...prev.datasets[0],
                    data:labelItem
                }]
            }))
            setCityName('');
            setSuggestion([]);
        } catch (error) {
            console.log("Error occurred while fetching data", error);
        }

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

  /** fetch initial city weather */
    useEffect(()=>{
        axios.post(`${base_url}/api/current`, {
        city:"hyderabad"
        }).then((response)=>{
            setWeather(response.data.data)
            const {cloud, humidity, vis_km, wind_kph} = response.data.data.current
            const labelItem=[cloud, vis_km, humidity, wind_kph]
            setChartData((prev)=> ({
                ...prev,
                datasets:[{
                    ...prev.datasets[0],
                    data:labelItem
                }]
            }))
        });
    },[]);

    /** Chart option to manage label styling */
    const options = {
        plugins: {
            legend: {
                labels: {
                    padding: 12,
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
				<Doughnut  data={chartData}  options={options} className='chartContainer'/>
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