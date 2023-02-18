const Post = require("../models/post");
const errorController = require("../controllers/error");

const { validationResult } = require("express-validator/check");

/* Fetching all the posts from the database. */
exports.getPosts = async (req, res, next) => {
    try {
        const posts = await Post.find();
        if (!posts) {
            const error = new Error("Posts Not Found!");
            error.statusCode = 404;
            throw error;
        }
        return res.status(200).json({
            message: "All posts fetched",
            posts: posts,
        });
    } catch (err) {
        errorController.throwServerError(err, next);
    }
};
/* Fetching a single post from the database. */

exports.getOnepost = async (req, res, next) => {
    try {
        const postId = req.params.postId;
        const post = await Post.findById(postId);
        if (!post) {
            const error = new Error("Post Not found!");
            error.statusCode = 404;
            throw error;
        }
        return res.status(200).json({
            message: "Post fetched.",
            post: post,
        });
    } catch (err) {
        errorController.throwServerError(err, next);
    }
};

/* Creating a new post. */
exports.postPosts = async (req, res, next) => {
    try {
        const { title, name, content } = req.body;
        const image = req?.file;
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            const error = new Error(
                "Validation failed, entered data is incorrect",
            );
            error.statusCode = 422;
            console.log("post posts error 422");
            throw error;
        }
        if (!image) {
            const error = new Error("No Image Uploaded");
            error.statusCode = 422;
            throw error;
        }
        const imageUrl = image.path;
        const post = new Post({
            title: title,
            imageUrl: imageUrl,
            content: content,
            creator: { name: "Essien Emmanuel" },
        });
        const createdPost = await post.save();
        return res.status(201).json({
            message: "post created successfully!",
            post: createdPost,
        });
    } catch (err) {
        errorController.throwServerError(err, next);
    }
};
