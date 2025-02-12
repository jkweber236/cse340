const express = require("express")
const router = new express.Router() 
const utilities = require("../utilities/index")
const regValidate = require('../utilities/account-validation')
const loginValidate = require('../utilities/account-validation')
const accountController = require("../controllers/accountController")

// Build login
router.get("/login", utilities.handleErrors(accountController.buildLogin))

// Build registration
router.get("/register", utilities.handleErrors(accountController.buildRegister))

// Process the registration data
router.post(
   "/register",
   regValidate.registationRules(),
   regValidate.checkRegData,
   utilities.handleErrors(accountController.registerAccount)
)

// Process the login attempt
router.post(
   "/login",
   loginValidate.loginRules(),
   loginValidate.checkLoginData,
   (req, res) => {
      res.status(200).send('login process')
   }
)

module.exports = router;