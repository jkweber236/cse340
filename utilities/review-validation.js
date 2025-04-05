const reviewModel = require("../models/review-model")
const utilities = require(".")
const { body, validationResult } = require("express-validator")
const validate = {}

/***********************************
*  Review Validation Rules
***********************************/
validate.reviewRules = () => {
   return [
      body("review_text")
         .trim()
         .isLength({ min: 10})
         .withMessage("Provide review text of at least 10 characters.")
   ]
}

validate.checkWriteReviewData = async (req, res, next) => {
   const errors = validationResult(req);
   if (!errors.isEmpty()) {
      req.flash('notice', errors.array().map(err => err.msg).join(' '));
      return res.redirect(`/inv/detail/${req.body.inv_id}`);
   }
   next();
};

validate.checkUpdateReviewData = async (req, res, next) => {
   const errors = validationResult(req);
   if (!errors.isEmpty()) {
      req.flash('notice', errors.array().map(err => err.msg).join(' '));
      return res.redirect(`/review/edit/${req.body.review_id}`);
   }
   next();
};

module.exports = validate