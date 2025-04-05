const utilities = require("../utilities/")
const reviewModel = require("../models/review-model")

const reviewCont = {}

reviewCont.writeReview = async function(req, res, next) {
   const { review, inv_id, account_id } = req.body
   try {
      const result = await reviewModel.addReview(review, inv_id, account_id)

      if (result) {
         req.flash("notice", "Your review was successfully posted.")
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
   const reviewData = review[0]
   const inv_id = reviewData.inv_id;
   const account_id = reviewData.account_id;
   const carDetails = await invModel.getCarDetailsById(inv_id);
   const carData = carDetails[0];
   const carTitle = `${carData.inv_year} ${carData.inv_make} ${carData.inv_model}`;
   // const itemName = `${reviewData.review_id} ${reviewData.review_model}`
   res.render("./review/delete-confirm", {
      title: `Delete ${carTitle} Review`,
      nav,
      errors: null,
      review_text: reviewData.review_text,  
      review_date: reviewData.review_date,  
      inv_id: reviewData.inv_id,  
      review_id: reviewData.review_id,
      account_id: account_id
   })
}

reviewCont.deleteReview = async function(req, res, next) {
   let nav = await utilities.getNav()
   const review_id = parseInt(req.body.review_id)

   const {
      review_text,
      review_date,
      inv_id,
      account_id,
   } = req.body

   const deleteResult = await reviewModel.deleteReview( review_id )

   if (deleteResult) {
      req.flash("notice", `Your review was successfully deleted.`)
      res.redirect("/account/")
   } else {
      // const classificationSelect = await utilities.buildClassificationList(classification_id)
      // const itemName = `${inv_make} ${inv_model}`
      req.flash("notice", "Review deletion failed.")
      res.status(501).render("review/delete-confirm", {
      // title: "Delete " + itemName,
      title: "Delete fill in the blank",
      nav,
      // classificationSelect: classificationSelect,
      errors: null,
      review_id,
      })
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