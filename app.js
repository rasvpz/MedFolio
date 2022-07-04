const express = require("express");
const rateLimit = require("express-rate-limit");
const helmet = require("helmet");
const mongoSanitize = require("express-mongo-sanitize");
const xss = require("xss-clean");
const hpp = require("hpp");
const cors = require("cors");
const session = require("express-session");

const adminRoutes = require("./routes/adminRoutes");
const medFeedRoutes = require("./routes/medFeedRoutes");
const foliofitRoutes = require("./routes/foliofitRoutes");

const userRoutes = require("./routes/userRoutes");
const adsRoutes = require("./routes/adsRoutes");
const customerRoutes = require("./routes/customerRoutes");
const healthCare = require('./routes/healthCareRoute');

const globalErrHandler = require("./controllers/errorController");
const AppError = require("./utils/appError");
const app = express();

// Allow Cross-Origin requests
app.use(cors());

// Set security HTTP headers
app.use(helmet());

var EventEmitter = require('events').EventEmitter
let emitter = new EventEmitter()
emitter.setMaxListeners(100)
// Limit request from the same API
const limiter = rateLimit({
  max: 150,
  windowMs: 60 * 60 * 1000,
  message: "Too Many Request from this IP, please try again in an hour",
});
app.use("/api", limiter);

// Body parser, reading data from body into req.body
app.use(
  express.json({
    limit: "15kb",
  })
);

app.use(express.urlencoded({ extended: true }));

// Data sanitization against Nosql query injection
app.use(mongoSanitize());

// Data sanitization against XSS(clean user input from malicious HTML code)
app.use(xss());

// Prevent parameter pollution
app.use(hpp());

//express-session
app.use(
    session({
      secret: "keyboard cat",
      resave: false,
      saveUninitialized: true,
      cookie: { maxAge: 6000000000 },
    })
);

// Routes
app.use("/employee", express.static("public/images/employees"));
app.use("/master", express.static("public/images/master"));
app.use("/inventory", express.static("public/images/inventory"));

app.use("/admin", adminRoutes);
app.use("/medfeed", medFeedRoutes);
app.use("/foliofit", foliofitRoutes);

app.use('/healthcare', healthCare);
app.use("/user", userRoutes);
app.use("/ads", adsRoutes);
app.use("/customer", customerRoutes);
// handle undefined Routes
app.use("*", (req, res, next) => {
  const err = new AppError(404, "fail", "undefined route");
  next(err, req, res, next);
});


app.use(globalErrHandler);

module.exports = app;
