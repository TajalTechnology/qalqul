import { Users } from "../repository/user.repository";
import validation from "../common/middlewares/validation";
import { userInput } from "../validations/user.validation";
import { NextFunction, Request, Response, Express } from "express";

/* try-catch handle */
const tryCatch =
    (fn: any) => (req: Request, res: Response, next: NextFunction) =>
        Promise.resolve(fn(req, res, next)).catch(next);

/* all routes */
module.exports = function (router: Express) {
    router.post("/users", validation(userInput), tryCatch(createUser));
    router.get("/users/:id", tryCatch(getUser));
};

export const createUser = (req: any, res: any) => {
    return new Users()
        .createUser(req)
        .then((job: any) => {
            res.status(200).send({
                success: true,
                message: "Job creation succeeded.",
                data: job,
            });
        })
        .catch((errors: any) => {
            res.status(400).send({
                success: false,
                message: "Job creation failed.",
            });
        });
};

export const getUser = (req: any, res: any) => {
    return new Users()
        .getUser(req)
        .then((job: any) => {
            res.status(200).send({
                success: true,
                message: "User fetch succeeded.",
                data: job,
            });
        })
        .catch((errors: any) => {
            res.status(400).send({
                success: false,
                message: "User fetch failed.",
            });
        });
};
