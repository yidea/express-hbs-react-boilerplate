/**
 * routeApp
 */
import express from "express";
import path from "path";
import passport from "../../utils/PassportLocal"

let route = express.Router();

route.get("/", (req, res) => {
  res.render("index", {
    title: "index",
    bundles: {
      css: ""
    },
    content: "content"
  });
});

// curl -d "email=test@126.com&password=admin" http://127.0.0.1:3000/login
// curl -d "email=admin@gmail.com&password=admin" http://127.0.0.1:3000/login
route.route("/login")
  .get((req, res) => {
    res.render("login", { message: req.flash("error")});
  })
  // signin validate: if fail return error, if success redirect to blog/profile
  .post(passport.authenticate("local-login", {
    successRedirect: "/profile",
    failureRedirect: "/login",
    failureFlash: true
  }));

route.route("/signup")
  .get((req, res) => {
    res.render("signup", { message: req.flash("error")});
  })
  .post(passport.authenticate("local-signup", {
    successRedirect: "/profile",
    failureRedirect: "/signup",
    failureFlash: true
  }));

route.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/");
});

//route.get("/profile")

route.get("/user/:id", (req, res) => {
  res.json(req.params.id);
});

export default route;
