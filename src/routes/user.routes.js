import { Router } from "express";
import { getUsers, getUserById, updateUser, deleteUser } from "../controllers/user.controller.js";
import { userIdValidations, userUpdateValidations } from "../middlewares/validators/user.validator.js";
import { validate } from "../middlewares/validate.js"; 
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { adminMiddleware } from "../middlewares/admin.middlewar.js";

export const UserRoute = Router();

// todas son solo admin: authMiddleware siempre primero, después adminMiddleware
UserRoute.get("/users", authMiddleware, adminMiddleware, getUsers);
UserRoute.get("/users/:id", authMiddleware, adminMiddleware, userIdValidations, validate, getUserById);
UserRoute.put("/users/:id", authMiddleware, adminMiddleware, userIdValidations, userUpdateValidations, validate, updateUser);
UserRoute.delete("/users/:id", authMiddleware, adminMiddleware, userIdValidations, validate, deleteUser);
