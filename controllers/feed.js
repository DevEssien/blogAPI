const fs = require("fs");
const path = require("path");
const { validationResult } = require("express-validator/check");

const Post = require("../models/post");
const errorController = require("../controllers/error");

/* Fetching all the posts from the database. */
exports.getPosts = async (req, res, next) => {
    try {
        const currentPage = req.query.page || 1;
        const postsPerPage = 2;
        const totalPostNum = await Post.find().countDocuments();
        const posts = await Post.find()
            .skip((currentPage - 1) * postsPerPage)
            .limit(postsPerPage);
        if (!posts) {
            const error = new Error("Posts Not Found!");
            error.statusCode = 404;
            throw error;
        }
        return res.status(200).json({
            message: "All posts fetched",
            posts: posts,
            totalItems: totalPostNum,
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
            const error = new Error("Validation failed! Check input data");
            error.statusCode = 422;
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

exports.updatePost = async (req, res, next) => {
    try {
        const postId = req.params?.postId;
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            const error = new Error("Validation failed! Check input data");
            error.statusCode = 422;
            throw error;
        }
        const { title, image, content } = req.body;
        let imageUrl = image;
        const post = await Post.findById(postId);
        if (!post) {
            const error = new Error("Post Not Found!");
            error.statusCode = 404;
            throw error;
        }
        if (req.file) {
            imageUrl = req?.file?.path;
        }
        if (!imageUrl) {
            const error = new Error("No Image Uploaded");
            error.statusCode = 422;
            throw error;
        }
        if (imageUrl !== post?.imageUrl) {
            clearImage(post?.imageUrl);
        }
        post.title = title;
        post.content = content;
        post.imageUrl = imageUrl;
        const updatedPost = await post.save();
        return res.status(200).json({
            message: "Post Updated",
            post: updatedPost,
        });
    } catch (err) {
        errorController.throwServerError(err, next);
    }
};

exports.deletePost = async (req, res, next) => {
    try {
        console.log("deleted post");
        const postId = req.params?.postId;
        const post = await Post.findById(postId);
        if (!post) {
            const error = new Error("Post Not Found! ");
            error.statusCode = 404;
            throw error;
        }
        clearImage(post?.imageUrl);
        const deletedPost = await Post.findByIdAndRemove(postId);
        if (!deletedPost) {
            const error = new Error("Unable to delete post");
            error.statusCode = 404;
            throw error;
        }
        return res.status(200).json({
            message: "Post Deleted",
        });
    } catch (err) {
        errorController.throwServerError(err, next);
    }
};

const clearImage = (filePath) => {
    filePath = path.join(__dirname, "..", filePath);
    fs.unlink(filePath, (err) => console.log(err));
};
