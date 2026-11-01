import { verifyToken } from "../helpers/jwt.helper.js";

export const authMiddleware = (req,res,next)=>{
    try {
        const tokenObtenido = req.cookies.token;
        if(!tokenObtenido) return res.status(401).json({ message: "No autenticado" });

        const decoded = verifyToken(tokenObtenido);
        req.datosUserLog = decoded

        next()
    } catch (error) {
        console.log(error);
        return res.status(401).json({ message: "Token inválido o expirado" });
    }
}