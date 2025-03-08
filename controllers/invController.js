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

invCont.buildManagement = async function(req, res) {
   let nav = await utilities.getNav();
   let messages = req.flash("notice");

   const classificationSelect = await utilities.buildClassificationList()

   res.render("./inventory/management", {
      title: "Vehicle Management",
      nav,
      errors: null,
      classificationSelect: classificationSelect
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

   const addClassResult = await invModel.insertClassification(
      classificationName
   )

   if (addClassResult) {
      req.flash(
         "notice", `The ${classificationName} classification was successfully added.`
      )
      return res.redirect('/inv')
   } else {
      req.flash("notice", "Provide a correct classification name.")
      res.redirect('/inv/add-classification');
   }
};

invCont.buildAddInventory = async function (req, res, next) {
   let nav = await utilities.getNav()
   let classificationList = await utilities.buildClassificationList(req.body.classification_id);
   res.render("./inventory/add-inventory", {
      title: 'Add New Inventory',
      nav,
      errors: null,
      classificationList: classificationList,
   });
}

invCont.addInventory = async function(req, res) {

   const inventoryData = {
      classification_id: req.body.classification_id,
      inv_make: req.body.inv_make,
      inv_model: req.body.inv_model,
      inv_year: req.body.inv_year,
      inv_description: req.body.inv_description,
      inv_image: req.body.inv_image,
      inv_thumbnail: req.body.inv_thumbnail,
      inv_price: req.body.inv_price,
      inv_miles: req.body.inv_miles,
      inv_color: req.body.inv_color
   };

   const addInvResult = await invModel.insertInventory(inventoryData);

   if (addInvResult) {
      req.flash(
         "notice", `The ${inventoryData.inv_make} ${inventoryData.inv_model} was successfully added.`
      )
      return res.redirect('/inv')
   } else {
      req.flash("notice", `Failed to add ${inventoryData.inv_make} ${inventoryData.inv_model} to inventory`)
      return res.render("./inventory/add-inventory", {
         title: "Add New Inventory",
         nav, 
         errors: req.validationErrors(),
         classificationList: classificationList, 
         locals: req.body
      })
   }
};

/* ***************************
 *  Return Inventory by Classification As JSON
 * ************************** */
invCont.getInventoryJSON = async (req, res, next) => {
   const classification_id = parseInt(req.params.classification_id)
   const invData = await invModel.getInventoryByClassificationId(classification_id)
   if (invData[0].inv_id) {
      return res.json(invData)
   } else {
      next(new Error("No data returned"))
   }
}

module.exports = invCont