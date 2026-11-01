import { Router } from "express";
import { register, login, getProfile, updateProfile, logout } from "../controllers/auth.controller.js";
import { registerValidations, loginValidations, updateProfileValidations } from "../middlewares/validations/auth.validator.js";
import { validationMiddleware } from "../middlewares/validate.js"; 
import { authMiddleware } from "../middlewares/auth.middleware.js";

export const AuthRoute = Router();

// públicas
AuthRoute.post("/auth/register", registerValidations, validationMiddleware, register);
AuthRoute.post("/auth/login", loginValidations, validationMiddleware, login);

// usuario autenticado
AuthRoute.get("/auth/profile", authMiddleware, getProfile);
AuthRoute.put("/auth/profile", authMiddleware, updateProfileValidations, validationMiddleware, updateProfile);
AuthRoute.post("/auth/logout", authMiddleware, logout);