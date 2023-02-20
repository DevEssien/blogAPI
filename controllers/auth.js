const { validationResult } = require("express-validator/check");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const User = require("../models/user");
const errorController = require("../controllers/error");

exports.putSignup = async (req, res, next) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            const error = new Error("Validation failed! Invalid data input");
            error.statusCode = 422;
            error.data = errors.array();
            throw error;
        }
        const { email, password, name } = req.body;
        try {
            const hashedPassword = await bcrypt.hash(password, 12);
            const newUser = new User({
                email: email,
                password: hashedPassword,
                name: name,
            });

            const savedUser = await newUser.save();
            if (!savedUser) {
                const error = new Error("Unable to sign user up");
                error.statusCode = 500;
                throw error;
            }
            return res.status(201).json({
                message: "User signed up successfully",
                userId: savedUser._id,
            });
        } catch (err) {
            errorController.throwServerError(err, next);
        }
    } catch (err) {
        errorController.throwServerError(err, next);
    }
};

exports.postLogin = async (req, res, next) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            const error = new Error("Validation failed, Check login Inputs");
            error.statusCode = 422;
            throw error;
        }
        const { email, password } = req.body;
        const foundUser = await User.findOne({ email: email });
        if (!foundUser) {
            const error = new Error("E-mail do not exist");
            error.statusCode = 401;
            throw error;
        }
        await bcrypt.compare(
            password,
            foundUser.password,
            (err, matchedPassword) => {
                if (err) {
                    errorController.throwServerError(err, next);
                }
                if (!matchedPassword) {
                    const error = new Error("Incorrect ");
                    error.statusCode = 401;
                    throw error;
                }
                //Generating a jwt token
                const token = jwt.sign(
                    {
                        email: foundUser.email,
                        userId: foundUser._id.toString(),
                    },
                    "this0Is1My2secret3key4",
                    { expiresIn: "1h" },
                );

                return res.status(200).json({
                    message: "Found user successfully",
                    token: token,
                    userId: foundUser._id.toString(),
                });
            },
        );
    } catch (err) {
        errorController.throwServerError(err, next);
    }
};
