import express, { json } from 'express'
import "dotenv/config"
import cookieParser from 'cookie-parser'
import { startDB } from './src/config/database.js'

const app = express()
const PORT = process.env.PORT || 3005
app.use(express.json())
app.use(cookieParser())
app.use(cors())

app.listen(PORT, async()=>{
    try {
        await startDB()
        console.log(`servidor encendido y funcionando correctamente en el puerto ${PORT}`);
    } catch (error) {
        console.log(error);
        console.log("hubo un problema intentando encender el servidor");
    }
})