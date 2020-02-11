const jwt = require("jsonwebtoken");
const userModel = require("../models/user.js");

/** Authenticate Middleware
 *  checks whether jwt contains user with @
 */
const authenticate = (req, res, next) => {
  try {
    const userToken = req.cookies["auth"] || null;
    const decodedToken = (userToken === null) ? { user : "" } : jwt.verify(userToken, process.env.SECRET);
    req.isLoggedIn = decodedToken.user.includes("@");
    next();
  }
  catch(err) {
    req.isLoggedIn = false;
    next();
  }
}


/** Login Middleware
 *  auth with jwt token
 */
const login = async (req, res, next) => {
  try {
    const email = req.body.email;
    const pw = req.body.password;
    const userToken = req.cookies["auth"] || null;
    const decodedToken = (userToken === null) ? { user : "" } : jwt.verify(userToken, process.env.SECRET);
  
    // JWT auth
    if (email === decodedToken.user) {
      req.isLoggedIn = true;
      req.loginErrors = [];
      next();
    } else {
      // if no JWT -> email, pw login
      let user = await userModel.findOneUser(email, pw);
      if (user.isPasswordTrue) {
        const token = jwt.sign({ user: user.email }, process.env.SECRET, { expiresIn: '1d' });
        res.cookie("auth", token, {
          expires: new Date(Date.now() + 1000 * 60 * 60 * 24), // 1d
          httpOnly: true
        });
        req.isLoggedIn = true;
        req.loginErrors = [];
        next();
      } else {
        req.isLoggedIn = false;
        req.loginErrors = [{msg: "User or Password wrong"}];
        next();
      }
    }
  } catch (err) {
    req.isLoggedIn = false;
    req.loginErrors = [{msg: "Error occurred. Try again."}];
    next();
  }
}



module.exports = {
  authenticate, login
};