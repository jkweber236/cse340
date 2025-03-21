const express = require("express")
const router = new express.Router() 
const utilities = require("../utilities/index")
const regValidate = require('../utilities/account-validation')
const loginValidate = require('../utilities/account-validation')
const updateValidate = require('../utilities/account-validation')
const accountController = require("../controllers/accountController")

// Build login
router.get("/login", utilities.handleErrors(accountController.buildLogin))

// Build registration
router.get("/register", utilities.handleErrors(accountController.buildRegister))


router.get("/", utilities.checkLogin, utilities.handleErrors(accountController.buildAccountManagement))

// Process the registration data
router.post(
   "/register",
   regValidate.registrationRules(),
   regValidate.checkRegData,
   utilities.handleErrors(accountController.registerAccount)
)

// Process the login attempt
router.post(
   "/login",
   loginValidate.loginRules(),
   loginValidate.checkLoginData,
   utilities.handleErrors(accountController.accountLogin)
)

router.get(
   '/edit/:account_id',
   utilities.handleErrors(accountController.buildAccountUpdate)
)

router.post(
   '/update-account/',
   updateValidate.updateRules(),
   updateValidate.checkUpdateData,
   utilities.handleErrors(accountController.updateAccount)
)

router.post(
   '/update-password/',
   updateValidate.updatePasswordRules(),
   updateValidate.checkPasswordUpdate,
   utilities.handleErrors(accountController.changePassword)
)


module.exports = router;