const express = require("express");
const router = express.Router();
const bodyParser = require("body-parser");
const mongodb = require("./mongodb");
const newOrder = ["_id", "nameRes", "topic", "img", "latitude", "longitude", "description"];

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true }));

router.get("/", function (req, res) {
    res.send("<= Suggest home page =>");
});
//suggest form
router.get("/suggest-form",function(req,res){
    res.sendFile(__dirname+"/views/sugForm.html");
});
//Insert new suggest to DB
router.post("/new-suggest", function (req, res) {
    var linkImg = (req.body.linkImg).split(",");
    var data = {
        nameRes: req.body.txtRes,
        topic: req.body.txtTopic,
        img: linkImg,
        latitude: req.body.lati,
        longitude: req.body.longi,
        description: req.body.txtDesc
    }
    mongodb.insertSuggest(data, function (result) {
        res.json(result);
    });
});
//Show all suggest data from db
router.get("/all-suggest", function (req, res) {
    console.log("ACCESS: /sug/all-suggest");
    var qPage;
    var queryData = [];
    if (isNaN(req.query.page) || (req.query.page <= 0)) {
        qPage = 1;
    } else {
        qPage = req.query.page;
    }
    mongodb.allSuggest(qPage, function (results) {
        if (results == 404) {
            res.sendStatus(results);
        } else {
            var newResults = JSON.parse(JSON.stringify(results, newOrder));
            res.json(newResults);
        }
    });
});
//Add link image for suggest
router.post("/add-img", function (req, res) {
    console.log("ACCESS: /sug/add-img");
    var data = {
        sug: req.body.idSug,
        img: req.body.txtLink
    };
    mongodb.addImgSug(data, function (results) {
        if (results == 404) {
            res.sendStatus(results);
        } else {
            res.json(results);
        }
    });
});

module.exports = router;