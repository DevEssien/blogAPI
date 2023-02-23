const bcrypt = require("bcryptjs");
const validator = require("validator");
const User = require("../models/user");

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
};
