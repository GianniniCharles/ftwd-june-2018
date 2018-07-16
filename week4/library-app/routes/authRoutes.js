const express      = require('express');
const userRouter   = express.Router();
const User         = require('../models/user');
const bcrypt       = require('bcryptjs');


userRouter.get('/signup', (req, res, next)=>{

    res.render('userViews/signupPage');
})

userRouter.post('/signup', (req, res, next)=>{
    const thePassword = req.body.thePassword;
    const theUsername = req.body.theUsername;
    if(thePassword === "" || theUsername === ""){
        res.render('userViews/signupPage', {errorMessage: 'Please fill in both a username and password in order to create an account'})
        return;
    }
    User.findOne({'username': theUsername})
    .then((responseFromDB)=>{
        if (responseFromDB !== null){
            res.render('userViews/signupPage', {errorMessage: `Sorry, the username ${theUsername} is awesome, so you cant have it. Too late! Be a beta tester next time`})
            return;
        } // ends the if statement
            const salt     = bcrypt.genSaltSync(10);
            const hashedPassword = bcrypt.hashSync(thePassword, salt);
            User.create({username: theUsername, password: hashedPassword})
            .then((response)=>{
                res.redirect('/');
            })
            .catch((err)=>{
                next(err);
            })
    }) // ends the .then from the user.findOne
}); // ends the route



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
    req.session.destroy((err) => {
      // cannot access session here
      res.redirect("/login");
    });
  });


module.exports = userRouter;