
import express from "express"
import cors from "cors"
import dotenv from "dotenv"
import morgan from "morgan"
import colors from "colors"
import weatherRouter from "./routes/weather.routes.js"


const app = express()
dotenv.config()

const port        = process.env.PORT || 8080
const mode        = process.env.NODE_MODE
const client_url  = process.env.CLIENT_URL


app.listen(port , ()=>{
        console.log(`Server is running in ${mode} environment at ${port}`.bgCyan.white)
});

app.get("/", (req, res)=>{
    res.send("<h1>Weather API  Server Backend</h1>")
});
const corsOption={
    origin     : client_url,
    mmethod    : ['GET',"POST", "PUT", "DELETE"],
    credentials: true,
    optionSuccessStatus:200
};
app.use(cors(corsOption))
app.use(express.json())
app.use(morgan("dev"))

// root level routes
app.use("/api", weatherRouter)

