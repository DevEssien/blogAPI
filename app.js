const express = require("express");
const bodyParser = require("body-parser");

const feedRoutes = require("./routes/feed");

const app = express();

app.use(bodyParser.json());

app.use((req, res, next) => {
    res.headers("Access-Control-Allow-Origin", "*");
    res.headers(
        "Access-Control-Allow-Methods",
        "GET, POST, PUT, PATCH, DELETE",
    );
    res.headers("Access-Control-Allow-headers", "Content-Type, Authorization");
    next();
});

app.use("/feed", feedRoutes);

app.listen(8080, () => {
    console.log("server spinning at port 8080");
});

// /home/chinedu/.ssh/essien_id_ed25519