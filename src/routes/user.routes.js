import { Router } from "express";
import { getUsers, getUserById, updateUser, deleteUser } from "../controllers/user.controller.js";
import { userIdValidations, userUpdateValidations } from "../middlewares/validations/user.validations.js";
import { validationMiddleware } from "../middlewares/validate.js"; // ajustá al nombre de tu archivo
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { adminMiddleware } from "../middlewares/admin.middleware.js";

export const UserRoute = Router();

// todas son solo admin: authMiddleware siempre primero, después adminMiddleware
UserRoute.get("/users", authMiddleware, adminMiddleware, getUsers);
UserRoute.get("/users/:id", authMiddleware, adminMiddleware, userIdValidations, validationMiddleware, getUserById);
UserRoute.put("/users/:id", authMiddleware, adminMiddleware, userIdValidations, userUpdateValidations, validationMiddleware, updateUser);
UserRoute.delete("/users/:id", authMiddleware, adminMiddleware, userIdValidations, validationMiddleware, deleteUser);