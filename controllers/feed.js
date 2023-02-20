const fs = require("fs");
const path = require("path");
const { validationResult } = require("express-validator/check");

const Post = require("../models/post");
const User = require("../models/user");
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
        const user = await User.findById(req?.userId);
        const creator = user;
        const imageUrl = image.path;
        const post = new Post({
            title: title,
            imageUrl: imageUrl,
            content: content,
            creator: req?.userId,
        });
        user.posts.push(post);
        await user.save();
        const createdPost = await post.save();
        return res.status(201).json({
            message: "post created successfully!",
            post: createdPost,
            creator: { _id: creator._id, name: creator.name },
        });
    } catch (err) {
        errorController.throwServerError(err, next);
    }
};

/* Updating a post. */
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
        if (post.creator.toString() !== req.userId) {
            const error = new Error("Not Authorized");
            error.statusCode = 403;
            throw error;
        }
        if (req.file) {
            imageUrl = req?.file?.path;
            if (post.creator.toString() !== req.userId) {
                const error = new Error("Not Authorized");
                error.statusCode = 403;
                throw error;
            }
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

/* Deleting a post from the database. */
exports.deletePost = async (req, res, next) => {
    try {
        const postId = req.params?.postId;
        const post = await Post.findById(postId);
        if (!post) {
            const error = new Error("Post Not Found! ");
            error.statusCode = 404;
            throw error;
        }
        if (post.creator.toString() !== req.userId) {
            const error = new Error("Not Authorized");
            error.statusCode = 403;
            throw error;
        }
        clearImage(post?.imageUrl);
        const deletedPost = await Post.findByIdAndRemove(postId);
        if (!deletedPost) {
            const error = new Error("Unable to delete post");
            error.statusCode = 404;
            throw error;
        }
        const user = await User.findById(req.userId);
        user.posts.pull(postId);
        await user.save();
        return res.status(200).json({
            message: "Post Deleted",
        });
    } catch (err) {
        errorController.throwServerError(err, next);
    }
};

/**
 * It takes a file path as an argument, joins it with the current directory, and then deletes the file
 * @param filePath - The path to the file that we want to delete.
 */
const clearImage = (filePath) => {
    filePath = path.join(__dirname, "..", filePath);
    fs.unlink(filePath, (err) => console.log(err));
};
