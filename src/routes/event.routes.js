import { Router } from "express";
import { createEvent, getEvents, getMyEvents, getEventById, updateEvent, deleteEvent } from "../controllers/events.controller.js";
import { eventCreateValidations, eventUpdateValidations, eventIdValidations } from "../middlewares/validators/event.validator.js";
import { validate } from "../middlewares/validate.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { ownerOrAdminMiddleware } from "../middlewares/ownerOrAdminMiddleware.js";

export const EventRoute = Router();

// usuario autenticado
EventRoute.post("/events", authMiddleware, eventCreateValidations, validate, createEvent);
EventRoute.get("/events", authMiddleware, getEvents);
EventRoute.get("/events/my", authMiddleware, getMyEvents); // tiene que ir ANTES de "/events/:id"
EventRoute.get("/events/:id", authMiddleware, eventIdValidations, validate, getEventById);

// solo organizador o admin: primero se valida el id, después los permisos, después el body
EventRoute.put("/events/:id", authMiddleware, eventIdValidations, validate, ownerOrAdminMiddleware, eventUpdateValidations, validate, updateEvent);
EventRoute.delete("/events/:id", authMiddleware, eventIdValidations, validate, ownerOrAdminMiddleware, deleteEvent);
