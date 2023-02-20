const { validationResult } = require("express-validator/check");
const bcrypt = require("bcryptjs");

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
