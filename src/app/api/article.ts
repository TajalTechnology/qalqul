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
        .then(async (article: any) => {
            // set in elastic search
            const { _id, title, content, tag } = article;
            await esClient.index({
                index: "articles",
                id: _id.toString(),
                body: { title, content, tag },
            });

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
    const { category, tag } = req.query;
    let articles = JSON.parse(await new RedisService().getData("articles2"));

    /**
     * Filter from redis cache based on tag/category queryString.
     */
    if (category) {
        articles = articles.filter(
            (article: any) => article.category === category
        );
    }
    if (tag) articles = articles.filter((article: any) => article.tag === tag);

    if (articles.length < 1) {
        /**
         * Search from database if no data available in redis.
         */
        if (!category && !tag) {
            articles = await new Articles().getArticles(req);
        } else {
            const searchParams = {
                index: "articles",
                body: {
                    query: {
                        bool: {
                            must: [],
                        },
                    },
                },
            };
            if (category) {
                searchParams.body.query.bool.must.push({
                    match: { category },
                });
            }
            if (tag) {
                searchParams.body.query.bool.must.push({
                    match: { tag },
                });
            }
            const searchResults = await esClient.search(searchParams);
            articles = searchResults.hits.hits.map((hit: any) => hit._source);
        }
    }

    res.status(200).send({
        success: true,
        message: "Articles fetch succeeded.",
        data: articles,
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
