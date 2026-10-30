import { body, param } from "express-validator";
import { categoryModel } from "../../models/category.model.js";

export const categoryCreateValidations = [
  body("name")
    .notEmpty()
    .withMessage("el name no debe de ir vacio")
    .isString()
    .withMessage("el name no es del tipo string")
    .isLength({ min: 2, max: 30 })
    .withMessage("el name debe tener entre 2 y 30 caracteres")
    .bail()
    .custom(async (name) => {
      const nameExist = await categoryModel.findOne({ name });
      if (nameExist) throw new Error("el name ya existe y esta en uso");
      return true;
    }),
  body("description")
    .optional()
    .isString()
    .withMessage("la description no es del tipo string")
    .isLength({ max: 200 })
    .withMessage("la description no puede superar los 200 caracteres"),
];

export const categoryUpdateValidations = [
  body("name")
    .optional()
    .isString()
    .withMessage("el name no es del tipo string")
    .isLength({ min: 2, max: 30 })
    .withMessage("el name debe tener entre 2 y 30 caracteres")
    .bail()
    .custom(async (name, { req }) => {
      const nameExist = await categoryModel.findOne({
        name,
        _id: { $ne: req.params.id },
      });
      if (nameExist) throw new Error("el name ya existe y esta en uso");
      return true;
    }),
  body("description")
    .optional()
    .isString()
    .withMessage("la description no es del tipo string")
    .isLength({ max: 200 })
    .withMessage("la description no puede superar los 200 caracteres"),
];

export const categoryIdValidations = [
  param("id")
    .isMongoId()
    .withMessage("el id no es un MongoId valido")
    .bail()
    .custom(async (id) => {
      const category = await categoryModel.findById(id);
      if (!category) throw new Error("la categoria no existe");
      return true;
    }),
];
