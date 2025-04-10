const pool = require("../database/")

async function addReview(review_text, inv_id, account_id) {
   try {
      const query = `
         INSERT INTO public.review(review_text, inv_id, account_id)
         VALUES ($1, $2, $3)
         RETURNING *;`

         const values = [review_text, inv_id, account_id];
         console.log("review_text:", review_text);
         console.log("inv_id:", inv_id);
         console.log("account_id:", account_id);
         return await pool.query(query, values);
   } catch (error) {
      console.error("addReview" + error)
   }
}

async function getReviewsByInvId(inv_id) {
   try {
      const data = await pool.query(
         `SELECT * FROM public.review AS r
         JOIN account AS a
         ON r.account_id = a.account_id
         WHERE r.inv_id = $1
         ORDER BY r.review_date DESC`,
         [inv_id]
      )
      return data.rows
   } catch (error) {
      console.error("getReviewsByInvId error " + error)
   }
}

async function getReviewById(review_id) {
   try {
      const data = await pool.query(
         `SELECT r.review_id, r.review_text, r.review_date, r.inv_id, a.account_firstname, a.account_lastname
         FROM public.review AS r
         JOIN account AS a ON r.account_id = a.account_id
         WHERE r.review_id = $1`,
         [review_id]
      );
      return data.rows[0];
   } catch (error) {
      console.error("getReviewById error: " + error);
   }
}

async function getReviewById(review_id) {
   try {
      const data = await pool.query(
         `SELECT r.review_id, r.review_text, r.review_date, r.inv_id, a.account_firstname, a.account_lastname
         FROM public.review AS r
         JOIN account AS a ON r.account_id = a.account_id
         WHERE r.review_id = $1`,
         [review_id]
      );
      return data.rows[0];
   } catch (error) {
      console.error("getReviewById error: " + error);
   }
}

async function getReviewsByAccountId(account_id) {
   try {
      const data = await pool.query(
         `SELECT r.review_id, r.review_text, r.review_date, r.inv_id,
         i.inv_make, i.inv_model, i.inv_year
         FROM public.review AS r
         JOIN public.inventory AS i ON r.inv_id = i.inv_id
         WHERE r.account_id = $1
         ORDER BY r.review_date DESC`,
         [account_id]
      );
      return data.rows;
   } catch (error) {
      console.error("getReviewByAccountId error: " + error);
      return [];
   }
}

/* ***************************
 *  Delete Review
 * ************************** */
async function deleteReview( review_id ) {
   try {
      const sql = 'DELETE FROM review WHERE review_id = $1'
      const data = await pool.query(sql, [review_id])
   return data
   } catch (error) {
      new Error("Delete Review Error")
   }
}

/* ***************************
 *  Update Review
 * ************************** */
async function updateReview(review_id, review_text) {
   try {
      const sql = 
         "UPDATE review SET review_text = $1 WHERE review_id = $2 RETURNING *";
      
      const data = await pool.query(sql, [review_text, review_id]);
      return data.rows[0]; 
   } catch (error) {
      console.error("updateReview model " + error);
   }
}

module.exports = { addReview, getReviewsByInvId, getReviewById, deleteReview, getReviewsByAccountId, updateReview }