import { matchedData } from "express-validator";
import { eventModel } from "../models/Event.js";

export const createEvent = async (req, res) => {
  try {
    const data = matchedData(req); 
    const event = await eventModel.create({ ...data, organizer: req.datosUserLog.id });
    return res.status(201).json({ message: "Evento creado correctamente", event });
  } catch (error) {
    return res.status(500).json({ message: "Error al crear el evento", error: error.message });
  }
};

export const getEvents = async (req, res) => {
  try {
    const events = await eventModel.find().populate("organizer").populate("catogories");
    return res.status(200).json({ message: "Eventos obtenidos correctamente", events });
  } catch (error) {
    return res.status(500).json({ message: "Error al obtener los eventos", error: error.message });
  }
};

export const getMyEvents = async (req, res) => {
  try {
    const events = await eventModel.find({ organizer: req.datosUserLog.id }).populate("catogories");
    return res.status(200).json({ message: "Tus eventos obtenidos correctamente", events });
  } catch (error) {
    return res.status(500).json({ message: "Error al obtener tus eventos", error: error.message });
  }
};

export const getEventById = async (req, res) => {
  try {
    const { id } = matchedData(req);
    const event = await eventModel.findById(id).populate("organizer").populate("catogories");
    if (!event) return res.status(404).json({ message: "Evento no encontrado" });
    return res.status(200).json({ message: "Evento obtenido correctamente", event });
  } catch (error) {
    return res.status(500).json({ message: "Error al obtener el evento", error: error.message });
  }
};

// PUT /api/events/:id (solo organizador o admin)
export const updateEvent = async (req, res) => {
  try {
    const { id } = req.params;
    const data = matchedData(req, { locations: ["body"] }); 

    const update = {};
    for (const key in data) {
      if (key === "location") for (const k in data.location) update[`location.${k}`] = data.location[k];
      else update[key] = data[key];
    }

    const event = await eventModel.findByIdAndUpdate(id, { $set: update }, { new: true, runValidators: true });
    if (!event) return res.status(404).json({ message: "Evento no encontrado" });

    return res.status(200).json({ message: "Evento actualizado correctamente", event });
  } catch (error) {
    return res.status(500).json({ message: "Error al actualizar el evento", error: error.message });
  }
};

export const deleteEvent = async (req, res) => {
  try {
    const { id } = matchedData(req);
    const event = await eventModel.findByIdAndDelete(id);
    if (!event) return res.status(404).json({ message: "Evento no encontrado" });
    return res.status(200).json({ message: "Evento eliminado correctamente" });
  } catch (error) {
    return res.status(500).json({ message: "Error al eliminar el evento", error: error.message });
  }
};