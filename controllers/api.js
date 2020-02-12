const apiRouter = require("express").Router();
const fetch = require("node-fetch");
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

// https://www.wienerlinien.at/ogd_realtime/monitor?&rbl=1212&rbl=1345&rbl=5568&rbl=2910&rbl=4203&rbl=4212&rbl=46&rbl=18&rbl=1303&rbl=3701
/** POST: /bim/:rbl 
 *  get data from Wiener Linien API, send response
 */ 
apiRouter.get("/bim/*", async (req, res) => {
  let RBL = req.query.rbl || null;
  if (RBL === null) {
    res.status(404).json({ msg: "wrong parameter" });
  };
  let url = "";
  for (let i = 0; i < RBL.length; i++) {
    if (i === 0) {
      url = `rbl=${RBL[i]}`;
    } else {
      url = `${url}&rbl=${RBL[i]}`;
    }
  };
  let response = await fetch("https://www.wienerlinien.at/ogd_realtime/monitor?" + url);
  let data = await response.json();
  if (response.ok) {
    res.status(202).json(data);
  } else {
    res.status(404).end();
  }
});


module.exports = apiRouter;
