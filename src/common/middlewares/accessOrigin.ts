import { Request, Response, NextFunction } from "express";

export const accesssOrigin = (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
    res.header(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept, x-refresh, x-client-key, x-client-token, x-client-secret, Authorization"
    );
    next();
};
