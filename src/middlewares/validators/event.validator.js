import { body, param } from "express-validator";
import { eventModel } from "../../models/event.model.js";
import { categoryModel } from "../../models/category.model.js";

export const eventCreateValidations = [
  body("title")
    .notEmpty()
    .withMessage("el title no debe de ir vacio")
    .isString()
    .withMessage("el title no es del tipo string")
    .isLength({ min: 3, max: 150 })
    .withMessage("el title debe tener entre 3 y 150 caracteres")
    .bail()
    .custom(async (title) => {
      const titleExist = await eventModel.findOne({ title });
      if (titleExist) throw new Error("el title ya existe y esta en uso");
      return true;
    }),
  body("description")
    .notEmpty()
    .withMessage("la description no debe de ir vacia")
    .isString()
    .withMessage("la description no es del tipo string")
    .isLength({ min: 20 })
    .withMessage("la description debe tener minimo 20 caracteres"),
  body("start_Date")
    .notEmpty()
    .withMessage("la start_Date no debe de ir vacia")
    .isISO8601()
    .withMessage("la start_Date no es una fecha valida"),
  body("end_Date")
    .notEmpty()
    .withMessage("la end_Date no debe de ir vacia")
    .isISO8601()
    .withMessage("la end_Date no es una fecha valida")
    .bail()
    .custom((end_Date, { req }) => {
      if (new Date(end_Date) <= new Date(req.body.start_Date))
        throw new Error("la end_Date debe ser posterior a la start_Date");
      return true;
    }),
  body("capacity")
    .notEmpty()
    .withMessage("la capacity no debe de ir vacia")
    .isInt({ min: 1 })
    .withMessage("la capacidad debe ser un entero mayor o igual a 1"),
  body("price")
    .optional()
    .isFloat({ min: 0 })
    .withMessage("el precio debe ser un numero mayor o igual a 0"),
  body("status")
    .optional()
    .isIn(["scheduled", "cancelled", "finished"])
    .withMessage('el status debe ser "scheduled", "cancelled" o "finished"'),
  body("location").isObject().withMessage("la location debe ser un objeto"),
  body("location.venue")
    .notEmpty()
    .withMessage("el venue no debe de ir vacio")
    .isLength({ min: 3, max: 100 })
    .withMessage("el venue debe tener entre 3 y 100 caracteres"),
  body("location.address")
    .notEmpty()
    .withMessage("el address no debe de ir vacio")
    .isLength({ min: 5, max: 150 })
    .withMessage("el address debe tener entre 5 y 150 caracteres"),
  body("location.city")
    .notEmpty()
    .withMessage("la city no debe de ir vacia")
    .isLength({ min: 2, max: 50 })
    .withMessage("la city debe tener entre 2 y 50 caracteres"),
  body("catogories")
    .optional()
    .isArray()
    .withMessage("las catogories deben ser un array"),
  body("catogories.*")
    .isMongoId()
    .withMessage("cada category debe ser un MongoId valido"),
  body("catogories")
    .optional()
    .custom(async (catogories) => {
      // 1. Set elimina los ids repetidos: si mandan [A, A], queda [A]
      const unique = [...new Set(catogories)];
      // 2. cuenta cuántas categorías de esa lista existen realmente en la base
      const count = await categoryModel.countDocuments({
        _id: { $in: unique },
      });
      // 3. si encontró menos de las que mandaron, alguna no existe
      if (count !== unique.length)
        throw new Error("alguna de las catogories enviadas no existe");
      // 4. si coinciden, la validación pasa
      return true;
    }),
];

export const eventUpdateValidations = [
  body("title")
    .optional()
    .isString()
    .withMessage("el title no es del tipo string")
    .isLength({ min: 3, max: 150 })
    .withMessage("el title debe tener entre 3 y 150 caracteres")
    .bail()
    .custom(async (title, { req }) => {
      const titleExist = await eventModel.findOne({
        title,
        _id: { $ne: req.params.id },
      });
      if (titleExist) throw new Error("el title ya existe y esta en uso");
      return true;
    }),
  body("description")
    .optional()
    .isString()
    .withMessage("la description no es del tipo string")
    .isLength({ min: 20 })
    .withMessage("la description debe tener minimo 20 caracteres"),
  body("start_Date")
    .optional()
    .isISO8601()
    .withMessage("la start_Date no es una fecha valida"),
  body("end_Date")
    .optional()
    .isISO8601()
    .withMessage("la end_Date no es una fecha valida")
    .bail()
    .custom(async (end_Date, { req }) => {
      let start = req.body.start_Date;
      if (!start) {
        const event = await eventModel.findById(req.params.id);
        start = event?.start_Date;
      }
      if (start && new Date(end_Date) <= new Date(start))
        throw new Error("la end_Date debe ser posterior a la start_Date");
      return true;
    }),
  body("capacity")
    .optional()
    .isInt({ min: 1 })
    .withMessage("la capacity debe ser un entero mayor o igual a 1"),
  body("price")
    .optional()
    .isFloat({ min: 0 })
    .withMessage("el price debe ser un numero mayor o igual a 0"),
  body("status")
    .optional()
    .isIn(["scheduled", "cancelled", "finished"])
    .withMessage('el status debe ser "scheduled", "cancelled" o "finished"'),
  body("location")
    .optional()
    .isObject()
    .withMessage("la location debe ser un objeto"),
  body("location.venue")
    .optional()
    .isLength({ min: 3, max: 100 })
    .withMessage("el venue debe tener entre 3 y 100 caracteres"),
  body("location.address")
    .optional()
    .isLength({ min: 5, max: 150 })
    .withMessage("el address debe tener entre 5 y 150 caracteres"),
  body("location.city")
    .optional()
    .isLength({ min: 2, max: 50 })
    .withMessage("la city debe tener entre 2 y 50 caracteres"),
  body("catogories")
    .optional()
    .isArray()
    .withMessage("las catogories deben ser un array"),
  body("catogories.*")
    .isMongoId()
    .withMessage("cada category debe ser un MongoId valido"),
  body("catogories")
    .optional()
    .custom(async (catogories) => {
      const unique = [...new Set(catogories)];
      const count = await categoryModel.countDocuments({
        _id: { $in: unique },
      });
      if (count !== unique.length)
        throw new Error("alguna de las catogories enviadas no existe");
      return true;
    }),
];

export const eventIdValidations = [
  param("id")
    .isMongoId()
    .withMessage("el id no es un MongoId valido")
    .bail()
    .custom(async (id) => {
      const event = await eventModel.findById(id);
      if (!event) throw new Error("el evento no existe");
      return true;
    }),
];
