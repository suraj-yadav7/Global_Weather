import React, { useState,useEffect,useRef } from 'react'
import axios from 'axios'

function Home() {
    const base_url = import.meta.env.VITE_BASE_URL
    console.log("base url : client: ", base_url)

    const [cityName, setCityName] = useState('')
    const [value, setValue]       = useState()
    const inputRef                = useRef(null)

  //initial city weather
    useEffect(()=>{
        axios.post(`${base_url}/api/current`, {
        city:"hyderabad"
        }).then((response)=>{
            setValue(response.data.data)
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
                    <p> {value&& value.location.name}</p>
                </div>
                <div className="temp">
                    <h2>{value&& (value.current.heatindex_c)} &deg;C</h2>
                </div>
                <div className="description">
                    <p>Clouds</p>
                    <p>{value&& value.cloud} </p>
                </div>
            </div>
            <div className='middleContainer'>
            </div>
            <div className="bottom">
                <div className="feels">
                    <p className='bold'>{value&& value.current.feelslike_c}</p>
                    <p>Feels Like</p>
                </div>
                <div className="humidity">
                    <p>Humidity</p>
                </div>
                <div className="wind">
                    <p>wind speed</p>
                </div>
            </div>
        </div>
    </div>
    </>
    )
};
export default Home;