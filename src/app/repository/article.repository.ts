const db = require("../models/article.model");

export class Articles {
    public createArticle(req: any) {
        const data = { ...req.body, ...req.params };
        return db.Article.createModel(data);
    }

    public async updateArticle(req: any) {
        const model = await this.getArticle(req);
        if (model == null) return Promise.resolve(null);
        return db.Article.updateModel(model, req.body);
    }

    public async patchArticle(req: any) {
        const model = await this.getArticle(req);
        if (model == null) return Promise.resolve(null);
        return db.Article.updateModel(model, req.body);
    }

    public async getArticles(req: any) {
        return db.Article.getModelCollection(req);
    }

    public async getArticle(req: any) {
        return db.Article.getModelById(req?.params?.id);
    }

    public deleteArticle(req: any) {
        return db.Article.deleteModel(req.params);
    }
}
