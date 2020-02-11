
/** Server - Entry Point
 *  Initialisation, Middleware, Routers
 */

// Setup packages
const path = require("path");
const fs = require("fs");
const express = require("express");
const app = express();
const dotenv = require("dotenv");
dotenv.config();


// Middleware
app.use(express.json());
app.use(express.urlencoded());

const cookieParser = require("cookie-parser");
app.use(cookieParser());

const morgan = require("morgan");
app.use(morgan("dev"));           

const compression = require("compression");
app.use(compression()); 

const helmet = require("helmet");
app.use(helmet());               
app.use(helmet.noCache());

const cors = require("cors");
const options = { 
  origin: (process.env.NODE_ENV === "production") ? "https://meine-bim.com" : "*",
  credentials: true
}
app.use(cors(options));

const slowDown = require("express-slow-down");
app.enable("trust proxy");
const speedLimiter = slowDown({
  windowMs: 10 * 60 * 1000,       
  delayAfter: 100,                
  delayMs: 500                    
});
app.use(speedLimiter);

const errorhandler = require("errorhandler");
if (process.env.NODE_ENV === "development") {
  app.use(errorhandler());
}


// Static, Template Engine
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "html");            
app.engine("html", require("hbs").__express);
app.use("/files", express.static("views"));


// Controllers
const loginRouter = require("./controllers/login");
app.use(loginRouter);

const apiRouter = require("./controllers/api");
app.use(apiRouter);


// Routes 
app.get("/", (req, res) => {
  res.send("it works!");
})


// Error Page
app.use((req, res, next) => {         
  res.status(404).send("Error Page");
});


// Listen
const port = process.env.PORT || 8080;
app.listen(port, function() {
  console.log("App listening on port 8080");
});
