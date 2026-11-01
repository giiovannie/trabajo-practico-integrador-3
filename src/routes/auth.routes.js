import { Router } from "express";
import { register, login, getProfile, updateProfile, logout } from "../controllers/auth.controller.js";
import { registerValidations, loginValidations, updateProfileValidations } from "../middlewares/validators/auth.validator.js";
import { validate } from "../middlewares/validate.js"; 
import { authMiddleware } from "../middlewares/auth.middleware.js";

export const AuthRoute = Router();

// públicas
AuthRoute.post("/auth/register", registerValidations, validate, register);
AuthRoute.post("/auth/login", loginValidations, validate, login);

// usuario autenticado
AuthRoute.get("/auth/profile", authMiddleware, getProfile);
AuthRoute.put("/auth/profile", authMiddleware, updateProfileValidations, validate, updateProfile);
AuthRoute.post("/auth/logout", authMiddleware, logout);
