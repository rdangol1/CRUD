"use strict";

const mongoose = require("mongoose"),
  User = require("./models/user");
 


mongoose.connect("mongodb://localhost:27017/confetti_cuisine", { useNewUrlParser: true, useUnifiedTopology: true  });
mongoose.createConnection("mongodb://localhost:27017/confetti_cuisine", { useNewUrlParser: true, useUnifiedTopology: true  });
mongoose.set("useCreateIndex", true);
mongoose.connection;

var users = [
  {
    name: { first: "Jon", last: "Wexler" },
    email: "jon@jonwexler.com",
    zipCode: 10016
  },
  {
    name: { first: "Chef", last: "Eggplant" },
    email: "eggplant@recipeapp.com",
    zipCode: 20331
  },
  {
    name: { first: "Professor", last: "Souffle" },
    email: "souffle@recipeapp.com",
    zipCode: 19103
  }
];

User.deleteMany()
  .exec()
  .then(() => {
    console.log("Subscriber data is empty!");
  });

var commands = [];

users.forEach(c => {
  commands.push(
    User.create({
      name: c.name,
      email: c.email,
      zipCode: c.zipCode,
      password: c.zipCode
    })
  );
});

Promise.all(commands)
  .then(r => {
    console.log(JSON.stringify(r));
    mongoose.connection.close();
  })
  .catch(error => {
    console.log(`ERROR: ${error}`);
  });