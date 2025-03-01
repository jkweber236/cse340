// Needed Resources 
const express = require("express")
const router = new express.Router() 
const invController = require("../controllers/invController")
const utilities = require("../utilities/index")
const validate = require('../utilities/management-validation')

// Route to build inventory by classification view
router.get("/type/:classificationId", utilities.handleErrors(invController.buildByClassificationId));
router.get("/detail/:invId", utilities.handleErrors(invController.buildCarDetailsById));

router.get('/', utilities.handleErrors(invController.displayManagement));

router.get('/add-classification', utilities.handleErrors(invController.buildAddClassification))
router.post(
   '/add-classification',
   validate.classificationRules(),
   validate.checkClassification,
   utilities.handleErrors(invController.addClassification)
)

router.get('/add-inventory', utilities.handleErrors(invController.buildAddInventory));
router.post(
   '/add-inventory',
   validate.inventoryRules(),
   validate.checkInventory,
   utilities.handleErrors(invController.addInventory)
)

module.exports = router;