import { eventModel } from "../models/event.model.js"; // antes ArticleModel

export const ownerOrAdminMiddleware = async (req,res,next)=>{
  try {
    const { id } = req.params;
    const event = await eventModel.findById(id);
    if(!event) return res.status(404).json({message: "el evento no existe"});

    const userId = req.datosUserLog.id;
    const role = req.datosUserLog.role;

    if(event.organizer.toString() !== userId && role !== "admin") return res.status(403).json({message: "no tenes permisos para realizar esta accion"});
    next();
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({message: "lo sentimos hubo un error en el ownerOrAdminMiddleware"});
  }
};