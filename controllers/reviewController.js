const utilities = require("../utilities/")
const reviewModel = require("../models/review-model")
const invModel = require('../models/inventory-model')

const reviewCont = {}

reviewCont.writeReview = async function(req, res, next) {
   const { review, inv_id, account_id } = req.body
   try {
      const result = await reviewModel.addReview(review, inv_id, account_id)

      if (result) {
         req.flash("success", "Your review was successfully posted.")
         res.redirect(`/inv/detail/${inv_id}`)
      } else {
         req.flash("error", "Unable to post review. Please try again.")
         res.redirect(`/inv/detail/${inv_id}`)
      }
   } catch (error) {
      req.flash("error", "There was an error posting your review.")
      res.redirect(`/inv/detail/${inv_id}`)
   }
}

/* ***************************
*  Build and deliver review delete confirmation view
* ************************** */
reviewCont.buildReviewDelete = async function (req, res, next) {
   const review_id = parseInt(req.params.review_id)
   let nav = await utilities.getNav()
   const review = await reviewModel.getReviewById(review_id)
   const reviewData = Array.isArray(review) ? review[0] : review;
   const inv_id = reviewData.inv_id;
   const account_id = reviewData.account_id;
   const carDetails = await invModel.getCarDetailsById(inv_id);
   const carData = carDetails[0];
   const carTitle = `${carData.inv_year} ${carData.inv_make} ${carData.inv_model}`;
   const review_date = new Date(reviewData.review_date);
   const formattedDate = new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: '2-digit'
   }).format(review_date);
   res.render("./review/delete-confirm", {
      title: `Delete ${carTitle} Review`,
      nav,
      errors: null,
      review_text: reviewData.review_text,  
      review_date: formattedDate,  
      inv_id: reviewData.inv_id,  
      review_id: reviewData.review_id,
      account_id: account_id
   })
}

reviewCont.deleteReview = async function(req, res, next) {
   let nav = await utilities.getNav()
   const review_id = req.body.review_id;

   const deleteResult = await reviewModel.deleteReview(review_id)

   if (deleteResult) {
      req.flash("success", `Your review was successfully deleted.`)
      res.redirect("/account/")
   } else {
      req.flash("notice", "Review deletion failed.")
      res.status(500).redirect("/account/")
   }
}

reviewCont.getUserReviews = async function (req, res, next) {
   try {
      const account_id = res.locals.accountData.account_id 
      const reviews = await reviewModel.getReviewsByAccountId(account_id);  
      const nav = await utilities.getNav();

      res.render("account", {
         title: "Your Account",
         nav,
         reviews: reviews,  
         errors: null
      });
   } catch (error) {
      req.flash("error", "Unable to retrieve reviews.");
      res.redirect("/account");
   }
}

module.exports = reviewCont 