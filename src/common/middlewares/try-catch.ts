import { Request, Response, NextFunction } from "express";
var logger = require("../services/logger")("mongoose");

/* global try catch */
module.exports = function (_app: any) {
    _app.use(function (
        err: any,
        _req: Request,
        _res: Response,
        next: NextFunction
    ) {
        logger.error(err.message);
        _res.status(500).send({
            error: {
                status: err.status || 500,
                message: err.message || "Internal Server Error",
            },
        });
    });
};
