const accountModel = require("../models/inventory-model")
const utilities = require(".")
const { body, validationResult } = require("express-validator")
const validate = {}

validate.classificationRules = () => {
   return [
      body("classification_name")
         .trim()
         .escape()
         .notEmpty()
         .isLength({ min: 2 })
         .isAlphanumeric()
         .withMessage("Provide a correct classification name.")
   ]
}

validate.checkClassification = async (req, res, next) => {
   const { classification_name } = req.body
   let errors = []
   errors = validationResult(req)
   if (!errors.isEmpty()) {
      let nav = await utilities.getNav()
      console.log("Errors occurred.")
      return res.render("./inventory/add-classification", {
         title: "Add New Classification",
         nav,
         errors,
         classification_name,
      })
   }
   next()
}

module.exports = validate