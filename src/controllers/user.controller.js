import { matchedData } from "express-validator";
import { userModel } from "../models/user.model.js";
import { eventModel } from "../models/event.model.js";

export const getUsers = async (req, res) => {
  try {
    const users = await userModel.find({ deletedAt: null }).populate("events");
    return res.status(200).json({ message: "Usuarios obtenidos correctamente", users });
  } catch (error) {
    return res.status(500).json({ message: "Error al obtener los usuarios", error: error.message });
  }
};

export const getUserById = async (req, res) => {
  try {
    const { id } = matchedData(req); // id ya validado con isMongoId()
    const user = await userModel.findOne({ _id: id, deletedAt: null }).populate("events");
    if (!user) return res.status(404).json({ message: "Usuario no encontrado" });
    return res.status(200).json({ message: "Usuario obtenido correctamente", user });
  } catch (error) {
    return res.status(500).json({ message: "Error al obtener el usuario", error: error.message });
  }
};

export const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const data = matchedData(req);
    // el profile se cambia campo por campo para no pisarlo entero
    const update = {};
    for (const key in data) {
      if (key === "profile") for (const k in data.profile) update[`profile.${k}`] = data.profile[k];
      else update[key] = data[key];
    }

    const user = await userModel.findOneAndUpdate(
      { _id: id, deletedAt: null },
      { $set: update },
      { new: true, runValidators: true }
    );
    if (!user) return res.status(404).json({ message: "Usuario no encontrado" });

    return res.status(200).json({ message: "Usuario actualizado correctamente", user });
  } catch (error) {
    return res.status(500).json({ message: "Error al actualizar el usuario", error: error.message });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const { id } = matchedData(req);

    const user = await userModel.findOne({ _id: id, deletedAt: null });
    if (!user) return res.status(404).json({ message: "Usuario no encontrado" });

    // cascada: borra todos los eventos que organizó
    await eventModel.deleteMany({ organizer: id });

    // soft delete: solo guarda la fecha, no borra el documento
    user.deletedAt = new Date();
    await user.save();

    return res.status(200).json({ message: "Usuario eliminado correctamente" });
  } catch (error) {
    return res.status(500).json({ message: "Error al eliminar el usuario", error: error.message });
  }
};