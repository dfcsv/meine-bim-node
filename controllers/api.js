const apiRouter = require("express").Router();
const validator = require("express-validator");
const validationService = require("../models/validationService.js");
const authenticate = require("./loginHelpers").authenticate;

const locationModel = require("../models/location.js");

/** GET: /api 
 * render data view (login) or log in
 */ 
apiRouter.get("/api", authenticate, 
  async (req, res) => {
    if (req.isLoggedIn) {
      let data = await locationModel.getLocation();
      res.render("data", { data: data });
    } else {
      res.redirect("/login");
    }
  }
);


/** POST: /api 
 * post new data
 */ 
apiRouter.post("/api", validationService.validateLocation(), 
  async (req, res) => {
    let errors = validator.validationResult(req);
    if (!errors.isEmpty()) {
      // validation errors
      res.status(404).end();
    } else {
      // post data to DB
      const { latitude, longitude, time } = req.body;
      const agent = req.header("user-agent");
      locationModel.postLocation(latitude, longitude, time, agent);
      res.status(202).end();
    }
  }
);

module.exports = apiRouter;
