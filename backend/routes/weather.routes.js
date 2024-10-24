import express from 'express'
import { currentSensor, weatherData, weatherHistory } from '../controllers/weather.controllers.js'
const weatherRouter = express.Router()

// Different routes
weatherRouter.post("/current",  currentSensor )
weatherRouter.post("/history", weatherHistory)
weatherRouter.get("/data",      weatherData)

export default weatherRouter;