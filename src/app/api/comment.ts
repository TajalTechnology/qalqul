import validation from "../common/middlewares/validation";
import { NextFunction, Request, Response, Express } from "express";
import { ErrorHttpResponse } from "../common/services/error/errorHttpResponse";
import { Comments } from "../repository/comment.repository";
import { CommentInput } from "../validations/comment.validation";
import ArticleModel from "../models/article.model";

/* try-catch handle */
const tryCatch =
    (fn: any) => (req: Request, res: Response, next: NextFunction) =>
        Promise.resolve(fn(req, res, next)).catch(next);

/* all routes */
module.exports = function (router: Express) {
    router.post(
        "/articles/:articleId/comments",
        validation(CommentInput),
        tryCatch(createComment)
    );
};

export const createComment = (req: any, res: any) => {
    return new Comments()
        .createComment(req)
        .then(async (article: any) => {
            await ArticleModel.findByIdAndUpdate(
                req.params.articleId,
                {
                    $push: { commentIds: article._id },
                },
                {
                    new: true,
                    useFindAndModify: false,
                }
            );
            res.status(200).send({
                success: true,
                message: "Comment creation succeeded.",
                data: article,
            });
        })
        .catch((errors: any) => {
            res.status(400).send({
                success: false,
                message: "Comment creation failed.",
                errors: new ErrorHttpResponse(errors).generate(),
            });
        });
};
