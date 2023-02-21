const express = require("express");

const { body } = require("express-validator/check");

const authController = require("../controllers/auth");
const User = require("../models/user");
const isAuth = require("../middlewares/is-auth");
const router = express.Router();

router.get("/status", isAuth, authController.getUserStatus);

router.patch(
    "/status",
    isAuth,
    [body("status").trim().not().isEmpty()],
    authController.updateUserStatus,
);

router.put(
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

router.post(
    "/login",
    [
        body("email")
            .isEmail()
            .withMessage("Please enter a valid email address")
            .normalizeEmail(),
    ],
    authController.postLogin,
);

module.exports = router;
