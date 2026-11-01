import { matchedData } from "express-validator";
import { categoryModel } from "../models/Category.js";
import { eventModel } from "../models/Event.js";

// POST /api/categories (solo admin)
export const createCategory = async (req, res) => {
  try {
    const data = matchedData(req); 
    const category = await categoryModel.create(data);
    return res.status(201).json({ message: "Categoría creada correctamente", category });
  } catch (error) {
    return res.status(500).json({ message: "Error al crear la categoría", error: error.message });
  }
};


export const getCategories = async (req, res) => {
  try {
    const categories = await categoryModel.find();
    return res.status(200).json({ message: "Categorías obtenidas correctamente", categories });
  } catch (error) {
    return res.status(500).json({ message: "Error al obtener las categorías", error: error.message });
  }
};


export const getCategoryById = async (req, res) => {
  try {
    const { id } = matchedData(req);
    const category = await categoryModel.findById(id).populate("events");
    if (!category) return res.status(404).json({ message: "Categoría no encontrada" });
    return res.status(200).json({ message: "Categoría obtenida correctamente", category });
  } catch (error) {
    return res.status(500).json({ message: "Error al obtener la categoría", error: error.message });
  }
};

export const updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const data = matchedData(req); 
    const category = await categoryModel.findByIdAndUpdate(id, data, { new: true, runValidators: true });
    if (!category) return res.status(404).json({ message: "Categoría no encontrada" });
    return res.status(200).json({ message: "Categoría actualizada correctamente", category });
  } catch (error) {
    return res.status(500).json({ message: "Error al actualizar la categoría", error: error.message });
  }
};


export const deleteCategory = async (req, res) => {
  try {
    const { id } = matchedData(req);
    const category = await categoryModel.findById(id);
    if (!category) return res.status(404).json({ message: "Categoría no encontrada" });
    await eventModel.updateMany({ catogories: id }, { $pull: { catogories: id } });
    await categoryModel.findByIdAndDelete(id);
    return res.status(200).json({ message: "Categoría eliminada correctamente" });
  } catch (error) {
    return res.status(500).json({ message: "Error al eliminar la categoría", error: error.message });
  }
};
