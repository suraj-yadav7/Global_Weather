import React, { useState,useEffect,useRef } from 'react'
import {Chart as ChartJS, ArcElement, Tooltip, Legend} from 'chart.js'
import { Doughnut } from "react-chartjs-2";
import axios from 'axios'

ChartJS.register(ArcElement, Tooltip, Legend);
function Home() {
    const base_url = import.meta.env.VITE_BASE_URL

    /** Required states of application */
    const [cityName, setCityName]   = useState('')
    const [weather, setWeather]     = useState()
    const inputRef                  = useRef(null)

    const [chartData, setChartData] = useState({
        labels:["cloud", "visibility", "humidity", "wind-speed"],
        datasets: [
            {
                label: "%",
                data:[22,45,70,50],
                backgroundColor:["rgba(75, 192, 192)","rgba(54, 162, 235)","rgba(255, 99, 132)","rgba(180, 120, 60)"],
                borderColor: ["rgba(75, 192, 192)","rgba(54, 162, 235)","rgba(255, 99, 132)","rgba(180, 120, 60)"],
                borderWidth:30,
                borderRadius:32,
                spacing: 8,
                cutout: 118,
            }
        ]
    })

    /** Fetching weather data when user search city */
    const fetchCityData = async (e)=>{
        if(e.key==="Enter"){
            try{
            let response = await axios.post(`${base_url}/api/current`,{city:cityName})
            setWeather(response.data.data)
            setCityName('')
            }
            catch(error){
                console.log("error occured while fetching data", error)
            }
        }
    }

    /** Handle search city input */
    const handleChange=(e)=>{
        const {value} = e.target
        setCityName(value)
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
				<Doughnut data={chartData}  options={options} className='chartContainer'/>
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