import { Request, Response, NextFunction } from "express";
import { AnyZodObject } from "zod";

const validate =
    (schema: AnyZodObject) =>
    (_req: Request, _res: Record<string, any>, next: NextFunction) => {
        try {
            schema.parse({
                body: _req.body,
                query: _req.query,
                params: _req.params,
            });
            next();
        } catch (e: any) {
            return _res.apiValidationError(e.errors);
        }
    };

export default validate;
