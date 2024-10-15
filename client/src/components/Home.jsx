import React, { useState,useEffect,useRef } from 'react'
import axios from 'axios'

function Home() {
    const base_url = import.meta.env.VITE_BASE_URL

    /** Required state's of application */
    const [cityName, setCityName] = useState('')
    const [weather, setWeather]   = useState()
    const inputRef                = useRef(null)

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
    }

  /** fetch initial city weather */
    useEffect(()=>{
        axios.post(`${base_url}/api/current`, {
        city:"hyderabad"
        }).then((response)=>{
            setWeather(response.data.data)
        })
    },[]);

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
                    <h2>{weather && (weather.current?.heatindex_c)} &deg;C</h2>
                </div>
                <div className="description">
                    <p>Clouds</p>
                    <p>{weather&& weather.current?.cloud} </p>
                </div>
            </div>
            <div className='middleContainer'>
                <h2 className='region'>{weather && weather.location?.region}, <span className='city'>{weather && weather.location?.name}</span></h2>
                <p>{weather && weather.current?.condition?.text}</p>
            </div>
            <div className="bottom">
                <div className="feels">
                    <p className='bold'>{weather&& weather.current?.feelslike_c}</p>
                    <p>Feels Like</p>
                </div>
                <div className="humidity">
                    <p className='bold'>{weather && weather.current?.humidity} </p>
                    <p>Humidity</p>
                </div>
                <div className="wind">
                    <p className='bold'>{weather && weather.current?.wind_kph}</p>
                    <p>wind speed</p>
                </div>
            </div>
        </div>
    </div>
    </>
    )
};
export default Home;