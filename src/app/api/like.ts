import validation from "../common/middlewares/validation";
import { NextFunction, Request, Response, Express } from "express";
import { ErrorHttpResponse } from "../common/services/error/errorHttpResponse";
import { LikeInput } from "../validations/like.validation";
import ArticleModel from "../models/article.model";
import { Likes } from "../repository/like.repository";
import UserModel from "../models/user.model";

/* try-catch handle */
const tryCatch =
    (fn: any) => (req: Request, res: Response, next: NextFunction) =>
        Promise.resolve(fn(req, res, next)).catch(next);

/* all routes */
module.exports = function (router: Express) {
    router.post(
        "/articles/:articleId/likes",
        validation(LikeInput),
        tryCatch(createLike)
    );
};

export const createLike = (req: any, res: any) => {
    return new Likes()
        .createLike(req)
        .then(async (like: any) => {
            // increate like dislike denoralize column in Articles model
            if (like.like) {
                // update users
                await UserModel.findByIdAndUpdate(
                    like.userId,
                    {
                        $push: { likeIds: like.articleId },
                    },
                    {
                        new: true,
                        useFindAndModify: false,
                    }
                );

                await ArticleModel.findByIdAndUpdate(
                    req.params.articleId,
                    { $inc: { like: 1 } },
                    {
                        new: true,
                    }
                );
            } else if (!like.dislike) {
                await ArticleModel.findByIdAndUpdate(
                    req.params.articleId,
                    { $inc: { dislike: 1 } },
                    {
                        new: true,
                    }
                );
            }

            res.status(200).send({
                success: true,
                message: "Like creation succeeded.",
                data: like,
            });
        })
        .catch((errors: any) => {
            res.status(400).send({
                success: false,
                message: "Like creation failed.",
                errors: new ErrorHttpResponse(errors).generate(),
            });
        });
};
