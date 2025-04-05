const invModel = require("../models/inventory-model")
const Util = {}
const jwt = require("jsonwebtoken")
require("dotenv").config()

/* ************************
 * Constructs the nav HTML unordered list
 ************************** */
Util.getNav = async function (req, res, next) {
  let data = await invModel.getClassifications()
  let list = "<ul>"
  list += '<li><a href="/" title="Home page">Home</a></li>'
  data.rows.forEach((row) => {
    list += "<li>"
    list +=
      '<a href="/inv/type/' +
      row.classification_id +
      '" title="See our inventory of ' +
      row.classification_name +
      ' vehicles">' +
      row.classification_name +
      "</a>"
    list += "</li>"
  })
  list += "</ul>"
  return list
}

/* **************************************
* Build the classification view HTML
* ************************************ */
Util.buildClassificationGrid = async function(data){
  let grid
  if(data.length > 0){
    grid = '<ul id="inv-display">'
    data.forEach(vehicle => { 
      grid += '<li>'
      grid +=  '<a href="../../inv/detail/'+ vehicle.inv_id 
      + '" title="View ' + vehicle.inv_make + ' '+ vehicle.inv_model 
      + 'details"><img src="' + vehicle.inv_thumbnail 
      +'" alt="Image of '+ vehicle.inv_make + ' ' + vehicle.inv_model 
      +' on CSE Motors"></a>'
      grid += '<div class="namePrice">'
      grid += '<hr />'
      grid += '<h2>'
      grid += '<a href="../../inv/detail/' + vehicle.inv_id +'" title="View ' 
      + vehicle.inv_make + ' ' + vehicle.inv_model + ' details">' 
      + vehicle.inv_make + ' ' + vehicle.inv_model + '</a>'
      grid += '</h2>'
      grid += '<span>$' 
      + new Intl.NumberFormat('en-US').format(vehicle.inv_price) + '</span>'
      grid += '</div>'
      grid += '</li>'
    })
    grid += '</ul>'
  } else { 
    grid += '<p class="notice">Sorry, no matching vehicles could be found.</p>'
  }
  return grid
}

/* **************************************
* Build the car details view HTML
* ************************************ */
Util.buildCarDetails = async function(data) {
  let details 
    if (data.length > 0) {

      details = '<div id="vehicle-details">'
      const vehicle = data[0]
      details += '<h1>'
      details += vehicle.inv_year + ' ' + vehicle.inv_make + ' ' + vehicle.inv_model
      details += '</h1>'
      details += '<img src="' + vehicle.inv_image
      + '" alt="Image of '+ vehicle.inv_make + ' ' + vehicle.inv_model
      + ' on CSE Motors">'
      details += '<div class=vehicle-summary>'
      details += '<h2>'
      details += vehicle.inv_make + ' ' + vehicle.inv_model + ' Details'
      details += '</h2>'
      details += '<p><strong>Price: <span>$' + new Intl.NumberFormat("en-US").format(vehicle.inv_price) + '</span></strong></p>'
      details += '<p><strong>Description: </strong>' + vehicle.inv_description + '</p>'
      details += '<p><strong>Color: </strong>' + vehicle.inv_color + '</p>'
      details += '<p><strong>Miles: </strong><span>' + new Intl.NumberFormat("en-US").format(vehicle.inv_miles) + '</span></p>';
      details += '</div>'
      details += '</div>'
    } else { 
      details += '<p class="notice">Sorry, no matching vehicles could be found.</p>'
    }
    return details
}

Util.buildClassificationList = async function (classification_id = null) {
    let data = await invModel.getClassifications()
    let classificationList =
      '<select name="classification_id" id="classificationList" required>'
    classificationList += "<option value=''>Choose a Classification</option>"
    data.rows.forEach((row) => {
      classificationList += '<option value="' + row.classification_id + '"'
      if (
        classification_id != null &&
        row.classification_id == classification_id
      ) {
        classificationList += " selected "
      }
      classificationList += ">" + row.classification_name + "</option>"
    })
    classificationList += "</select>"
    return classificationList
  }

Util.buildReviewsList = async function(data) {
  let reviews = "";
  if (data.length > 0) {
    reviews += "<ul>";
    data.forEach(review => {
      const firstInitial = review.account_firstname ? review.account_firstname.charAt(0) : "";
      const lastName = review.account_lastname ? review.account_lastname.replace(/\s+/g, '') : "";
      const screenName = firstInitial + lastName;

      const reviewDate = new Date(review.review_date).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric"
      });
      reviews += "<li>";
      reviews += `<p class="review-label"><strong>${screenName}</strong> wrote on ${reviewDate}</p>`;
      reviews += `<p class="review-text">${review.review_text}</p>`;
      reviews += "</li>";
    });
    reviews += "</ul>";
  } else {
    reviews += `<p class="review-notice">Be the first to write a review.</p>`
  }
  return reviews;
};

Util.buildUserReviews = async function(data) {

  let reviews = "";
  const reviewList = Array.isArray(data) ? data : [];

  if (reviewList.length > 0) {
    reviews += "<ul>";
    reviewList.forEach((review, index) => {
      const year = review.inv_year;
      const make = review.inv_make;
      const model = review.inv_model;
      const reviewDate = new Date(review.review_date).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric"
      });
      reviews += "<li>";
      reviews += `<p>${index + 1}. Reviewed the ${year} ${make} ${model} on ${reviewDate}</p>`;
      reviews += `
        <div class="review-links">
          | <a href="/review/edit/${review.review_id}">Edit</a> |
          <a href="/review/delete/${review.review_id}">Delete</a>
        </div>
      `;
      reviews += "</li>";
    });
    reviews += "</ul>";
  } else {
    reviews += `<p>You have not written any reviews yet.</p>`;
  }
  return reviews;
};

/* ****************************************
 * Middleware For Handling Errors
 * Wrap other function in this for 
 * General Error Handling
 **************************************** */
Util.handleErrors = fn => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next)

/* ****************************************
* Middleware to check token validity
**************************************** */
Util.checkJWTToken = (req, res, next) => {
  if (req.cookies.jwt) {
    jwt.verify(
    req.cookies.jwt,
    process.env.ACCESS_TOKEN_SECRET,
    function (err, accountData) {
      if (err) {
        req.flash("Please log in")
        res.clearCookie("jwt")
        return res.redirect("/account/login")
      }
      res.locals.accountData = accountData
      res.locals.loggedin = 1
      next()
    })
  } else {
    next()
  }
}

/* ****************************************
*  Check Account Type
* ****************************************/
Util.checkAccountType = (req, res, next) => {
  if (res.locals.loggedin)
  {
    if (res.locals.accountData.account_type == "Employee" || res.locals.accountData.account_type == "Admin") {
      next()
    } else {
      req.flash("notice", "Login required. You must be an Employee or Admin to access this page.")
      return res.redirect("/account/login")
    }
  } else {
    req.flash("Please log in.")
    return res.redirect("/account/login")
  }
}

/* ****************************************
 *  Check Login
 * ************************************ */
Util.checkLogin = (req, res, next) => {
  if (res.locals.loggedin) {
    next()
  } else {
    req.flash("notice", "Please log in.")
    return res.redirect("/account/login")
  }
}

module.exports = Util