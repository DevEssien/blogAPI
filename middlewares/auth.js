const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
    const authHeader = req.get("Authorization");
    if (!authHeader) {
        req.isAuth = false;
        return next();
    }
    const token = authHeader.split(" ")[1];
    let decodedToken;
    try {
        decodedToken = jwt.verify(token, "this3is4my3secret3key5007");
    } catch (err) {
        req.isAuth = false;
        return next();
    }
    if (!decodedToken) {
        const error = new Error("Authorization failed");
        error.statusCode = 401;
        throw error;
    }
    req.userId = decodedToken.userId;
    req.isAuth = true;
    next();
};
