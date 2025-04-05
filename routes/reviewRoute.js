const express = require("express")
const router = new express.Router() 
const utilities = require("../utilities/index")
const reviewController = require("../controllers/reviewController")

router.post(
   '/write-review',
   utilities.handleErrors(reviewController.writeReview)
)

// Route to delete review
router.get("/delete/:review_id", 
   utilities.handleErrors(reviewController.buildReviewDelete))
router.post("/delete", 
   utilities.handleErrors(reviewController.deleteReview))


// Routes to update review
router.get("/edit/:review_id", 
   utilities.handleErrors(reviewController.buildReviewUpdate));
router.post("/update/", 
   utilities.handleErrors(reviewController.updateReview));

module.exports = router;