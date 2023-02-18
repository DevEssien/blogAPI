const express = require("express");

const feedController = require("../controllers/feed");

const router = express.Router();

//GET /feed/route
router.get("/post", feedController.getPosts);

router.post("/post", feedController.postPosts);

module.exports = router;
