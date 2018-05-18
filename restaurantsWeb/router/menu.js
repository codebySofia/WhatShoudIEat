const express = require("express");
const router = express.Router();
const bodyParser = require("body-parser");
const multer = require("multer");
const upload = multer({ dest: "uploads/" })
const mongodb = require("./mongodb");
const fs = require("fs");
const newOrder = ["_id", "nameMenu", "res", "price", "img", "type",
    "course", "description", "recommend"];

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true }));
//menu home page
router.get("/", function (req, res) {
    res.send("<= Menu home page =>");
});
//show all menus (Both of all and some) { _id , page} 
router.get("/all-menu", function (req, res) {
    console.log("ACCESS: /menu/all-menu");
    var qPage;
    var queryData = [];
    if (!isNaN(req.query._id) || Array.isArray(req.query._id)) {
        if (isNaN(req.query.page) || (req.query.page <= 0)) {
            queryData = req.query._id;
            page = 1;
        } else {
            queryData = req.query._id;
            page = req.query.page;
        }
        mongodb.findMenu({ qData: queryData, page: page }, function (results) {
            if (results == 404) {
                res.sendStatus(results);
            } else if (results.length > 0) {
                var newResults = JSON.parse(JSON.stringify(results, newOrder));
                res.json(newResults);
            } else {
                res.json(results);
            }
        });
    } else {
        if (isNaN(req.query.page) || (req.query.page <= 0)) {
            qPage = 1;
        } else {
            qPage = req.query.page;
        }
        mongodb.allMenu(qPage, function (results) {
            if (results == 404) {
                res.sendStatus(results);
            } else {
                var newResults = JSON.parse(JSON.stringify(results, newOrder));
                res.json(newResults);
            }
        });
    }
});
//menu form
router.get("/menu-form", function (req, res) {
    res.sendFile(__dirname + "/views/menuForm.html");
});
//insert new menu
router.post("/new-menu", function (req, res) {
    console.log("ACCESS: /menu/new-menu");
    var blRec;
    if (req.body.blRecommend === "true") {
        blRec = true;
    } else if (req.body.blRecommend === "false") {
        blRec = false;
    }
    var linkImg = (req.body.linkImg).split(",");
    var data = {
        nameMenu: req.body.txtMenu,
        res: req.body.txtShop, //* id of res
        price: parseInt(req.body.txtPrice),
        description: req.body.txtDesc,
        recommend: req.body.blRecommend,
        img: linkImg,
        type: req.body.txtType,
        course: req.body.txtCourse
    };
    mongodb.insertMenu(data, function (results) {
        console.log(results);
        if (results == 404) {
            res.sendStatus(results);
        } else {
            res.send(results);
        }
    });
});
//add image link to db #
router.post("/add-img", function (req, res) {
    console.log("ACCESS: /menu/add-img");
    var data = {
        _id: req.body.idMenu,
        img: req.body.txtLink
    }
    mongodb.addImgMenu(data, function (results) {
        if (results == 404) {
            res.sendStatus(404);
        } else {
            res.send(results);
        }
    });
});
//type menus { _id , page} 
router.get("/type", function (req, res) {
    console.log("ACCESS: /menu/type");
    var qPage;
    var queryData = [];
    if (isNaN(req.query.page) || (req.query.page <= 0)) {
        queryData = req.query.type;
        page = 1;
    } else {
        queryData = req.query.type;
        page = req.query.page;
    }
    mongodb.findType({ qData: queryData, page: page }, function (results) {
        if (results == 404) {
            res.sendStatus(results);
        } else {
            var newResults = JSON.parse(JSON.stringify(results, newOrder));
            res.json(newResults);
        }
    });
});
//course menus { _id , page} 
router.get("/course", function (req, res) {
    console.log("ACCESS: /menu/course");
    var qPage;
    var queryData = [];
    if (isNaN(req.query.page) || (req.query.page <= 0)) {
        queryData = req.query.course;
        page = 1;
    } else {
        queryData = req.query.course;
        page = req.query.page;
    }
    mongodb.findCourse({ qData: queryData, page: page }, function (results) {
        if (results == 404) {
            res.sendStatus(results);
        } else {
            var newResults = JSON.parse(JSON.stringify(results, newOrder));
            res.json(newResults);
        }
    });
});
//random menu -> BY course & id  { course , id} 
router.get("/rand-menu", function (req, res) {
    console.log("ACCESS: /menu/rand-menu");
    var queryData = req.query.course;
    var queryCheck = req.query.id;
    var fnResult = [];
    mongodb.randomMenu(queryData, function (results) {
        console.log(results);
        if (queryCheck == results[0]._id) {
            fnResult.push(results[1]);
        } else {
            fnResult.push(results[0]);
        }
        var newResults = JSON.parse(JSON.stringify(fnResult, newOrder));
        res.json(newResults);
    });
});
//recommend menus (Both of all and some) { _id , page} 
router.get("/recommend", function (req, res) {
    console.log("ACCESS: /menu/recommend");
    var qPage;
    var queryData = [];
    if (!isNaN(req.query._id) || Array.isArray(req.query._id)) {
        if (isNaN(req.query.page) || (req.query.page <= 0)) {
            queryData = req.query._id;
            page = 1;
        } else {
            queryData = req.query._id;
            page = req.query.page;
        }
        mongodb.menuRecommend({ qData: queryData, page: page }, function (results) {
            if (results == 404) {
                res.sendStatus(results);
            } else if(results.length > 0){
                var newResults = JSON.parse(JSON.stringify(results, newOrder));
                res.json(newResults);
            }else{
                res.json(results);
            }
        });
    } else {
        if (isNaN(req.query.page) || (req.query.page <= 0)) {
            qPage = 1;
        } else {
            qPage = req.query.page;
        }
        mongodb.menuAllRecommend(qPage, function (results) {
            if (results == 404) {
                res.sendStatus(results);
            } else {
                var newResults = JSON.parse(JSON.stringify(results, newOrder));
                res.json(newResults);
            }
        });
    }
});

module.exports = router;
