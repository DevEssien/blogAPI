const bcrypt = require("bcryptjs");
const User = require("../models/user");

module.exports = {
    createUser: async function ({ userInput }, req) {
        const { email, name, password } = userInput;
        const existingEmail = await User.findOne({ email: email });
        if (existingEmail) {
            const error = new Error("User with email address already exist");
            error.statusCode = 404;
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
