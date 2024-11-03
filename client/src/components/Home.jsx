import React, { useState, useEffect, useRef } from 'react'
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
    const [loading, setLoading]       = useState(true)

    const [chartData, setChartData] = useState({
        labels: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
        datasets: [
            {
                label: 'Temperature (°C)',
                data: [10, 20, 30, 40, 30, 20],
                fill: false,
                backgroundColor: 'rgba(255, 99, 132, 0.8)',
                borderColor: 'rgba(255, 99, 132, 1)',
            },
            {
                label: 'Visibility (km)',
                data: [5, 7, 10, 4, 6, 10],
                fill: false,
                backgroundColor: 'rgba(75, 192, 192, 0.8)',
                borderColor: 'rgba(75, 192, 192, 1)',
            },
            {
                label: 'Wind Speed (kmph)',
                data: [15, 20, 25, 15, 35, 40],
                fill: false,
                backgroundColor: 'rgba(255, 205, 86, 0.8)',
                borderColor: 'rgba(255, 205, 86, 1)',
            },
        ],
    });


    /** Function to handle key press event for search */
    const fetchCityData = async (e) => {
        if (e.key === "Enter") {
            mainFunction(cityName);
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
        await cityWeatherAndCoord(city);
    };

    const cityWeatherAndCoord = async(cityname)=>{
        try{
            const response = await axios.get(`${base_url}/weather?q=${cityname}&appid=${apiKey}`)
            const coordinates = {
                lat:0,
                lon:0
            }
            setCityName('');
            setSuggestion([]);
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

                const arrWeatherObj = Object.values(weatherObj)
                let tempData = arrWeatherObj.map((elem) => (
                    (elem.main.temp-273.15).toFixed()
                ))

                let visibilityData  = arrWeatherObj.map((elem) => (
                    (elem.visibility/1000)
                ))

                let windSpeedData = arrWeatherObj.map((elem) => (
                    (elem.wind.speed*3.6).toFixed(2)
                ))

                setChartData((prev)=>({
                    ...prev,
                    labels: Object.keys(weatherObj),
                    datasets:[{
                        ...prev.datasets[0],
                        data:tempData
                    },
                    {
                        ...prev.datasets[1],
                        data:visibilityData
                    },
                    {
                        ...prev.datasets[2],
                        data:windSpeedData
                    }
                    ]
                }))
            }

            // Cursor at the end of the input field after selection
            if (inputRef.current) {
                inputRef.current.focus();
                inputRef.current.selectionStart = inputRef.current.value.length;
                inputRef.current.selectionEnd   = inputRef.current.value.length;
            }
        } catch (error) {
            console.log("Error occur while geting weather forecast data: ", error)
        }
    };

    const mainFunction = async(cityname)=>{
        const coordinatesData = await cityWeatherAndCoord(cityname)
        if(coordinatesData){
            setLoading(false)
            const {lat, lon} = coordinatesData
            getWeatherDataForecast(lat, lon)
        }
    };
    /** fetch initial city weather */
    useEffect(()=>{
        mainFunction("hyderabad")
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
    {
        loading && loading ? <div className='spinner'>
                                <article></article>
                                <p className='text-black opacity-75 mt-5 font-corrois text-lg'>Data is loading.... Please Wait....!</p>
                            </div>
        :<div className='app'>
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
                    <p> {weather && weather?.name}</p>
                </div>
                <div className="temp">
                    <h2>{weather && ((weather.main?.temp -273.15).toFixed(1))} &deg;C</h2>
                </div>
                <div className="description">
                    <p>Clouds</p>
                    <p>{weather&& weather.clouds.all} % </p>
                </div>
            </div>
            <div className='middleContainer'>
				<Line  data={chartData}  options={options} className='chartContainer'/>
                <h2 className='region'>{weather && weather.name} <span className='city'>{weather && weather.location?.name}</span></h2>
                <p>{weather && weather.weather[0]?.description}</p>
            </div>
            <div className="bottom">
                <div className="feels">
                    <p className='bold'>{weather&& weather.visibility/1000} <span className='bottom-text'> km</span></p>
                    <p>Visibility</p>
                </div>
                <div className="humidity">
                    <p className='bold'>{weather && weather.main.humidity} % </p>
                    <p>Humidity</p>
                </div>
                <div className="wind">
                    <p className='bold'>{weather && (weather.wind.speed*3.6).toFixed(2)} <sapn className='bottom-text'> kmph</sapn></p>
                    <p>wind speed</p>
                </div>
            </div>
        </div>
    </div>
    }
    </>
    )
};
export default Home;