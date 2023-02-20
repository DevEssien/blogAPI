const express = require("express");

const { body } = require("express-validator/check");

const authController = require("../controllers/auth");
const User = require("../models/user");

const router = express.Router();

router.post(
    "/signup",
    [
        body("email")
            .isEmail()
            .withMessage("Please enter a valid email address")
            .custom(async (email, { req }) => {
                const emailExist = await User.findOne({ email: email });
                if (emailExist) {
                    return Promise.reject("E-mail address already exist");
                }
            })
            .normalizeEmail(),
        body("password").isLength({ min: 5 }).trim(),
        body("name").trim().not().isEmpty(),
    ],
    authController.putSignup,
);

module.exports = router;
