const bcrypt = require("bcryptjs");
const validator = require("validator");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const Post = require("../models/post");

module.exports = {
    createUser: async function ({ userInput }, req) {
        const { email, name, password } = userInput;
        const errors = [];
        if (!validator.isEmail(email)) {
            errors.push({ message: "E-mail is invalid" });
        }
        if (
            validator.isEmpty(password) ||
            !validator.isLength(password, { min: 4 })
        ) {
            errors.push({ message: "Password is too short" });
        }
        if (errors.length > 0) {
            const error = new Error("Invalid input");
            error.code = 422;
            error.data = errors;
            throw error;
        }
        const existingEmail = await User.findOne({ email: email });
        if (existingEmail) {
            const error = new Error("User with email address already exist");
            throw error;
        }
        const hashedPassword = await bcrypt.hash(password, 12);
        const newUser = new User({
            email: email,
            name: name,
            password: hashedPassword,
        });
        const createdUser = await newUser.save();
        if (!createdUser) {
            const error = new Error("Server side failed");
            error.statusCode = 500;
            throw error;
        }
        return {
            ...createdUser._doc,
            _id: createdUser._id.toString(),
        };
    },

    login: async function ({ email, password }) {
        const errors = [];
        const user = await User.findOne({ email: email });
        if (!user || !validator.isEmail(email)) {
            errors.push({
                message: "No user with email exist or Invalid email input",
            });
        }
        if (!user) {
            const error = new Error("User not found");
            error.code = 404;
            throw error;
        }
        if (validator.isEmpty(password)) {
            errors.push({
                message: "Password too short! Check password input",
            });
        }
        if (errors.length > 0) {
            const error = new Error("Invalid input");
            error.code = 422;
            error.data = errors;
            throw error;
        }
        const passwordMatch = await bcrypt.compare(password, user?.password);
        if (!passwordMatch) {
            errors.push({
                message: "Incorrect password!",
            });
            if (errors.length > 0) {
                const error = new Error("Incorrect password");
                error.code = 422;
                error.data = errors;
                throw error;
            }
        }
        const token = jwt.sign(
            { email: user?.email, userId: user?._id.toString() },
            "this3is4my3secret3key5007",
            { expiresIn: "1h" },
        );
        return {
            token: token,
            userId: user?._id.toString(),
        };
    },

    createPost: async function ({ postInput }, req) {
        if (!req.isAuth) {
            const error = new Error("Not Authenticated!");
            error.code = 401;
            throw error;
        }
        const title = postInput.title;
        const imageUrl = postInput.imageUrl;
        const content = postInput.content;
        const errors = [];
        if (
            validator.isEmpty(title) ||
            !validator.isLength(title, { min: 5 })
        ) {
            errors.push({ message: "Title is invalid" });
        }
        if (
            validator.isEmpty(content) ||
            !validator.isLength(content, { min: 5 })
        ) {
            errors.push({ message: "content is invalid" });
        }
        if (errors.length > 0) {
            const error = new Error("Invalid Input");
            error.code = 422;
            error.data = errors;
            throw error;
        }
        const user = await User.findById(req.userId);
        if (!user) {
            const error = new Error("Invalid user!");
            error.code = 401;
            throw error;
        }
        const newPost = new Post({
            title: title,
            content: content,
            imageUrl: imageUrl,
            creator: user,
        });
        const createdPost = await newPost.save();
        user.posts.push(createdPost);
        await user.save();
        return {
            ...createdPost._doc,
            _id: createdPost?._id.toString(),
            createdAt: createdPost.createdAt.toISOString(),
            updatedAt: createdPost.updatedAt.toISOString(),
        };
    },

    posts: async function (args, req) {
        console.log("req ", req);
        if (!req.isAuth) {
            console.log("is not auth");
            const error = new Error("Not Authenticated!");
            error.code = 401;
            throw error;
        }
        const totalPosts = await Post.find().countDocuments();
        const posts = await Post.find()
            .sort({ createdAt: -1 })
            .populate("creator");
        if (!posts) {
            const error = new Error("No post found");
            error.code = 404;
            throw error;
        }
        console.log("entered backend");
        return {
            posts: posts.map((p) => {
                return {
                    ...p._doc,
                    _id: p._id.toString(),
                    createdAt: p.createdAt.toISOString(),
                    updatedAt: p.updatedAt.toISOString(),
                };
            }),
            totalPosts: totalPosts,
        };
    },

    // posts: async function ({ page }, req) {
    //     if (!req.isAuth) {
    //         const error = new Error("Not authenticated!");
    //         error.code = 401;
    //         throw error;
    //     }
    //     if (!page) {
    //         page = 1;
    //     }
    //     const perPage = 2;
    //     const totalPosts = await Post.find().countDocuments();
    //     const posts = await Post.find()
    //         .sort({ createdAt: -1 })
    //         .skip((page - 1) * perPage)
    //         .limit(perPage)
    //         .populate("creator");
    //     return {
    //         posts: posts.map((p) => {
    //             return {
    //                 ...p._doc,
    //                 _id: p._id.toString(),
    //                 createdAt: p.createdAt.toISOString(),
    //                 updatedAt: p.updatedAt.toISOString(),
    //             };
    //         }),
    //         totalPosts: totalPosts,
    //     };
    // },
};
