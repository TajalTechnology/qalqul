import validation from "../common/middlewares/validation";
import { Articles } from "../repository/article.repository";
import { ArticleInput } from "../validations/article.validation";
import { NextFunction, Request, Response, Express } from "express";
import { ErrorHttpResponse } from "../common/services/error/errorHttpResponse";
import { RedisService } from "../common/services/redis/redis";
import { REDIS_CONSTANTS } from "../common/services/redis/redis.constants";
import { esClient } from "../common/services/elSearch/esSearch";

/* try-catch handle */
const tryCatch =
    (fn: any) => (req: Request, res: Response, next: NextFunction) =>
        Promise.resolve(fn(req, res, next)).catch(next);

/* all routes */
module.exports = function (router: Express) {
    router.get("/articles", tryCatch(getArticles));
    router.get("/articles/:id", tryCatch(getArticle));
    router.post("/articles", validation(ArticleInput), tryCatch(createArticle));
};

export const createArticle = (req: any, res: any) => {
    return new Articles()
        .createArticle(req)
        .then((article: any) => {
            res.status(200).send({
                success: true,
                message: "Article creation succeeded.",
                data: article,
            });
        })
        .catch((errors: any) => {
            res.status(400).send({
                success: false,
                message: "Article creation failed.",
                errors: new ErrorHttpResponse(errors).generate(),
            });
        });
};

export const getArticles = async (req: any, res: any) => {
    console.log(await searchArticles());
    const cacheArticles = await new RedisService().getData("articles");

    if (cacheArticles) {
        return res.status(200).send({
            success: true,
            message: "Articles fetch succeeded.",
            data: JSON.parse(cacheArticles),
        });
    }

    return new Articles()
        .getArticles(req)
        .then(async (articles: any) => {
            await new RedisService().set(
                "articles",
                JSON.stringify(articles),
                REDIS_CONSTANTS.REDIS.MODE.EX,
                REDIS_CONSTANTS.REDIS.MODE.REDIS_DURATION
            );

            res.status(200).send({
                success: true,
                message: "Articles fetch succeeded.",
                data: articles,
            });
        })
        .catch((errors: any) => {
            res.status(400).send({
                success: false,
                message: "Articles fetch failed.",
                errors: new ErrorHttpResponse(errors).generate(),
            });
        });
};

export const getArticle = async (req: any, res: any) => {
    return new Articles()
        .getArticle(req)
        .then((articles: any) => {
            res.status(200).send({
                success: true,
                message: "Article fetch succeeded.",
                data: articles,
            });
        })
        .catch((errors: any) => {
            res.status(400).send({
                success: false,
                message: "Article fetch failed.",
                errors: new ErrorHttpResponse(errors).generate(),
            });
        });
};

async function searchArticles() {
    try {
        const response = await esClient.search({
            index: "articles",
            body: {
                query: {
                    multi_match: {
                        query: "This is title of this article",
                        fields: ["title^3", "content"],
                    },
                },
            },
        });
        return response.body.hits.hits;
    } catch (error) {
        console.error(error);
        return [];
    }
}
