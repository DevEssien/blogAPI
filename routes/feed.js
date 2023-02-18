const express = require("express");
const { body } = require("express-validator/check");

const feedController = require("../controllers/feed");

const router = express.Router();

//GET /feed/route
router.get("/posts", feedController.getPosts);

router.get("/post/:postId", feedController.getOnepost);

//POST /feed/route
router.post(
    "/post",
    [
        body("title").trim().isLength({ min: 5 }),
        body("content").trim().isLength({ min: 5 }),
    ],
    feedController.postPosts,
);

module.exports = router;
