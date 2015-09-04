/**
 * express
 *
 * # run
 * - dev
 * npm start dev
 * - prod
 * npm start
 * http://localhost:3000/
 */
// ----------------------------------------------------------------------------
// Express Server
// ----------------------------------------------------------------------------
let path = require("path");
let _ = require("lodash");
let Promise = require("songbird");
let express = require("express");
let exphbs = require("express-handlebars");
let morgan = require("morgan");
let bodyParser = require("body-parser");
let cookieParser = require("cookie-parser");
let methodOverride = require("method-override");
let mime = require("mime-types");
let favicon = require("serve-favicon");
let compression = require("compression");
let session = require("express-session");
let passport = require("passport");
let LocalStrategy = require("passport-local").Strategy;

let logger = require("../utils/Logger");
let Constant = require("../configs/Constant");
let hbsHelper = require("../utils/HbsHelper");
let routeApp = require("./routes/routeApp");

const HOST = process.env.HOST || "127.0.0.1",
  HTTP_PORT = process.env.PORT || "3000",
  NODE_ENV_PROD = "production",
  NODE_ENV_DEV = "development",
  NODE_ENV = process.env.NODE_ENV || NODE_ENV_DEV;

/**
 * Passport local
 * passReqToCallback?
 */
let admin = {
  email: "admin@admin.com",
  password: "asdf"
};
passport.use(new LocalStrategy({
    usernameField: "email"
  },
  (username, password, cb) => {
    if (username === admin.email && password === admin.password) {
      return cb(null, admin);
    }
    return cb(null, {error: "Invalid username or password"});
  }
));
// serializeUser: convert user object(unique key) to a single value to store in session. usually use user.id(from database), server cookie send to user to mark user
passport.serializeUser((user, cb) => {
  return cb(null, user.email);
});
// deserializeUser: convert user cookie back to object based cookie id
passport.deserializeUser((id, cb) => {
  return cb(null, admin);
});

/**
 * Express Middleware
 */
let app = express();
var hbs = exphbs.create({
  extname: ".hbs",
  helpers: hbsHelper,
  defaultLayout: "main",
  layoutsDir: path.resolve(path.join(__dirname, "views/layouts")),
  partialsDir: path.resolve(path.join(__dirname, "views/partials"))
});

// Register `hbs` as our view engine using its bound `engine()` function.
app.set("views", __dirname + "/views");
app.set("view engine", "hbs");
app.engine("hbs", hbs.engine);
app.use(favicon(path.join(process.cwd(), "/client/images/favicon.ico")));
app.use(express.static("client", { maxage: "24h" })); // static assets, set Etag, maxage
app.disable("x-powered-by"); // X-Powered-By header has no functional value. Keeping it makes it easier for an attacker to build the site"s profile
app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded w req.body
app.use(methodOverride()); // method override
app.use(cookieParser(Constant.cookieSecret)); // cookieParser must be before express-session. req.cookies
app.use(session({ // req.session
  secret: Constant.cookieSecret,
  resave: true,
  saveUninitialized: true,
  cookie: {maxAge: 3600000} //1 hour
}));
app.use(passport.initialize()); // Use the passport middleware to enable passport
app.use(passport.session()); // Enable passport persistent sessions

app.locals.host = HOST; // app.locals persist thru life of app
if (NODE_ENV === NODE_ENV_DEV) {
  app.use(morgan("dev")); // http request logger middleware
} else {
  app.enable("view cache"); // enable HBS view caching
  app.use(compression()); // gzip response for prod
}

/**
 * Express Routes
 */
// app
app.use("/", routeApp);
// api
//app.use("/api", cors(), routerApi);

// 404 custom error handler, put at last
app.use((req, res) => { //handle all unhandled requests, put at bottom
  res.status(404).render("404", {title: "404 Sorry, page not found"});
});

/**
 * Express Start
 */
app.listen(HTTP_PORT);
logger.info(`Express server is running at http://${HOST}:${HTTP_PORT}`);

module.exports = app;
