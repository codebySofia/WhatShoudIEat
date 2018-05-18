const express = require("express");
const router = express.Router();
const bodyParser = require("body-parser");
const mongodb = require("./mongodb");
const newOrder = ["_id", "nameRes", "topic", "img", "latitude", "longitude", "description"];

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true }));

router.get("/", function (req, res) {
    res.send("<= New home page =>");
});
//new form
router.get("/new-form",function(req,res){
    res.sendFile(__dirname+"/views/newForm.html");
});
//Insert new new to DB
router.post("/insert", function (req, res) {
    console.log("ACCESS: /new/insert");    
    var linkImg = (req.body.linkImg).split(",");
    var data = {
        nameRes: req.body.txtRes,
        topic: req.body.txtTopic,
        img: linkImg,
        latitude: req.body.lati,
        longitude: req.body.longi,
        description: req.body.txtDesc
    }
    mongodb.insertNew(data, function (result) {
        res.json(result);
    });
});
//Show all new data from db
router.get("/all-new", function (req, res) {
    console.log("ACCESS: /new/all-new");
    var qPage;
    var queryData = [];
    if (isNaN(req.query.page) || (req.query.page <= 0)) {
        qPage = 1;
    } else {
        qPage = req.query.page;
    }
    mongodb.allNew(qPage, function (results) {
        if (results == 404) {
            res.sendStatus(results);
        } else {
            var newResults = JSON.parse(JSON.stringify(results, newOrder));
            res.json(newResults);
        }
    });

});
//Add link image for for new
router.post("/add-img", function (req, res) {
    console.log("ACCESS: /new/add-img");
    var data = {
        new: req.body.idNew,
        img: req.body.txtLink
    };
    mongodb.addImgNew(data, function (results) {
        if (results == 404) {
            res.sendStatus(results);
        } else {
            res.json(results);
        }
    });
});

module.exports = router;