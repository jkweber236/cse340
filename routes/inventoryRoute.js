// Needed Resources 
const express = require("express")
const router = new express.Router() 
const invController = require("../controllers/invController")
const utilities = require("../utilities/index")

// Route to build inventory by classification view
router.get("/type/:classificationId", utilities.handleErrors(invController.buildByClassificationId));
router.get("/detail/:invId", utilities.handleErrors(invController.buildCarDetailsById));

router.get('/', utilities.handleErrors(invController.displayManagement));
router.get('/add-classification', utilities.handleErrors(invController.addClassification));
router.get('/add-inventory', utilities.handleErrors(invController.addInventory));

module.exports = router;