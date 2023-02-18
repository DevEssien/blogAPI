exports.getPosts = (req, res, next) => {
    res.status(200).json({
        posts: [{ name: "Essien Emmanuel", sex: "male" }],
    });
};

exports.postPosts = (req, res, next) => {
    const { title, content } = req.body;
    console.log(req.body);
    res.status(201).json({
        message: "post created successfully!",
        post: {
            title: title,
            content: content,
        },
    });
};
