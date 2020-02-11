/** Validation Service
 */
const validator = require("express-validator");

// POST: /login
const validateUser = () => {
  return [
    validator.check("email", "Email must be an email").isEmail(),
    validator.check("email", "Email must not be empty").isLength({min: 1, max: 300}),
    validator.check("password", "Password must not be empty").isLength({min: 1, max: 300}),
    validator.sanitizeBody("email").trim().normalizeEmail().escape(),
    validator.sanitizeBody("password").escape()
  ]
} 

// POST: /api
const validateLocation = () => {
  return [
    validator.check("latitude").isNumeric(),
    validator.check("longitude").isNumeric(),
    validator.check("time").isString(),
    validator.sanitizeBody("latitude").trim().escape(),
    validator.sanitizeBody("longitude").trim().escape(),
    validator.sanitizeBody("time").trim().escape()
  ]
}


module.exports = {
   validateUser, validateLocation
};