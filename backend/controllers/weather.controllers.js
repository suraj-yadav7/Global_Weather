import axios  from "axios"
import dotenv from 'dotenv'

dotenv.config();
const base_url = process.env.WEATHER_API
const key = process.env.KEY

// Current City Weather API
export const currentSensor = async(req, res)=>{
    try{
        const {city} = req.body
        if(!city){
            res.status(404).json({status:false, message:"Not Found"})
        }
        let response = await axios.get(`${base_url}?key=${key}&q=${city}`)
        return res.status(200).json({status:true, message:"city weather request is successfull", data:response.data})
    }
    catch(error){
        console.log("Error Occured at currentSensor: ", error)
        return res.status(500).json({status:false, message:"Internal Server Error"})
    }
};

// City History Data based on date
export const weatherHistory = async(req, res)=>{
    try{
        const {date, city} = req.body
        if(!date || !city){
            return res.status(200).json({status:true, message:"Provide a valid inputs"})
        }
        let response = await axios.get(`${base_url}?key=${key}&q=${city}&dt=${date}`)
        return res.status(200).json({status:true, message:"History data fetch is successfull", data : response.data})

    }
    catch(error){
        console.log("Error Occured at weatherHistory: ", error)
        return res.status(500).json({status:false, message:"Internal Server Error"})
    }
}

export const weatherData = async(req, res)=>{
    try{

    }
    catch(error){
        console.log("Error Occured at weatherData: ", error)
        return res.status(500).json({status:false, message:"Internal Server Error"})
    }
}