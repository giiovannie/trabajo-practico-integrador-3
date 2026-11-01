import { Router } from "express";
import { createCategory, getCategories, getCategoryById, updateCategory, deleteCategory } from "../controllers/category.controller.js";
import { categoryCreateValidations, categoryUpdateValidations, categoryIdValidations } from "../middlewares/validations/category.validations.js";
import { validationMiddleware } from "../middlewares/validate.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { adminMiddleware } from "../middlewares/admin.middleware.js";

export const CategoryRoute = Router();

// usuario autenticado
CategoryRoute.get("/categories", authMiddleware, getCategories);
CategoryRoute.get("/categories/:id", authMiddleware, categoryIdValidations, validationMiddleware, getCategoryById);

// solo admin
CategoryRoute.post("/categories", authMiddleware, adminMiddleware, categoryCreateValidations, validationMiddleware, createCategory);
CategoryRoute.put("/categories/:id", authMiddleware, adminMiddleware, categoryIdValidations, categoryUpdateValidations, validationMiddleware, updateCategory);
CategoryRoute.delete("/categories/:id", authMiddleware, adminMiddleware, categoryIdValidations, validationMiddleware, deleteCategory);