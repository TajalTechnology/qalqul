const db = require("../models/user.model");

export class Users {
    public createUser(req: any) {
        const data = { ...req.body, ...req.params };
        return db.User.createModel(data);
    }

    public async updateUser(req: any) {
        const model = await this.getUser(req);
        if (model == null) return Promise.resolve(null);
        return db.User.updateModel(model, req.body);
    }

    public async patchUser(req: any) {
        const model = await this.getUser(req);
        if (model == null) return Promise.resolve(null);
        return db.User.updateModel(model, req.body);
    }

    public async getUsers(req: any) {
        return db.User.getModelCollection(req);
    }

    public async getUser(req: any) {
        return db.User.getModelById(req?.params?.id);
    }

    public deleteUser(req: any) {
        return db.User.deleteModel(req.params);
    }
}
