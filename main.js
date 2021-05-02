"use strict";

const express = require("express"),
  app = express(),
  router = require("./routes/index"),
  homeController = require("./controllers/homecontroller"),
  errorController = require("./controllers/errorController"),
  subscribersController =  require("./controllers/subscribersController"),
  coursesController =  require("./controllers/coursesController"),
  usersController =  require("./controllers/usersController"),
  methodOverride = require("method-override"),
  expressSession = require("express-session"),
  cookieParser = require("cookie-parser"),
  connectFlash = require("connect-flash"),
  expressValidator = require("express-validator"),
  bodyParser = require("body-parser"),
  passport = require("passport"),
  layouts = require("express-ejs-layouts"),
  mongoose = require("mongoose"),
  Subscriber = require("./models/subscriber"),
  Course = require("./models/course"),
  User = require("./models/user");

mongoose.Promise = global.Promise;

mongoose.connect("mongodb://localhost:27017/confetti_cuisine", { useNewUrlParser: true  });
//mongoose.createConnection("mongodb://localhost:27017/confetti_cuisine", { useNewUrlParser: true, useUnifiedTopology: true  });

mongoose.set("useCreateIndex", true);

const db = mongoose.connection;

db.once("open", () => {
    console.log("Successfully connected to MongoDB using Mongoose!");
});
app.set("port", process.env.PORT || 3000);
app.set("view engine", "ejs");

app.use(express.static("public"));
app.use(layouts);
app.use(
  express.urlencoded({
      extended:false
  })
);


app.use(
  methodOverride("_method", {
    methods: ["POST", "GET"]
  })
);



app.use(expressValidator());
app.use(bodyParser.urlencoded({
    extended: true
  }));

app.use(express.static("public"));

// router vs app
app.use(express.json());
app.use(cookieParser("my_passcode"));
app.use(
  expressSession({
    secret: "my_passcode",
    cookie: {
      maxAge: 360000
    },
    resave: false,
    saveUninitialized: false
  })
);

app.use(passport.initialize());
app.use(passport.session());
passport.use(User.createStrategy());
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
app.use(connectFlash());

app.use((req, res, next) => {
  
  res.locals.loggedIn = req.isUnauthenticated();
  res.locals.currentUser = req.user;
  res.locals.flashMessages = req.flash();
  next();
});


app.use("/", router);

app.listen(app.get("port"), () => {
   console.log(`Server is running on port: ${app.get("port")}`)

});