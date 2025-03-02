const invModel = require("../models/inventory-model")
const utilities = require("../utilities/")

const invCont = {}

/* ***************************
 *  Build inventory by classification view
 * ************************** */
invCont.buildByClassificationId = async function (req, res, next) {
   const classification_id = req.params.classificationId
   const data = await invModel.getInventoryByClassificationId(classification_id)
   const grid = await utilities.buildClassificationGrid(data)
   let nav = await utilities.getNav()
   const className = data[0].classification_name
   res.render("./inventory/classification", {
      title: className + " vehicles",
      nav,
      grid,
      errors: null,
   })
}

invCont.buildCarDetailsById = async function (req, res, next) {
   const inv_id = req.params.invId
   const data = await invModel.getCarDetailsById(inv_id)
   const details = await utilities.buildCarDetails(data)
   let nav = await utilities.getNav()
   const vehicleName = data[0].inv_make + ' ' + data[0].inv_model
   res.render("./inventory/details", {
      title: vehicleName + " Details",
      nav, 
      details,
      errors: null,
   })
}

invCont.displayManagement = async function(req, res) {
   let nav = await utilities.getNav();
   let messages = req.flash("notice");
   res.render("./inventory/management", {
      title: "Vehicle Management",
      nav,
      errors: null,
   });
};

invCont.buildAddClassification = async function (req, res, next) {
   let nav = await utilities.getNav()
   res.render("./inventory/add-classification", {
      title: 'Add New Classification',
      nav,
      errors: null,
   });
}

invCont.addClassification = async function(req, res) {
   const classificationName = req.body.classification_name

   const addResult = await invModel.insertClassification(
      classificationName
   )

   let nav = await utilities.getNav();

   if (addResult) {
      req.flash(
         "notice", `The ${classificationName} classification was successfully added.`
      )
      return res.redirect('/inv')
   } else {
      req.flash("notice", "Provide a correct classification name.")
      res.redirect('/inv/add-classification');
   }
};

invCont.addInventory = async function(req, res) {
   let nav = await utilities.getNav();
   let classificationList = await utilities.buildClassificationList();

   res.render("./inventory/add-inventory", {
      title: 'Add New Inventory',
      nav,
      classificationList,
      errors: null,
   });
};

module.exports = invCont