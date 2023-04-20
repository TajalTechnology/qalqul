import { NextFunction, Request, Response } from "express";
import { any } from "zod";

module.exports = function (_app: any) {
    _app.use(
        _app.locals.baseUri,
        function (
            _req: Request,
            _res: Record<string, any>,
            _next: NextFunction
        ) {
            let responseStatus: number;

            function typeOf(_var: any) {
                return Array.isArray(_var) ? "array" : typeof _var;
            }

            _res.api = function (_status: any, _data: { errors?: any }) {
                var response: any = {};
                response.status = responseStatus;
                switch (typeOf(_data)) {
                    case "object":
                        if ("errors" in _data && !!_data.errors) {
                            response = _data;
                        } else {
                            response = _data;
                        }
                        break;
                    case "string":
                        response.message = _data;
                        break;
                    default:
                        response.data = _data;
                        break;
                }
                response.status = responseStatus;
                _res.status(_status).json(response);
            };

            _res.apiSuccess = function (_data: any) {
                responseStatus = 1;
                return _res.api(200, _data);
            };

            _res.apiWarning = function (_data: any) {
                responseStatus = 2;
                return _res.api(200, _data);
            };

            _res.apiSessionExpired = function (_data: any) {
                responseStatus = 2;
                return _res.api(410, _data);
            };

            _res.apiError = function (_data: any) {
                responseStatus = 0;
                _res.api(500, _data);
            };

            _res.apiValidationError = function (_data: any) {
                responseStatus = 0;
                _res.api(400, _data);
            };

            _res.apiUnAuthorized = function (_data: any) {
                responseStatus = 0;
                return _res.api(403, _data);
            };

            _res.apiDataNotFound = function (_data: any) {
                responseStatus = 0;
                return _res.api(404, _data);
            };

            _res.apiDuplicate = function (_data: any) {
                responseStatus = 0;
                _res.api(302, _data);
            };

            _next();
        }
    );
};
