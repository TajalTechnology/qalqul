import validation from "../common/middlewares/validation";
import { NextFunction, Request, Response, Express } from "express";
import { ErrorHttpResponse } from "../common/services/error/errorHttpResponse";
import { Comments } from "../repository/comment.repository";
import { LikeInput } from "../validations/like.validation";
import ArticleModel from "../models/article.model";
import { Like } from "../models/like.model";
import { Likes } from "../repository/like.repository";

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
            if (like) {
                await ArticleModel.findByIdAndUpdate(
                    req.params.articleId,
                    { $inc: { like: 1 } },
                    {
                        new: true,
                    }
                );
            } else if (!like) {
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
