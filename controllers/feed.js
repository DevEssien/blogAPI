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
    const { title, name, date, content } = req.body;
    const image = req?.file;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({
            message: "Validation failed, entered data is incorrect",
            errors: errors.array(),
        });
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
    console.log("created post", createdPost);
    return res.status(201).json({
        message: "post created successfully!",
        post: createdPost,
    });
};
