const pool = require("../database/")

/* ***************************
 *  Get all classification data
 * ************************** */
async function getClassifications(){
  return await pool.query("SELECT * FROM public.classification ORDER BY classification_name")
}

/* ***************************
 *  Get all inventory items and classification_name by classification_id
 * ************************** */
async function getInventoryByClassificationId(classification_id) {
  try {
    const data = await pool.query(
      `SELECT * FROM public.inventory AS i 
      JOIN public.classification AS c 
      ON i.classification_id = c.classification_id 
      WHERE i.classification_id = $1`,
      [classification_id]
    )
    return data.rows
  } catch (error) {
    console.error("getclassificationsbyid error " + error)
  }
}

/* ***************************
 *  Get the details for a single car
 * ************************** */
async function getCarDetailsById(inv_id) {
  try {
    const data = await pool.query(
      `SELECT * FROM public.inventory AS i
      WHERE i.inv_id = $1`,
      [inv_id]
    )
    return data.rows
  } catch (error) {
    console.error("getcardetailsbyid error " + error)
  }
}

async function insertClassification(classificationName) {
  try {
    const query = `
      INSERT INTO public.classification(classification_name)
      VALUES ($1)
      RETURNING *;`

      const values = [classificationName];
      return await pool.query(query, values);
  } catch (error) {
    console.error("insertClassification error " + error)
  }
}

async function insertInventory(inventoryData) {
  try {
    const query = `
        INSERT INTO public.inventory(
        classification_id, 
        inv_make, 
        inv_model, 
        inv_year, 
        inv_description, 
        inv_image, 
        inv_thumbnail, 
        inv_price, 
        inv_miles, 
        inv_color
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
      RETURNING *;
    `;

    const values = [
      inventoryData.classification_id, 
      inventoryData.inv_make, 
      inventoryData.inv_model, 
      inventoryData.inv_year, 
      inventoryData.inv_description, 
      inventoryData.inv_image, 
      inventoryData.inv_thumbnail, 
      inventoryData.inv_price, 
      inventoryData.inv_miles, 
      inventoryData.inv_color
    ];

    return await pool.query(query, values);
  } catch (error) {
    console.error("insertInventory error " + error)
  }
}

module.exports = {getClassifications, getInventoryByClassificationId, getCarDetailsById, insertClassification, insertInventory };