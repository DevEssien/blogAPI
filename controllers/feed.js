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

exports.postPosts = (req, res, next) => {
    const { title, creator, date, imageUrl, content } = req.body;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({
            message: "Validation failed, entered data is incorrect",
            errors: errors.array(),
        });
    }
    res.status(201).json({
        message: "post created successfully!",
        post: {
            _id: new Date().toISOString(),
            title: title,
            content: content,
            creator: {
                name: "Essien Emmanuel",
            },
            createdAt: new Date(),
        },
    });
};
