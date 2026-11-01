import express, { json } from 'express'
import "dotenv/config"
import cookieParser from 'cookie-parser'
import { startDB } from './src/config/database.js'
import cors from 'cors'

import { AuthRoute } from './src/routes/auth.routes.js' 
import { UserRoute } from './src/routes/user.routes.js' 
import { EventRoute } from './src/routes/event.routes.js'
import { CategoryRoute } from './src/routes/category.routes.js' 

const app = express()
const PORT = process.env.PORT || 3005
app.use(express.json())
app.use(cookieParser())
app.use(cors())

app.use("/api", AuthRoute)
app.use("/api", UserRoute)
app.use("/api", EventRoute)
app.use("/api", CategoryRoute)

app.listen(PORT, async()=>{
    try {
        await startDB()
        console.log(`servidor encendido y funcionando correctamente en el puerto ${PORT}`);
    } catch (error) {
        console.log(error);
        console.log("hubo un problema intentando encender el servidor");
    }
})