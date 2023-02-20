const express = require("express");
const { body } = require("express-validator/check");

const feedController = require("../controllers/feed");
const isAuth = require("../middlewares/is-auth");

const router = express.Router();

//GET /feed/route
router.get("/posts", isAuth, feedController.getPosts);

router.get("/post/:postId", isAuth, feedController.getOnepost);

//POST /feed/route
router.post(
    "/post",
    isAuth,
    [
        body("title").trim().isLength({ min: 5 }),
        body("content").trim().isLength({ min: 5 }),
    ],
    feedController.postPosts,
);

//PUT /feed/route
router.put(
    "/post/:postId",
    isAuth,
    [
        body("title").trim().isLength({ min: 5 }),
        body("content").trim().isLength({ min: 5 }),
    ],
    feedController.updatePost,
);

router.delete("/post/:postId", isAuth, feedController.deletePost);

module.exports = router;
