const path = require("path");
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
// const multer = require('multer');

const feedRoutes = require("./routes/feed");
const error = require("./controllers/error");

const app = express();

app.use(bodyParser.json());
// app.use(multer({}).single('images'))
app.use("/images", express.static(path.join(__dirname, "images")));

app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader(
        "Access-Control-Allow-Methods",
        "GET, POST, PUT, PATCH, DELETE, OPTIONS",
    );
    res.setHeader(
        "Access-Control-Allow-headers",
        "Content-Type, Authorization",
    );
    next();
});

app.use("/feed", feedRoutes);

app.use((error, req, res, next) => {
    console.log(error);
    const status = error?.statusCode || 500;
    const message = error?.message;
    res.status(status).json({
        message: message,
        status: status,
    });
});

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
