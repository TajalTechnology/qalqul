import { Request, Response, NextFunction } from "express";
import _responce from "../utils/res.message";

const authCheck = (_req: Request, _res: Record<string, any>, next: NextFunction) => {
    var responsedata: any = {};
    const user = _res.locals.user;
    if (!user) return _res.apiUnAuthorized(responsedata.message = _responce.permissionDenied);
    return next();
};

export default authCheck;
