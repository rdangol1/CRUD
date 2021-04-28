const express = require ("express"),
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
layouts = require("express-ejs-layouts"), mongoose = require("mongoose") ;
Subscriber = require("./models/subscriber");
Course = require("./models/course");
User = require("./models/user");


mongoose.connect("mongodb://localhost:27017/confetti_cuisine", { useNewUrlParser: true  });
//mongoose.createConnection("mongodb://localhost:27017/confetti_cuisine", { useNewUrlParser: true, useUnifiedTopology: true  });

mongoose.Promise = global.Promise;

mongoose.set("useCreateIndex", true);

const db = mongoose.connection;

db.once("open", () => {
    console.log("Successfully connected to MongoDB using Mongoose!");
});
app.set("port", process.env.PORT || 3000);

app.set("view engine", "ejs");

router.use(layouts);
router.use(expressValidator());
app.use(bodyParser.urlencoded({
    extended: true
  }));

app.use(express.static("public"))

router.use(
    express.urlencoded({
        extended:false
    })
)
router.use(express.json());

router.use(cookieParser("my_passcode"));
router.use(
  expressSession({
    secret: "my_passcode",
    cookie: {
      maxAge: 360000
    },
    resave: false,
    saveUninitialized: false
  }));

router.use(passport.initialize());
router.use(passport.session());
passport.use(User.createStrategy());
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
router.use(connectFlash());

router.use((req, res, next) => {
  res.locals.flashMessages = req.flash();
  res.locals.loggedIn = req.isUnauthenticated();
  res.locals.currentUser = req.user;
  next();
});


router.use(methodOverride("_method", {methods : ["POST", "GET"]}));

app.use("/", router);

app.listen(app.get("port"), () => {
   console.log(`Server is running on port: ${app.get("port")}`)

});