// ----------------------------------------------------------------------------
// PassportLocal
// ----------------------------------------------------------------------------
import passport from "passport";
import passportLocal from "passport-local";
import Logger from "./Logger";
//import ModelUser from "../server/models/modelUser";
let ModelUser = require("../server/models/modelUser");

let LocalStrategy = passportLocal.Strategy;

/**
 * Local-login
 */
passport.use("local-login", new LocalStrategy({
    usernameField: "email", //map input name to username field
    passwordField : "password"
  },
  (email, password, done) => {
    let message = "";
    ModelUser.promise.findOne({ "email": email })
      .then((user) => {
        console.log(user);
        if (!user) { // no username
          message = "Login failed: Invalid username";
          Logger.info(message);
          return done(null, false, { message: message });
        }

        if (!user.equalPassword(password)) {
          message = "Login failed: Invalid password";
          Logger.info(message);
          return done(null, false, { message: message });
        }

        message = "Login succeed: Goto Profile";
        Logger.info(message);
        return done(null, user);
      })
      .error((err) => {
        Logger.error(err);
        return done(err);
      });
  }
));

/**
 * Local-signup
 */
passport.use("local-signup", new LocalStrategy({
    usernameField: "email", //map input name to username field
    passwordField : "password",
    passReqToCallback: true //allow to access request object
  },
  (req, email, password, done) => {
    //if user exist: return error
    //if user not exist, validate/prep content, then save to db
    let message = "";
    let {blogTitle, blogDesc} = req.body;

    //TODO: case insenstive email
    ModelUser.promise.findOne({ "email": email })
      .then((user) => {
        if (user) {
          message = "Signup failed: Username already exists";
          Logger.info(message);
          return done(null, false, { message: message });
        }
        // save new user
        let User = new ModelUser();
        User.email = email;
        User.password = User.generateHash(password);
        User.blogTitle = blogTitle;
        User.blogDescription = blogDesc;
        User.promise.save()
          .then(() => {
            message = "Singup succeed: Goto Profile";
            Logger.info(message);
            return done(null, User);
          })
          .error((err) => {
            Logger.error(err);
          });
      })
      .error((err) => {
        Logger.error(err);
        return done(err);
      });
  }
));

/**
 * serializeUser & deserializeUser
 * - required for persistent login session
 */
// serializeUser: convert user object(unique key) to a single value to store in session. usually use user.id(from database), server cookie send to user to mark user
passport.serializeUser((user, done) => {
  return done(null, user.id);
});
// deserializeUser: convert user cookie back to object based cookie id
passport.deserializeUser((id, done) => {
  ModelUser.promise.findById(id)
    .then((user) => {
      return done(null, user);
    })
    .error((err) => {
      return done(err);
    });
});

module.exports = passport;
