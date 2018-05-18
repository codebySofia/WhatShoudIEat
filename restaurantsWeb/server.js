//express
const express = require("express");
const app = express();
const session = require("express-session");

//router
const userRouter = require("./router/user");
const resRouter = require("./router/res");
const menuRouter = require("./router/menu");
const suggestRouter = require("./router/suggest");
const newRouter = require("./router/new");
const adminRouter = require("./router/admin");

//server: host,port => create server
const port = process.env.PORT || 8085;
const host = "127.0.0.1";
const server = app.listen(port, function (req, res) {
    console.log("SERVER ROUTER RUNNING : app.listen http://%s:%s", host, port);
});

app.use(function (req, res,next ) {
    res.setHeader("Cache-Control", "public, max-age:600,must-revalidate");
    res.setHeader("Last-Modified",Date());
    req.header("If-Modified-Since",Date());
    return next();
});
app.use(session({
    key: "userId",
    secret: "inthebox",
    resave: false,
    saveUninitialized: false,
    // cookie: {
    //     expires: 600000
    // }
}));


app.use("/res", resRouter);
app.use("/menu", menuRouter);
app.use("/user", userRouter);
app.use("/sug", suggestRouter);
app.use("/new", newRouter);
app.use("/admin",adminRouter);

app.get("/", function (req, res) {
    var keySess = session;
    keySess.mode;
    res.send("Welcome !");
});



