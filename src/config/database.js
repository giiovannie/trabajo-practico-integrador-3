import mongoose from "mongoose";

export const startDB = async()=>{
    try {
        await mongoose.connect(process.env.MONGO_URI)
        console.log("conexion a la base de datos exitosa :)");
    } catch (error) {
        console.log(error);
        console.log("hubo un problema en la conexion con la base de datos");
    }
}