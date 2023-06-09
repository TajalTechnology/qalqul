import { Users } from "../repository/user.repository";
import validation from "../common/middlewares/validation";
import { userInput } from "../validations/user.validation";
import { NextFunction, Request, Response, Express } from "express";
import { esClient } from "../common/services/elSearch/esSearch";
import { ErrorHttpResponse } from "../common/services/error/errorHttpResponse";
import { Articles } from "../repository/article.repository";
import { RedisService } from "../common/services/redis/redis";
import { REDIS_CONSTANTS } from "../common/services/redis/redis.constants";

/* try-catch handle */
const tryCatch =
    (fn: any) => (req: Request, res: Response, next: NextFunction) =>
        Promise.resolve(fn(req, res, next)).catch(next);

/* all routes */
module.exports = function (router: Express) {
    router.post("/users", validation(userInput), tryCatch(createUser));
    router.put("/users/:id", tryCatch(updateUser));
    router.get("/users/:id", tryCatch(getUser));
    router.post("/login", tryCatch(login));
};

export const createUser = (req: any, res: any) => {
    return new Users()
        .createUser(req)
        .then(async (users: any) => {
            if (users) {
                const { _id, email, username } = users;
                await esClient.index({
                    index: "users",
                    id: _id.toString(),
                    body: { email, username },
                });

                return res.status(200).send({
                    success: true,
                    message: "User creation succeeded.",
                    data: users,
                });
            } else {
                return res.status(409).send({
                    success: false,
                    message: "User creation failed. duplicate email!!",
                });
            }
        })
        .catch((errors: any) => {
            return res.status(400).send({
                success: false,
                message: "User creation failed.",
            });
        });
};

export const updateUser = (req: any, res: any) => {
    return new Users()
        .updateUser(req)
        .then(async (users: any) => {
            if (users) {
                const { _id, email, username } = users;

                const esExits = await esClient.update({
                    index: "users",
                    id: _id.toString(),
                    body: {
                        doc: { email, username },
                    },
                });
                if (users === null) {
                    return res.status(404).send({
                        success: false,
                        message: "User reference not found.",
                    });
                } else {
                    return res.status(200).send({
                        success: true,
                        message: "User update succeeded.",
                        data: users,
                    });
                }
            } else {
                return res.status(409).send({
                    success: false,
                    message: "User creation failed. duplicate email!!",
                });
            }
        })
        .catch((errors: any) => {
            res.status(400).send({
                success: false,
                message: "User update failed.",
                errors: new ErrorHttpResponse(errors).generate(),
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

export const login = (req: any, res: any) => {
    return new Users()
        .login(req)
        .then(async (login: any) => {
            if (login) {
                const articles = await new Articles().getArticles(req);
                await new RedisService().set(
                    "articles2",
                    JSON.stringify(articles),
                    REDIS_CONSTANTS.REDIS.MODE.EX,
                    REDIS_CONSTANTS.REDIS.MODE.REDIS_DURATION
                );

                return res.status(200).send({
                    success: true,
                    message: "Login sucessful and data save in redis",
                });
            } else {
                return res.status(400).send({
                    success: false,
                    message: "Login Failed",
                });
            }
        })
        .catch((errors: any) => {
            return res.status(400).send({
                success: false,
                message: "Login creation failed.",
            });
        });
};
