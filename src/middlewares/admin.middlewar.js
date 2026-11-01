export const adminMiddleware = (req,res,next)=>{
    try {
        const datareq = req.datosUserLog.role;
        if(datareq !== "admin") return res.status(403).json({message: "no tenes permisos para realizar esta accion"});
        next()
    } catch (error) {
        console.log(error.message);
        return res.status(401).json({message: "lo sentimos hubo un error en el adminMiddleware"})
    }
}