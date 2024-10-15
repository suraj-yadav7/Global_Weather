import express from 'express'
import { currentSensor, weatherHistory } from '../controllers/weather.controllers.js'
const weatherRouter = express.Router()

// Different routes
weatherRouter.post("/current",  currentSensor )
weatherRouter.post("/history/", weatherHistory)

export default weatherRouter;