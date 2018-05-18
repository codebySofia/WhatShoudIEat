
const express = require("express");
const router = express.Router();
const bodyParser = require("body-parser");
const mongodb = require("./mongodb");
const newOrder = ["_id", "nameRes", "timeDay", "price", "tel", "latitude", "longitude",
    "isDelivery", "recommend", "rating", "numCustomer", "img", "description"];

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true }));

//restaurant home page
router.get("/", function (req, res) {
    res.send("<= Restaurant home page =>");
});
//show all restaurants (Both of all and some) { _id , page} 
router.get("/all-res", function (req, res) {
    console.log("ACCESS: /res/all-res");
    var qPage;
    var queryData = [];
    if (!isNaN(req.query._id) || Array.isArray(req.query._id)) {
        if (isNaN(req.query.page)) {
            queryData = req.query._id;
            page = 1;
        } else {
            queryData = req.query._id;
            page = req.query.page;
        }
        mongodb.findRes({ qData: queryData, page: page }, function (results) {
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
        if (isNaN(req.query.page)) {
            qPage = 1;
        } else {
            qPage = req.query.page;
        }
        mongodb.allRes(qPage, function (results) {
            if (results == 404) {
                res.sendStatus(results);
            } else {
                var newResults = JSON.parse(JSON.stringify(results, newOrder));
                res.json(newResults);
            }
        });
    }
});
//res form
router.get("/res-form", function (req, res) {
    res.sendFile(__dirname + "/views/resForm.html");
});
//insert new restaurant
router.post("/new-res", function (req, res) {
    console.log("ACCESS: /res/new-res");
    var blDel, blRec;
    if (req.body.blDelivery === "true") {
        blDel = true;
    } else if (req.body.blDelivery === "false") {
        blDel = false;
    }
    if (req.body.blRecommend === "true") {
        blRec = true;
    } else if (req.body.blRecommend === "false") {
        blRec = false;
    }
    var linkImg = (req.body.linkImg).split(",");
    var data = {
        nameRes: req.body.txtShop,
        timeDay: req.body.txtTimeDay,
        tel: req.body.txtTel,
        latitude: req.body.txtLat,
        longitude: req.body.txtLon,
        isDelivery: blDel,
        recommend: blRec,
        img: linkImg,
        description: req.body.txtDesc
    };
    mongodb.insertRes(data, function (result) {
        res.json(result);
    });
});
//Add image link to db => res 
router.post("/add-img", function (req, res) {
    console.log("ACCESS: /res/add-img");
    var data = {
        res: req.body.idRes,
        img: req.body.txtLink
    };
    mongodb.addImgRes(data, function (results) {
        if (results == 404) {
            res.sendStatus(results);
        } else {
            res.json(results);
        }
    });
});
//delivery restaurants (Both of all and some) { _id , page} 
router.get("/delivery", function (req, res) {
    console.log("ACCESS: /res/delivery");
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
        mongodb.resDelivery({ qData: queryData, page: page }, function (results) {
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
        mongodb.resAllDelivery(qPage, function (results) {
            if (results == 404) {
                res.sendStatus(results);
            } else {
                var newResults = JSON.parse(JSON.stringify(results, newOrder));
                res.json(newResults);
            }
        });
    }
});
//recommend restaurants (Both of all and some) { _id , page} 
router.get("/recommend", function (req, res) {
    console.log("ACCESS: /res/recommend");
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
        mongodb.resRecommend({ qData: queryData, page: page }, function (results) {
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
        mongodb.resAllRecommend(qPage, function (results) {
            if (results == 404) {
                res.sendStatus(results);
            } else {
                var newResults = JSON.parse(JSON.stringify(results, newOrder));
                res.json(newResults);
            }
        });
    }
});
//update avg(rate) of restaurants ** [use in function of set rate by user also]
router.get("/upd-rate", function (req, res) {
    console.log("ACCESS: /res/upd-rate");
    mongodb.getAllRes(function (result) {
        mongodb.updRateAllRes(result, function (cb) {
            // console.log(cb);
            res.end();
        });
    });

});
//show menu in restaurant { _id , page} 
router.get("/menu", function (req, res) {
    console.log("ACCESS: /res/menu");
    var qPage;
    var queryData = [];
    if (isNaN(req.query.page)) {
        queryData = req.query._id;
        page = 1;
    } else {
        queryData = req.query._id;
        page = req.query.page;
    }
    mongodb.listMenu({ qData: queryData, page: page }, function (results) {
        if (results == 404 || results.length == 0) {
            res.sendStatus(404);
        } else if (results.length > 0) {
            var menuOrder = ["_id", "nameMenu", "res", "price", "img", "type",
                "course", "description", "recommend"];
            var newResults = JSON.parse(JSON.stringify(results, menuOrder));
            res.json(newResults);
        } else {
            res.json(results);
        }
    });
});
//random restaurant
router.get("/rand-res", function (req, res) {
    console.log("ACCESS: /res/rand-res");
    mongodb.randomRes(function (results) {
        var newResults = JSON.parse(JSON.stringify(results, newOrder));
        res.json(newResults);
    });
});
//nearby restaurants [3 km]
router.get("/nearby", function (req, res) {
    var lat = req.query.lat;
    var long = req.query.long;
    var tmp, qPage;
    var nearby = [];
    var final = [];
    mongodb.getAllRes(function (results) {
        var latR, longR, some, less;
        for (var i = 0; i < results.length; i++) {
            latR = results[i].latitude;
            longR = results[i].longitude;
            sum = Math.pow(lat - latR, 2) + Math.pow(long - longR, 2);
            tmp = Math.sqrt(sum);
            // console.log(tmp); 
            if (tmp <= 0.027) {
                results[i].distance = tmp;
                nearby.push(results[i]);
            }
        }
        for (var i = 0; i < nearby.length; i++) {
            var data = {
                _id: nearby[i]._id,
                nameRes: nearby[i].nameRes,
                tel: nearby[i].tel,
                latitude: nearby[i].latitude,
                longitude: nearby[i].longitude,
                isDelivery: nearby[i].isDelivery,
                recommend: nearby[i].recommend,
                img: nearby[i].img,
                description: nearby[i].description,
                distance: nearby[i].distance
            }
            final.push(data);
        }
        final.sort(function (param1, param2) {
            return param1.distance - param2.distance;
        });
        var resOrder = ["_id", "nameRes", "timeDay", "price", "tel", "latitude", "longitude",
            "isDelivery", "recommend", "rating", "numCustomer", "img", "description", "distance"];
        var newResults = JSON.parse(JSON.stringify(final, resOrder));
        res.json(newResults);
    });
});

module.exports = router;
