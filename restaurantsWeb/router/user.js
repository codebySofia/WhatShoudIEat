const express = require("express");
const router = express.Router();
const bodyParser = require("body-parser");
const session = require("express-session");
const mongodb = require("./mongodb");
// const bcrypt = require("bcryptjs");
const newOrder = ["_id", "userName", "profileUrl", "accountType",
    "favourite", "id", "rating", "id", "rate"];

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true }));

//user home page
router.get("/", function (req, res) {
    res.send("<= User home page =>");
    // if (!req.session.userId) {
    //     res.json("PLEASE LOGIN!");
    // } else {
    //     res.json("ALREADY LOGIN!");
    // }
});
//show all user
router.get("/all-user", function (req, res) {
    console.log("ACCESS: /user/all-user");
    mongodb.allUser(function (results) {
        var newResults = JSON.parse(JSON.stringify(results, newOrder));
        res.json(newResults);
    });
});
//website form
router.get("/new-web-user", function (req, res) {
    res.sendFile(__dirname + "/views/register-form.html");
});
//user form
router.get("/user-form", function (req, res) {
    res.sendFile(__dirname + "/views/userForm.html");
});
//insert new user
router.post("/new-user", function (req, res) {
    console.log("ACCESS: /user/new-user");
    // var data = {};
    // if(accountType == "web"){
    //     data = {
    //         _id: req.body.userId,
    //         userName: req.body.txtName,
    //         accountType: req.body.txtType
    //         // add password & email 
    //         // email: req.body.txtEmail,
    //         // password: bcrypt.hashSync(req.body.txtPwd, 10);
    //     }   
    // }else{   
    // }
    var data = {
        _id: req.body.userId,
        userName: req.body.txtName,
        profileUrl: req.body.txtProfUrl,
        accountType: req.body.txtType
    };

    mongodb.checkUser(data, function (result) {
        if (result == "oldUser") {
            res.json("oldUser");
        }
        else if (result == "newUser") {
            mongodb.insertUser(data, function (result) {
                res.json(result);
            });
        }
    });

    // bcrypt.compare("my password", 10, function (err, res) {
    //     // res === true or false
    // });
});
//check authentication
router.get("/chk-authen", function (req, res, next) {
    console.log("ACCESS: /user/chk-authen");
    if (req.session.userId && (req.session.mode == "user")) {
        res.json("ALREADY LOGIN!");
    } else {
        res.json("PLEASE LOGIN!");
    }
});
//user authentication 
router.get("/authen", function (req, res) {
    console.log("ACCESS: /user/authen");
    var data = {
        _id: req.query.userId
    }
    mongodb.login(data, function (results) {
        if (results == 404) {
            res.sendStatus(results);
        } else {
            req.session.userId = results._id;
            req.session.mode = "user";
            var newResults = JSON.parse(JSON.stringify(results, newOrder));
            res.json(newResults);
        }
    });
});
//logout authentication
router.get("/logout", function (req, res) {
    console.log("ACCESS: /user/logout");
    // delete req.session.userId; //change
    req.session.destroy();
    res.send("Logout success!");
});
//set favourite by user #
router.post("/favourite", function (req, res) {
    console.log("ACCESS: /user/favourite");
    var data = {
        _id: req.body.userId,
        idRes: req.body.txtRes //*id
    };
    mongodb.updFav(data, function (results) {
        if (results == 404) {
            res.sendStatus(results);
        } else {
            res.send(results);
        }
    });
});
//set rate by user #
router.post("/rating", function (req, res) {
    console.log("ACCESS: /user/rating");
    var data = {
        _id: req.body.userId,
        idRes: parseInt(req.body.txtRes), //*id
        rate: parseInt(req.body.rate)
    };
    var display;
    if (isNaN(data.rate)) {
        res.json("You filled wrong about rate value! Try Again!");
    } else {
        mongodb.updRate(data, function (results) {
            if (results == 404) {
                res.sendStatus(results);
            } else {
                display = results;
                mongodb.getAllRes(function (result) {
                    mongodb.updRateAllRes(result, function (cb) {
                        res.send(display);
                        // console.log("finish");
                    });
                });
            }
        });
    }
});
//delete favorite #
router.post("/del-favourite", function (req, res) {
    console.log("ACCESS: /user/del-favorite");
    var data = {
        _id: req.body.userId,
        idRes: parseInt(req.body.txtIdRes) //*Id
    };
    mongodb.delFav(data, function (results) {
        if (results == 404) {
            res.sendStatus(results);
        } else {
            res.send(results);
        }
    });
});

module.exports = router;