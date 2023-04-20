import validation from "../common/middlewares/validation";
import { Categories } from "../repository/category.repository";
import { CategoryInput } from "../validations/category.validation";
import { NextFunction, Request, Response, Express } from "express";
import { ErrorHttpResponse } from "../common/services/error/errorHttpResponse";

/* try-catch handle */
const tryCatch =
    (fn: any) => (req: Request, res: Response, next: NextFunction) =>
        Promise.resolve(fn(req, res, next)).catch(next);

/* all routes */
module.exports = function (router: Express) {
    router.post(
        "/categories",
        validation(CategoryInput),
        tryCatch(createCategory)
    );
};

export const createCategory = (req: any, res: any) => {
    return new Categories()
        .createCategory(req)
        .then((job: any) => {
            res.status(200).send({
                success: true,
                message: "Category creation succeeded.",
                data: job,
            });
        })
        .catch((errors: any) => {
            res.status(400).send({
                success: false,
                message: "Category creation failed.",
                errors: new ErrorHttpResponse(errors).generate(),
            });
        });
};
