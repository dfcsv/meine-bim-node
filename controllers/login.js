const loginRouter = require("express").Router();
const csrf = require("csurf");
const csrfProtection = csrf({ cookie: true });  
const validator = require("express-validator");
const validationService = require("../models/validationService.js");
const login = require("./loginHelpers").login;

/** GET: /login
 *  show login page
 */ 
loginRouter.get("/login", csrfProtection, (req, res) => {
    res.render("login", { csrfToken: req.csrfToken() });
});


/** POST: /login
 *  post username, password
 */ 
loginRouter.post("/login", csrfProtection, validationService.validateUser(), login,
  async (req, res) => {
    let errors = validator.validationResult(req);
    if (!errors.isEmpty()) {
      // validation errors
      res.render("login", { errors: errors.array(), csrfToken: req.csrfToken() });
    } else {
      if (req.isLoggedIn) {
        res.redirect("/");
      } else {
        res.render("login", { errors: req.loginErrors, csrfToken: req.csrfToken() });
      }
    }  
  }
);

/** POST: /loginAPI
 *  speak to JSON API; post username, password
 */ 
loginRouter.post("/loginAPI", validationService.validateUser(), login,
  async (req, res) => {
    let errors = validator.validationResult(req);
    let json = { msg: ""};
    if (!errors.isEmpty()) {
      // validation errors
      json.msg = "User or Password wrong"; 
      res.status(401).json(JSON.stringify(json));
    } else {
      if (req.isLoggedIn) {
        json.msg = "Login successful";
        res.status(202).json(JSON.stringify(json));
      } else {
        json.msg = req.loginErrors;
        res.status(404).json(JSON.stringify(json));
      }
    }  
  }
);  

module.exports = loginRouter;