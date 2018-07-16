const express      = require('express');
const userRouter   = express.Router();
const User         = require('../models/user');
const bcrypt       = require('bcryptjs');
const passport     = require('passport');


userRouter.get('/signup', (req, res, next)=>{

    res.render('userViews/signupPage');
})

userRouter.post("/signup", (req, res, next)=>{
    const password = req.body.password;
    const username = req.body.username;
    if(password === "" || username === ""){
      res.render('userViews/signupPage', {errorMessage: "Please fill in both a username and password to proceed."});
      return;
    }
  
    User.findOne({'username': username})
    .then((response)=>{
      if(response !== null){
        res.render('userViews/signupPage', {errorMessage: `Sorry ${username} is taken, please select another name.`});
        return;
      } //ends IF statement
  
      const salt        = bcrypt.genSaltSync(10);
      const hashedPassword = bcrypt.hashSync(password, salt);
  
      //now we create users/password objects
      User.create({username: username, password: hashedPassword})
      .then((response)=>{
        console.log("---------------------------------------------");
        res.redirect('/');
      })
      .catch((err)=>{
        next(err);
      });
  
    });
  });



userRouter.get("/login", (req, res, next) => {
    res.render("userViews/loginPage", {"message":req.flash("error")});
  });
  

userRouter.post("/login", passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/login",
    failureFlash: true,
    passReqToCallback: true
  }));


userRouter.get('/login', (req, res, next)=>{
    res.render('userViews/loginPage');
});

userRouter.post('/login', (req, res, next)=>{
    const theUsername = req.body.theUsername;
    const thePassword = req.body.thePassword;
    if (theUsername === "" || thePassword === "") {
        res.render("userViews/loginPage", {errorMessage: "Indicate a username and a password to log in"});
        return;
      }
    User.findOne({ "username": theUsername }, (err, user) => {
        if (err || !user) {
          res.render("userViews/loginPage", {errorMessage: "Sorry, that username doesn't exist" });
          return;
        }
        if (bcrypt.compareSync(thePassword, user.password)) {
          // Save the login in the session!
          req.session.currentUser = user;
          res.redirect("/");
        } else {
          res.render("userViews/loginPage", {errorMessage: "Incorrect password"});
        }
    }); // this ends the callback that runs after then User.findOne
});//this ends the route




userRouter.get("/logout", (req, res, next) => {
    req.logout();
    res.redirect("/login");
  });


module.exports = userRouter;