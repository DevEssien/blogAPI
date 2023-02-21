const path = require("path");
const express = require("express");
const io = require("socket.io");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const multer = require("multer");

const feedRoutes = require("./routes/feed");
const authRoutes = require("./routes/auth");
const error = require("./controllers/error");

const app = express();

const fileStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "images");
    },
    filename: (req, file, cb) => {
        cb(
            null,
            new Date().toISOString().replace(/:/g, "-") +
                "-" +
                file.originalname,
        );
    },
});

const fileFilter = (req, file, cb) => {
    if (
        file.mimetype === "image/png" ||
        file.mimetype === "image/jpeg" ||
        file.mimetype === "image/jpg"
    ) {
        cb(null, true);
    } else {
        cb(null, false);
    }
};

app.use(bodyParser.json());
app.use(
    multer({ storage: fileStorage, fileFilter: fileFilter }).single("image"),
);
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
app.use("/auth", authRoutes);

app.use((error, req, res, next) => {
    console.log(error);
    const status = error?.statusCode || 500;
    const message = error?.message || "Server side Error";
    const data = error?.data || null;
    res.status(status).json({
        message: message,
        status: status,
        data: data,
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

const server = app.listen(8080, () => {
    console.log("server spinning at port 8080");
});
