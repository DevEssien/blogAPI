const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const feedRoutes = require("./routes/feed");

const app = express();

app.use(bodyParser.json());

app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader(
        "Access-Control-Allow-Methods",
        "GET, POST, PUT, PATCH, DELETE",
    );
    res.setHeader(
        "Access-Control-Allow-headers",
        "Content-Type, Authorization",
    );
    next();
});

app.use("/feed", feedRoutes);

//connect to mongodb locally

mongoose.set("strictQuery", false);

mongoose.connect(
    "mongodb://localhost:27017/blogDB",
    { useNewUrlParser: true },
    (err) => {
        if (!err) {
            console.log("connected to db successfully!");
        }
    },
);

app.listen(8080, () => {
    console.log("server spinning at port 8080");
});
