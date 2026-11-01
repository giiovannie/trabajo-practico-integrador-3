import { body } from "express-validator";
import { userModel } from "../../models/User.js";

// POST /api/auth/register
export const registerValidations = [
  body("username")
    .isString()
    .withMessage("el username no es del tipo string")
    .notEmpty()
    .withMessage("el username no debe de estar vacio")
    .isLength({ min: 3, max: 20 })
    .withMessage("el username debe tener entre 3 y 20 caracteres")
    .isAlphanumeric()
    .withMessage("el username no es alfanumerico")
    .bail()
    .custom(async (username) => {
      const userExist = await userModel.findOne({ username });
      if (userExist) throw new Error("el username ya existe y esta en uso");
      return true;
    }),
  body("email")
    .notEmpty()
    .withMessage("el email no debe de ir vacio")
    .isEmail()
    .withMessage("no hay formato email valido")
    .bail()
    .custom(async (email) => {
      const emailExist = await userModel.findOne({ email });
      if (emailExist) throw new Error("el email ya esta en uso");
      return true;
    }),
  body("password")
    .notEmpty()
    .withMessage("la password no debe de ir vacia")
    .isString()
    .withMessage("la password no es del tipo string")
    .isLength({ min: 8 })
    .withMessage("la contraseña no tiene el minimo de 8 caracteres")
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage(
      "La contraseña debe contener al menos una mayúscula, una minúscula y un número.",
    ),
  body("role")
    .optional()
    .isIn(["user", "admin"])
    .withMessage('El rol debe ser "user" o "admin".'),
  body("profile").isObject().withMessage("el profile debe ser un objeto"),
  body("profile.firstName")
    .notEmpty()
    .withMessage("el firstName no debe de ir vacio")
    .isLength({ min: 2, max: 50 })
    .withMessage("el firstName debe tener entre 2 y 50 caracteres")
    .matches(/^[A-Za-zÁÉÍÓÚáéíóúÑñÜü\s]+$/)
    .withMessage("el firstName solo puede tener letras"),
  body("profile.lastName")
    .notEmpty()
    .withMessage("el lastName no debe de ir vacio")
    .isLength({ min: 2, max: 50 })
    .withMessage("el lastName debe tener entre 2 y 50 caracteres")
    .matches(/^[A-Za-zÁÉÍÓÚáéíóúÑñÜü\s]+$/)
    .withMessage("el lastName solo puede tener letras"),
  body("profile.birthDate")
    .optional()
    .isISO8601()
    .withMessage("la birthDate no es una fecha valida")
    .bail()
    .custom((birthDate) => {
      if (new Date(birthDate) > new Date())
        throw new Error("la birthDate no puede ser futura");
      return true;
    }),
  body("profile.phone")
    .optional()
    .matches(/^\d{8,15}$/)
    .withMessage("el phone debe tener solo numeros, entre 8 y 15 digitos"),
];

// POST /api/auth/login
export const loginValidations = [
  body("email")
    .notEmpty()
    .withMessage("el email no debe de ir vacio")
    .isEmail()
    .withMessage("no hay formato email valido"),
  body("password")
    .notEmpty()
    .withMessage("la password no debe de ir vacia")
    .isString()
    .withMessage("la password no es del tipo string"),
];

// PUT /api/auth/profile (campos sueltos en el body, todos opcionales)
export const updateProfileValidations = [
  body("firstName")
    .optional()
    .isLength({ min: 2, max: 50 })
    .withMessage("el firstName debe tener entre 2 y 50 caracteres")
    .matches(/^[A-Za-zÁÉÍÓÚáéíóúÑñÜü\s]+$/)
    .withMessage("el firstName solo puede tener letras"),
  body("lastName")
    .optional()
    .isLength({ min: 2, max: 50 })
    .withMessage("el lastName debe tener entre 2 y 50 caracteres")
    .matches(/^[A-Za-zÁÉÍÓÚáéíóúÑñÜü\s]+$/)
    .withMessage("el lastName solo puede tener letras"),
  body("birthDate")
    .optional()
    .isISO8601()
    .withMessage("la birthDate no es una fecha valida")
    .bail()
    .custom((birthDate) => {
      if (new Date(birthDate) > new Date())
        throw new Error("la birthDate no puede ser futura");
      return true;
    }),
  body("phone")
    .optional()
    .matches(/^\d{8,15}$/)
    .withMessage("el phone debe tener solo numeros, entre 8 y 15 digitos"),
];
