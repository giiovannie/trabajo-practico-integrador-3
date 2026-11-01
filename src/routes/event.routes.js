import { Router } from "express";
import { createEvent, getEvents, getMyEvents, getEventById, updateEvent, deleteEvent } from "../controllers/event.controller.js";
import { eventCreateValidations, eventUpdateValidations, eventIdValidations } from "../middlewares/validations/event.validations.js";
import { validationMiddleware } from "../middlewares/validation.middleware.js"; // ajustá al nombre de tu archivo
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { ownerOrAdminMiddleware } from "../middlewares/owner.middleware.js";

export const EventRoute = Router();

// usuario autenticado
EventRoute.post("/events", authMiddleware, eventCreateValidations, validationMiddleware, createEvent);
EventRoute.get("/events", authMiddleware, getEvents);
EventRoute.get("/events/my", authMiddleware, getMyEvents); // tiene que ir ANTES de "/events/:id"
EventRoute.get("/events/:id", authMiddleware, eventIdValidations, validationMiddleware, getEventById);

// solo organizador o admin: primero se valida el id, después los permisos, después el body
EventRoute.put("/events/:id", authMiddleware, eventIdValidations, validationMiddleware, ownerOrAdminMiddleware, eventUpdateValidations, validationMiddleware, updateEvent);
EventRoute.delete("/events/:id", authMiddleware, eventIdValidations, validationMiddleware, ownerOrAdminMiddleware, deleteEvent);