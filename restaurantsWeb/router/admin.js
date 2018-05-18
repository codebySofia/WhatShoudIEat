const express = require("express");
const router = express.Router();
const bodyParser = require("body-parser");
const session = require("express-session");
const mongodb = require("./mongodb");
const bcrypt = require("bcrypt");

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true }));

//Admin
router.get("/", function (req, res) {
    res.send("<= Admin home page =>");
});
//homepage
router.get("/homepage", function (req, res) {
    if (req.session.userId && (req.session.mode == "admin")) {
        res.sendFile(__dirname + "/views/homepage.html");
    } else {
        res.sendFile(__dirname + "/views/loginForm.html");
    }
});
//login
router.get("/login-form", function (req, res) {
    if (req.session.userId && (req.session.mode == "admin")) {
        res.redirect("/admin/homepage");
    } else {
        res.sendFile(__dirname + "/views/loginForm.html");
    }
});
//insert new admin
router.post("/new-admin", function (req, res) {
    console.log("ACCESS: /user/new-admin");
    var data = {
        _id: req.body.txtUser,
        password: bcrypt.hashSync(req.body.txtPwd, 10)
    };

    mongodb.checkAdmin(data, function (result) {
        if (result == "oldAdmin") {
            res.json("oldAdmin");
        }
        else if (result == "newAdmin") {
            mongodb.insertAdmin(data, function (result) {
                res.json(result);
            });
        }
    });
});
//check authentication
router.get("/chk-authen", function (req, res, next) {
    console.log("ACCESS: /admin/chk-authen");
    if (req.session.userId && (req.session.mode == "admin")){
        res.redirect("/admin/homepage");
    } else {
        res.redirect("/admin/login-form");
    }
});
//authentication BY loging page
router.post("/authen", function (req, res) {
    console.log("ACCESS: /admin/authen");
    var data = {
        _id: req.body.txtUser,
        password: req.body.txtPwd
    }
    mongodb.loginAdmin(data, function (results) {
        if (results == 404) {
            // res.sendStatus(results);
            res.redirect("/admin/login-form");
        } else if (bcrypt.compareSync(data.password, results.password)) {
            req.session.userId = results._id;
            req.session.mode = "admin";
            // res.json(results);
            res.redirect("/admin/homepage");
        } else {
            res.redirect("/admin/login-form");            
        }
    });
});
//logout authentication
router.get("/logout", function (req, res) {
    console.log("ACCESS: /admin/logout");
    req.session.destroy();
    res.redirect("/admin/login-form");
});

module.exports = router;
