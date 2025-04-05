const express = require("express")
const router = new express.Router() 
const utilities = require("../utilities/index")
const reviewValidate = require('../utilities/review-validation')
const reviewController = require("../controllers/reviewController")

router.post(
   '/write-review',
   reviewValidate.reviewRules(),
   reviewValidate.checkWriteReviewData,
   utilities.handleErrors(reviewController.writeReview)
)

// Route to delete review
router.get("/delete/:review_id", 
   utilities.handleErrors(reviewController.buildReviewDelete))
router.post("/delete", 
   utilities.handleErrors(reviewController.deleteReview))


// Routes to update review
router.get("/edit/:review_id", 
   reviewValidate.reviewRules(),
   utilities.handleErrors(reviewController.buildReviewUpdate));
router.post("/update/", 
   reviewValidate.reviewRules(),
   reviewValidate.checkUpdateReviewData,
   utilities.handleErrors(reviewController.updateReview));

module.exports = router;