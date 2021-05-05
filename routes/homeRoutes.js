const router = require("express").Router(),
    homeController = require("../controllers/homecontroller");

router.get("/", homeController.index);

module.exports = router;
