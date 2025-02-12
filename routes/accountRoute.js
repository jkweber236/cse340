const express = require("express")
const router = new express.Router() 
const utilities = require("../utilities/index")
const accountController = require("../controllers/accountController")

// Build login
router.get("/login", utilities.handleErrors(accountController.buildLogin))

// Build registration
router.get("/register", utilities.handleErrors(accountController.buildRegister))

// Register account
router.post("/register", utilities.handleErrors(accountController.registerAccount))

module.exports = router;