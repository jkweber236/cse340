const accountModel = require("../models/account-model")
const utilities = require(".")
const { body, validationResult } = require("express-validator")
const validate = {}

/***********************************
*  Registration Data Validation Rules
* ********************************* */
validate.registrationRules = () => {
   return [
     // firstname is required and must be string
      body("account_firstname")
         .trim()
         .escape()
         .notEmpty()
         .isLength({ min: 1 })
         .withMessage("Please provide a first name."), // on error this message is sent.

     // lastname is required and must be string
      body("account_lastname")
         .trim()
         .escape()
         .notEmpty()
         .isLength({ min: 2 })
         .withMessage("Please provide a last name."), // on error this message is sent.

      // valid email is required and cannot already exist in the database
      body("account_email")
         .trim()
         .isEmail()
         .normalizeEmail() // refer to validator.js docs
         .withMessage("A valid email is required.")
         .custom(async (account_email) => {
            const emailExists = await accountModel.checkExistingEmail(account_email)
            if (emailExists){
               throw new Error("Email exists. Please log in or use different email")
            }
         }),

     // password is required and must be strong password
      body("account_password")
         .trim()
         .notEmpty()
         .isStrongPassword({
            minLength: 12,
            minLowercase: 1,
            minUppercase: 1,
            minNumbers: 1,
            minSymbols: 1,
         })
         .withMessage("Password does not meet requirements."),
   ]
}

/* ******************************
 * Check data and return errors or continue to registration
 * ***************************** */
validate.checkRegData = async (req, res, next) => {
   const { account_firstname, account_lastname, account_email } = req.body
   let errors = []
   errors = validationResult(req)
   if (!errors.isEmpty()) {
      let nav = await utilities.getNav()
      res.render("account/register", {
         errors,
         title: "Registration",
         nav,
         account_firstname,
         account_lastname,
         account_email,
      })
      return
   }
   next()
}

/***********************************
*  Login Data Validation Rules
* ********************************* */
validate.loginRules = () => {
   return [
      // Valid email is required
      body("account_email")
         .trim()
         .isEmail()
         .normalizeEmail()
         .withMessage("A valid email is required.")
         .custom(async (account_email) => {
            // Check if email exists in the database
            const emailExists = await accountModel.checkExistingEmail(account_email)
            if (!emailExists) {
               throw new Error("Email not found. Please register first.")
            }
         }),

      // Password is required
      body("account_password")
         .trim()
         .notEmpty()
         .isStrongPassword({
            minLength: 12,
            minLowercase: 1,
            minUppercase: 1,
            minNumbers: 1,
            minSymbols: 1,
         })
         .withMessage("Password is invalid."),
   ]
}

/* ******************************
 * Check data and return errors or proceed with login
 * ***************************** */
validate.checkLoginData = async (req, res, next) => {
   const { account_email } = req.body
   let errors = []
   errors = validationResult(req)
   if (!errors.isEmpty()) {
      let nav = await utilities.getNav()
      res.render("account/login", {
         errors,
         title: "Login",
         nav,
         account_email,
      })
      return
   }
   next()
}

module.exports = validate

