const mongoose = require("mongoose");
const autoIncrement = require("mongoose-auto-increment");
const mongoDB = "mongodb://localhost/resWeb";
const Schema = mongoose.Schema;
const Promise = require("bluebird");

//Schema
const userSchema = new Schema({
    _id: { type: String, required: "{PATH} is required" },
    profileUrl: String,
    // email: String,// password: String,
    userName: { type: String, required: "{PATH} is required" },
    accountType: { type: String, required: "{PATH} is required" },
    favourite: { type: Array, id: Number },
    rating: { type: Array, id: Number, rate: Number }
});
const resSchema = new Schema({
    resId: { type: Number, ref: "resId" },
    nameRes: { type: String, required: "{PATH} is required" },
    timeDay: String,
    tel: String,
    latitude: { type: Number, required: "{PATH} is required" },
    longitude: { type: Number, required: "{PATH} is required" },
    isDelivery: { type: Boolean, default: false },
    rating: Number,
    numCustomer: Number,
    recommend: { type: Boolean, default: false },
    img: Array,
    description: String
});
const menuSchema = new Schema({
    menuId: { type: Number, ref: "menuId" },
    nameMenu: { type: String, required: [true, "{PATH} is required"] },
    res: { type: Number, ref: "resId" },
    price: {
        type: Number, min: [0, "{VALUE} must be greater than {MIN}"]
        , required: [true, "{PATH} is required"]
    },
    img: Array,// img: { type: Array, data: Buffer,contentType: String},
    type: {
        type: String, enum: {
            values: ["dish", "japanese", "noodle", "buffet", "null"]
            , message: "{VALUE} is not a valid type"
        }
    }, // dish, japanese, noodle, buffet, null
    course: {
        type: String, enum: {
            values: ["food", "beverage", "dessert"]
            , message: "{VALUE} is not a valid course"
        }
    }, // food,beverage,dessert
    description: String,
    recommend: { type: Boolean, default: false }
});
const sugSchema = new Schema({
    sugId: { type: Number, ref: "sugId" },
    nameRes: String,
    topic: String,
    img: Array,
    latitude: Number,
    longitude: Number,
    description: String
});
const newSchema = new Schema({
    newId: { type: Number, ref: "newId" },
    nameRes: String,
    topic: String,
    img: Array,
    latitude: Number,
    longitude: Number,
    description: String
});
const adminSchema = new Schema({
    _id: { type: String, required: "{PATH} is required" },
    password: { type: String, required: "{PATH} is required" }
});
autoIncrement.initialize(mongoose.connection);
resSchema.plugin(autoIncrement.plugin, "resId");
menuSchema.plugin(autoIncrement.plugin, "menuId");
sugSchema.plugin(autoIncrement.plugin, "sugId");
newSchema.plugin(autoIncrement.plugin, "newId");

//Model
const User = mongoose.model("users", userSchema);
const Res = mongoose.model("res", resSchema);
const Menu = mongoose.model("menus", menuSchema);
const Suggest = mongoose.model("sugs", sugSchema);
const New = mongoose.model("news", newSchema);
const Admin = mongoose.model("admins", adminSchema);

//Database connection
mongoose.connect(mongoDB, function (err) {
    if (err) throw err;
    console.log("Database is successfully connected!");
});
//RESTAURANTS
//Function for show all restaurants
exports.allRes = function (input, callback) {
    Res.find({}, function (err, results) {
        if (err) throw err;
        // console.log(results);
        if (results.length == 0) {
            callback(404)
        } else {
            callback(results);
        }
    }).skip((input - 1) * 10).limit(10).sort({ _id: -1 });
};
//Function to find input restaurants 
exports.findRes = function (input, callback) {
    Res.find({ _id: input.qData }).skip((input.page - 1) * 10).limit(10).exec()
        .then(function (results, err) {
            if (err) return Promise.reject(err);
            if (results.length == 0)
                return Promise.reject(404)
            else
                callback(results)
        }).catch(function (err) {
            callback(err);
        });
};
//Function for insert Restaurant to db
exports.insertRes = function (input, callback) {
    if (input.img == "" || input.img == [""]) {
        input.img = [];
    }
    var newRes = new Res(input);
    newRes.save(function (err, data) {
        if (err)
            callback(err);
        else
            callback(data);
    });
};
//Fucntion add image link to db RES
exports.addImgRes = function (input, callback) {
    Res.update({ _id: input.res }, { $push: { img: input.img } },
        function (err, results) {
            if (err) throw err;
            if (results.n == 0) {
                // callback("DO NOT HAVE THIS RESTAURANT!");                            
                callback(404);
            } else {
                callback(results);
            }
        }
    );
};
//Function for show all delivery restaurants 
exports.resAllDelivery = function (input, callback) {
    Res.find({ isDelivery: true }, function (err, results) {
        if (err) throw err;
        // console.log(results);
        if (results.length == 0) {
            callback(404)
        } else {
            callback(results);
        }
    }).skip((input - 1) * 10).limit(10).sort({ _id: -1 });;
};
//Function for check delivery restaurants
exports.resDelivery = function (input, callback) {
    Res.find({ _id: input.qData, isDelivery: true }).skip((input.page - 1) * 10).limit(10).sort({ _id: -1 }).exec()
        .then(function (results, err) {
            if (err) return Promise.reject(err);
            // console.log(results);
            if (results.length == 0) {
                // callback("DO NOT HAVE DELIVERY RESTAURANT!");                        
                return Promise.reject(404);
            } else {
                callback(results);
            }
        }).catch(function (err) {
            callback(err);
        });
};
//Function for show all recommend restaurants 
exports.resAllRecommend = function (input, callback) {
    Res.find({ recommend: true }, function (err, results) {
        if (err) throw err;
        // console.log(results);
        if (results.length == 0) {
            callback(404)
        } else {
            callback(results);
        }
    }).skip((input - 1) * 10).limit(10).sort({ _id: -1 });;
};
//Function for check recommend restaurants 
exports.resRecommend = function (input, callback) {
    Res.find({ _id: input.qData, recommend: true }).skip((input.page - 1) * 10).limit(10).sort({ _id: -1 }).exec()
        .then(function (results, err) {
            if (err) return Promise.reject(err);
            if (results.length == 0) {
                // callback("DO NOT HAVE THIS RECOMMEND RESTAURANT!");
                return Promise.reject(404);
            } else {
                callback(results);
            }
        }).catch(function (err) {
            callback(err);
        });
};
//Function for get all restaurants
exports.getAllRes = function (callback) {
    Res.find({}, function (err, results) {
        if (err) throw err;
        // console.log(results);
        if (results.length == 0) {
            callback(404)
        } else {
            callback(results);
        }
    });
};
//Function for update avg(rate) each of restaurants
exports.updRateAllRes = function (inputs, callback) {
    Promise.map(inputs, function (input) {
        var count = 0;
        var sum = 0;
        var avg = 0;
        return User.find({ "rating.id": input._id }, function (err, users) {
            if (err)
                return Promise.reject(err);
            else
                return Promise.resolve(users);
        }).then(function (rs) {
            for (var i = 0; i < rs.length; i++) {
                for (var j = 0; j < rs[i].rating.length; j++) {
                    if (rs[i].rating[j].id == input._id) {
                        count++;
                        sum = sum + parseInt(rs[i].rating[j].rate);
                    }
                }
            }
            if (sum == 0 || count == 0) {
                avg = 0;
            } else {
                avg = parseFloat(sum / count).toFixed(2);
            }
            var sendData = {
                id: input._id,
                count: count,
                avg: parseInt(avg)
            }
            return Promise.props({ sendData });
        });
    }).then(function (vR) {
        return Promise.props(vR, function (vResults) {
            Res.update({ _id: vResults._id }, { $set: { rating: vResults.avg, numCustomer: vResults.count } },
                function (err, results) {
                    if (err)
                        return Promise.reject(err);
                    else
                        return Promise.resolve("new : " + JSON.stringify(results));
                }
            );
        });
    }).then(function (upd) {
        callback(upd);
    }).catch(function (err) {
        callback(err);
    });
};
//Fucntion for show menu list of restaurant
exports.listMenu = function (input, callback) {
    Res.find({ _id: input.qData }, function (err, find) {
        if (err)
            return err;
        if (find.length == 0)
            return 404;
        else
            return find;
    }).then(function (res) {
        return Menu.find({ res: input.qData }, function (err, menus) {
            if (err)
                return err;
            if (menus.length == 0)
                return 404;
            else
                return menus;
        }).sort({ res: 1, _id: -1 }).skip((input.page - 1) * 10).limit(10);
    }).then(function (result) {
        callback(result);
    }).catch(function (err) {
        callback(err);
    });
};
//Function for random restaurants (5) to show example
exports.randomRes = function (callback) {
    Res.aggregate([{ $sample: { size: 5 } }, { $sort: { _id: -1 } }], function (err, results) {
        if (err) throw err;
        callback(results);
    });
};

//MENU
//Function for show all menus
exports.allMenu = function (input, callback) {
    Menu.find({}, function (err, results) {
        if (err) throw err;
        // console.log(results);
        if (results.length == 0) {
            callback(404)
        } else {
            callback(results);
        }
    }).skip((input - 1) * 10).limit(10).sort({ _id: -1 });
};
//Function to find input menus 
exports.findMenu = function (input, callback) {
    Menu.find({ _id: input.qData }).skip((input.page - 1) * 10).limit(10).sort({ _id: -1 }).exec()
        .then(function (results, err) {
            if (err) return Promise.reject(err);
            if (results.length == 0) {
                // callback("DOSE NOT HAVE THIS MENU!");
                return Promise.reject(404);
            } else {
                callback(results);
            }
        }).catch(function (err) {
            callback(err);
        });
};
//Function for insert Menu to db
exports.insertMenu = function (input, callback) {
    Res.findOne({ _id: input.res }, function (err, result) {
        if (err) throw err;
        // console.log("result id Res : "+result._id);
        if (result == null) {
            // callback("DOSE NOT HAVE THIS RESTAURANT");
            callback(404);
        } else {
            // console.log("else => " + result._id);
            input.res = result._id;
            console.log("new input : " + JSON.stringify(input));
            if (input.img == "" || input.img == [""]) {
                input.img = [];
            }
            var newMenu = new Menu(input);
            newMenu.save(function (err, datas) {
                if (err)
                    callback(err);
                else
                    callback(datas);
            });
        }
    });
};
//Fucntion add image link to db
exports.addImgMenu = function (input, callback) {
    Menu.findOne({ _id: input._id }, function (err, result) {
        if (err) return Promise.reject(err);
        if (result == null) {
            // callback("DOSE NOT HAVE THIS MENU!");            
            callback(404);
        } else {
            console.log("else => " + result._id);
            Menu.update({ _id: input._id }, { $push: { img: input.img } }, function (err, results) {
                if (err) throw err;
                callback(results);
            });
        }
    })
};
//Function for check recommend menu (query) 
exports.menuRecommend = function (input, callback) {
    Menu.find({ _id: input.qData, recommend: true }).skip((input.page - 1) * 10).limit(10).sort({ _id: -1 }).exec()
        .then(function (results, err) {
            if (err) return Promise.reject(err);
            // console.log(results);
            if (results.length == 0) {
                // callback("DOSE NOT HAVE THIS RECCOMMED MENU!");
                return Promise.reject(404);
            } else {
                callback(results);
            }
        }).catch(function (err) {
            callback(err);
        });
};
//Function for show all recommend menu 
exports.menuAllRecommend = function (input, callback) {
    Menu.find({ recommend: true }, function (err, results) {
        if (err) throw err;
        // console.log(results);
        if (results.length == 0) {
            callback(404)
        } else {
            callback(results);
        }
    }).skip((input - 1) * 10).limit(10).sort({ _id: -1 });;
};
//Function find type menu
exports.findType = function (input, callback) {
    Menu.find({ type: input.qData }, function (err, results) {
        if (err) throw err;
        if (results.length == 0) {
            // callback("DO NOT HAVE THIS TYPE OF MENU!");
            callback(404);
        } else {
            callback(results);
        }
    }).skip((input.page - 1) * 10).limit(10).sort({ _id: -1 });;
};
//Function find course menu
exports.findCourse = function (input, callback) {
    Menu.find({ course: input.qData }, function (err, results) {
        if (err) throw err;
        if (results.length == 0) {
            // callback("DO NOT HAVE THIS COURSE OF MENU!");
            callback(404);
        } else {
            callback(results);
        }
    }).skip((input.page - 1) * 10).limit(10).sort({ _id: -1 });;
};
//Function for random menu (1) to show example
exports.randomMenu = function (input, callback) {
    Menu.aggregate([{ $match: { course: input } }, { $sample: { size: 2 } }], function (err, results) {
        if (err) throw err;
        callback(results);
    });
};

//USER
//Function for show all users
exports.allUser = function (callback) {
    User.find({}, function (err, results) {
        if (err) throw err;
        // console.log(results);
        callback(results);
    });
};
//Function for insert User to db
exports.insertUser = function (input, callback) {
    var newUser = new User(input);
    newUser.save(function (err, datas) {
        if (err || err === "MongoErr" || err === "MongooseError")
            callback(err);
        // console.log(datas);
        else
            callback(datas);
    });
};
//Function for check exists user in db 
exports.checkUser = function (input, callback) {
    User.findOne({ _id: input._id }, function (err, user) {
        if (err) throw err;
        if (user != null) {
            callback("oldUser");
        } else {
            callback("newUser");
        }
    });
};
//Function for login user
exports.login = function (input, callback) {
    User.findOne({ _id: input._id }, function (err, result) {
        if (err) throw err;
        if (result == null) {
            callback(404);
        } else {
            callback(result);
        }
    });
};
//Function for user update rate of restaurants
exports.updRate = function (input, callback) {
    Res.findOne({ _id: input.idRes }).exec().then(function (res) {
        if (res == null) {
            return Promise.reject(404);
        } else {
            return User.findOne({ _id: input._id, "rating.id": res._id }).exec();
        }
    }).then(function (oldData) {
        if (oldData != null) {
            return User.update({ _id: input._id, "rating.id": input.idRes },
                { $set: { "rating.$.rate": input.rate } }).exec();
        } else {
            return User.update({ _id: input._id },
                { $push: { rating: [{ id: input.idRes, rate: input.rate }] } }).exec();
        }
    }).then(function (upd) {
        if (upd.n == 0) {
            return Promise.reject(404);
        } else {
            callback(upd);
        }
    }).catch(function (err) {
        callback(err);
    });
};
//Function for delete favourite by list of user
exports.delFav = function (input, callback) {
    User.update({ _id: input._id },
        { $pull: { favourite: { id: input.idRes } } },
        function (err, results) {
            if (err) {
                // console.log(err);
                callback(err);
            } else {
                // console.log(results);
                if (results.n == 0) {
                    // callback("DO NOT HAVE THIS USER!");
                    callback(404);
                } else if (results.nModified == 0) {
                    // callback("DO NOT HAVE THIS FAVORITE RESTAURANT ON USER'S LIST!");
                    callback(404);
                } else {
                    callback(results);
                }
            }
        }
    );
};
//Function for user update favourite of restaurants 
exports.updFav = function (input, callback) {
    Res.findOne({ _id: input.idRes }).exec().then(function (res) {
        if (res == null) {
            return Promise.reject(404);
        } else {
            return User.update({ _id: input._id },
                { $addToSet: { favourite: [{ id: res._id }] } }).exec();
        }
    }).then(function (userUpd) {
        if (userUpd.n == 0) {
            return Promise.reject(404);
        } else {
            callback(userUpd);
        }
    }).catch(function (err) {
        callback(err);
    });
};

//Suggestion
//Function for insert suggest
exports.insertSuggest = function (input, callback) {
    if (input.img == "" || input.img == [""]) {
        input.img = [];
    }
    var newSug = new Suggest(input);
    newSug.save(function (err, datas) {
        if (err || err === "MongoErr" || err === "MongooseError") throw err;
        // console.log(datas);
        callback(datas);
    });
};
//Function for get all suggests
exports.allSuggest = function (input, callback) {
    Suggest.find({}, function (err, results) {
        if (err) throw err;
        // console.log(results);
        if (results.length == 0) {
            callback(404)
        } else {
            callback(results);
        }
    }).skip((input - 1) * 10).limit(10).sort({ _id: -1 });
};
//Function for add link img of suggest to db
exports.addImgSug = function (input, callback) {
    Suggest.update({ _id: input.sug },
        { $push: { img: input.img } }, function (err, results) {
            if (err) throw err;
            if (results.n == 0) {
                // callback("DO NOT HAVE THIS RESTAURANT!");                            
                callback(404);
            } else {
                callback(results);
            }
        }
    );

};

//New
//Function for insert new  
exports.insertNew = function (input, callback) {
    if (input.img == "" || input.img == [""]) {
        input.img = [];
    }
    var newNew = new New(input);
    newNew.save(function (err, datas) {
        if (err || err === "MongoErr" || err === "MongooseError") throw err;
        // console.log(datas);
        callback(datas);
    });
};
//Function for get all news
exports.allNew = function (input, callback) {
    New.find({}, function (err, results) {
        if (err) throw err;
        // console.log(results);
        if (results.length == 0) {
            callback(404)
        } else {
            callback(results);
        }
    }).skip((input - 1) * 10).limit(10).sort({ _id: -1 });
};
//Function for add link img of new to db
exports.addImgNew = function (input, callback) {
    New.update({ _id: input.new },
        { $push: { img: input.img } }, function (err, results) {
            if (err) throw err;
            if (results.n == 0) {
                // callback("DO NOT HAVE THIS RESTAURANT!");                            
                callback(404);
            } else {
                callback(results);
            }
        }
    );
};

//Admin
//Function for insert Admin to db
exports.insertAdmin = function (input, callback) {
    var newAdmin = new Admin(input);
    newAdmin.save(function (err, datas) {
        if (err || err === "MongoErr" || err === "MongooseError")
            callback(err);
        // console.log(datas);
        else
            callback(datas);
    });
};
//Function for check admin
exports.checkAdmin = function (input, callback) {
    Admin.findOne({ _id: input._id }, function (err, user) {
        if (err) throw err;
        if (user != null) {
            callback("oldAdmin");
        } else {
            callback("newAdmin");
        }
    });
};
//Function for authentication's Admin
exports.loginAdmin = function (input, callback) {
    Admin.findOne({ _id: input._id }, function (err, result) {
        if (err) throw err;
        if (result == null) {
            callback(404);
        } else {
            callback(result);
        }
    });
};