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

module.exports = router;