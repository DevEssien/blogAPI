exports.getError404 = (req, res, next) => {
    res.status(404).json({
        message: "Not found!",
    });
};

exports.getError500 = (req, res, next) => {
    res.status(500).json({
        message: "Server failed",
    });
};
