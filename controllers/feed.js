const Post = require("../models/post");

const { validationResult } = require("express-validator/check");

exports.getPosts = (req, res, next) => {
    res.status(200).json({
        posts: [
            {
                _id: "1",
                creator: {
                    name: "Essien Emmanuel",
                },
                content: "Nigeria is in a state of political dilema",
                imageUrl: "images/shoe-sneakers-running-shoes-white-sport.png",
                title: "Politics",
                createdAt: new Date(),
            },
        ],
    });
};

exports.postPosts = async (req, res, next) => {
    try {
        const { title, name, date, content } = req.body;
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
            //code
        }
        const post = new Post({
            title: title,
            imageUrl: "images/shoe-sneakers-running-shoes-white-sport.png",
            content: content,
            creator: { name: "Essien Emmanuel" },
        });
        const createdPost = await post.save();
        return res.status(201).json({
            message: "post created successfully!",
            post: createdPost,
        });
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
};
