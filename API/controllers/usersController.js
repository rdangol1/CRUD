"use strict";

const User = require("../models/user"),
passport = require("passport"),
getUserParams = body => {
  return {
    name: {
      first: body.first,
      last: body.last
    },
    email: body.email,
    password: body.password,
    zipCode: body.zipCode
  };
};

module.exports = {
    index:(req,res,next) => {
        User.find()
        .then(users =>{
            res.locals.users = users;
            next();
        })
        .catch( error =>{
            console.log(`Error fetching user data: ${error.message}`);
            next(error);
        });
    },
    indexView:(req,res)=> {
        res.render("users/index");
    },
    new:(req,res)=> {
        res.render("users/new");
    },
    
    create:(req,res, next) => {
        if (req.skip) return next();
        let userParams = getUserParams(req.body);
        let newUser = new User(userParams);

        User.register(newUser, req.body.password, (error,user) => {
            if (user) {
                req.flash("success", `${user.fullName}'s account created successfully!`);
                res.locals.redirect = "/users";
                next();
            } 
            else{
                req.flash("error", `Failed to create user account because: ${error.message}.`);
                res.locals.redirect = "/users/new";
                next();
            }
        });
      
    },
    redirectView: (req,res, next) => {
        let redirectPath = res.locals.redirect;
        if(redirectPath != undefined )res.redirect(redirectPath);
        else next();
    },

    authenticate: passport.authenticate("local", {
        failureRedirect: "/users/login",
        failureFlash: "Failed to login.",
        successRedirect: "/",
        successFlash: "Successfully Logged in!"
    }),
    show: (req,res, next) => {
        let userId = req.params.id;
        User.findById(userId)
        .then( user => {
            res.locals.user = user;
            next();
        })
        .catch( error =>{
            console.log(`Error fetching user by ID: ${error.message}`);
        })
    },
    showView:(req,res, next) => {
        res.render("users/show");
    },
    edit: (req,res, next) => {
        let userId = req.params.id;
        User.findById(userId)
        .then( user => {
            res.render("users/edit", {user});
        })
        .catch (error =>{
            console.log(`Error fetching user by ID: ${error.message}`);
            next(error);
        })
    },
    update:(req,res, next) => {
        if (req.skip) return next();
        let userId = req.params.id;
        let updatedUser = new User({
            name : {
                first:req.body.first,
                last:req.body.last
            },
            email:req.body.email,
            password:req.body.password,
            zipCode: req.body.zipCode

        });
        User.findByIdAndUpdate(userId, updatedUser)
        .then(user => {
            res.locals.user = user;
            res.locals.redirect =`/users/${user._id}`;
            next();
        })
        .catch(error =>{
            console.log(`Error fetching user by ID: ${error.message}`);
            next(error);
        })
    },
    delete:(req,res, next) => {
        let userId = req.params.id;
        User.findByIdAndRemove(userId)
        .then(() =>{
            res.locals.redirect ="/users";
            next();
        })
        .catch(error =>{
            console.log(`Error fetching user by ID: ${error.message}`);
            next(error);
        })
    },
    login: (req, res) => {
        res.render("users/login");
    },
    authenticate: passport.authenticate("local", {
        failureRedirect: "/users/login",
        failureFlash: "Failed to login.",
        successRedirect: "/",
        successFlash: "Logged in!"
    }),
    validate: (req, res, next) => {
        req.sanitizeBody("email").normalizeEmail({
            all_lowercase: true
          }).trim();
        req.check("email", "Email is invalid").isEmail();
        req.check("zipCode", "Zip code is invalid").notEmpty().isInt().isLength({
            min: 5,
            max: 5
        });
          
        req.check("password", "Password cannot be empty").notEmpty();
    
        req.getValidationResult().then(error => {
          if (!error.isEmpty()) {
            let messages = error.array().map(e => e.msg);
            req.flash("error", messages.join(" and "));
            req.skip = true;
            res.locals.redirect = "/users/new";
            next();
          } 
          else {
            next();
          }
        });
    },
    logout: (req, res, next) => {
        req.logout();
        req.flash("success", "You have been logged out!");
        res.locals.redirect = "/";
        next();
    }


}