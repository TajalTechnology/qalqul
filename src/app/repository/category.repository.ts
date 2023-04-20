const db = require("../models/Category.model");

export class Categories {
    public createCategory(req: any) {
        const data = { ...req.body, ...req.params };
        return db.Category.createModel(data);
    }

    public async updateCategory(req: any) {
        const model = await this.getCategory(req);
        if (model == null) return Promise.resolve(null);
        return db.Category.updateModel(model, req.body);
    }

    public async patchCategory(req: any) {
        const model = await this.getCategory(req);
        if (model == null) return Promise.resolve(null);
        return db.Category.updateModel(model, req.body);
    }

    public async getCategories(req: any) {
        return db.Category.getModelCollection(req);
    }

    public async getCategory(req: any) {
        return db.Category.getModelById(req?.params?.id);
    }

    public deleteCategory(req: any) {
        return db.Category.deleteModel(req.params);
    }
}
