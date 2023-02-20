const jwt = require("jsonwebtoken");
const errorController = require("../controllers/error");

module.exports = (req, res, next) => {
    const authHeader = req.get("Authorization");
    if (!authHeader) {
        const error = new Error("Not Authenticated!");
        error.statusCode = 401;
        throw error;
    }
    const token = authHeader.split(" ")[1];
    let decodedToken;
    try {
        decodedToken = jwt.verify(token, "this0Is1My2secret3key4");
    } catch (err) {
        errorController.throwServerError(err, next);
    }
    if (!decodedToken) {
        const error = new Error("Authorization failed");
        error.statusCode = 401;
        throw error;
    }
    req.userId = decodedToken.userId;
    next();
};
