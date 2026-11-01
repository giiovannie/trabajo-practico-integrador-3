import { Router } from "express";
import { createCategory, getCategories, getCategoryById, updateCategory, deleteCategory } from "../controllers/category.controller.js";
import { categoryCreateValidations, categoryUpdateValidations, categoryIdValidations } from "../middlewares/validators/category.validator.js";
import { validate } from "../middlewares/validate.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { adminMiddleware } from "../middlewares/admin.middlewar.js";

export const CategoryRoute = Router();

// usuario autenticado
CategoryRoute.get("/categories", authMiddleware, getCategories);
CategoryRoute.get("/categories/:id", authMiddleware, categoryIdValidations, validate, getCategoryById);

// solo admin
CategoryRoute.post("/categories", authMiddleware, adminMiddleware, categoryCreateValidations, validate, createCategory);
CategoryRoute.put("/categories/:id", authMiddleware, adminMiddleware, categoryIdValidations, categoryUpdateValidations, validate, updateCategory);
CategoryRoute.delete("/categories/:id", authMiddleware, adminMiddleware, categoryIdValidations, validate, deleteCategory);
