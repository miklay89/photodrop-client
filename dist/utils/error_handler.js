"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const boom_1 = require("@hapi/boom");
const errorHandler = (err, req, res, next) => {
    if (err instanceof boom_1.Boom) {
        return res.status(err.output.statusCode).json({ message: err.message });
    }
    console.log(`Error: ${err.message}`);
    console.log(`Path: ${req.path}`);
    console.log(`Body: ${JSON.stringify(req.body)}`);
    console.log(`Query: ${JSON.stringify(req.query)}`);
    return res
        .status(500)
        .json({ message: "Something went wrong... We trying to fix it" });
};
exports.default = errorHandler;
