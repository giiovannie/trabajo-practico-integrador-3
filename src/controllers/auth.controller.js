import { matchedData } from "express-validator";
import { userModel } from "../models/User.js";
import { hashPassword, comparePassword } from "../helpers/bcripts.helper.js";
import { generateToken } from "../helpers/jwt.helper.js";

export const register = async (req, res) => {
  try {
    const { username, email, password, profile } = matchedData(req);
    const hash = await hashPassword(password);
    
    const user = await userModel.create({ username, email, password: hash, profile });
    
    const userData = user.toObject(); //nota: lo convierto a ojeto js para borrar la password cuando el create devuelva no saldra
    delete userData.password;
    return res.status(201).json({ message: "Usuario registrado correctamente", user: userData });
  } catch (error) {
    return res.status(500).json({ message: "Error al registrar el usuario", error: error.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = matchedData(req);

    // select("+password") porque en el schema la password tiene select: false
    // deletedAt: null para que un usuario borrado no pueda loguearse
    const user = await userModel.findOne({ email, deletedAt: null }).select("+password");
    if (!user) return res.status(401).json({ message: "Credenciales inválidas" });

    const passwordValid = await comparePassword(password, user.password);
    if (!passwordValid) return res.status(401).json({ message: "Credenciales inválidas" });

    // el payload lleva id y role: es lo que leen los middlewares en req.datosUserLog
    const token = generateToken({ id: user._id, role: user.role });

    // nota: sameSite: "strict" hace que el navegador mande la cookie solo si la petición sale desde el mismo sitio,
    // así otra página web no puede usar la sesión del usuario para hacer peticiones a la API (protege contra CSRF)
    res.cookie("token", token, { httpOnly: true, sameSite: "strict", maxAge: 60 * 60 * 1000 });

    return res.status(200).json({ message: "Login exitoso" });
  } catch (error) {
    return res.status(500).json({ message: "Error al iniciar sesión", error: error.message });
  }
};

// GET /api/auth/profile (usuario autenticado)
export const getProfile = async (req, res) => {
  try {
    // el id viene del token, que dejó authMiddleware
    const user = await userModel.findOne({ _id: req.datosUserLog.id, deletedAt: null });
    if (!user) return res.status(404).json({ message: "Usuario no encontrado" });

    return res.status(200).json({ user });
  } catch (error) {
    return res.status(500).json({ message: "Error al obtener el perfil", error: error.message });
  }
};

// PUT /api/auth/profile (usuario autenticado)
export const updateProfile = async (req, res) => {
  try {
    const data = matchedData(req); // { firstName, lastName, birthDate, phone } (los que vengan)
    const update = {};
    for (const key in data) update[`profile.${key}`] = data[key];

    const user = await userModel.findOneAndUpdate(
      { _id: req.datosUserLog.id, deletedAt: null },
      { $set: update },
      { new: true, runValidators: true } // new: devuelve el actualizado, runValidators: aplica las validaciones del schema
    );
    if (!user) return res.status(404).json({ message: "Usuario no encontrado" });

    return res.status(200).json({ message: "Perfil actualizado correctamente", user });
  } catch (error) {
    return res.status(500).json({ message: "Error al actualizar el perfil", error: error.message });
  }
};

// POST /api/auth/logout (usuario autenticado)
export const logout = async (req, res) => {
  try {
    res.clearCookie("token"); // borra la cookie de autenticación
    return res.status(200).json({ message: "Sesión cerrada correctamente" });
  } catch (error) {
    return res.status(500).json({ message: "Error al cerrar sesión", error: error.message });
  }
};
