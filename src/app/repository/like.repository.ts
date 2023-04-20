const db = require("../models/like.model");

export class Likes {
    public createLike(req: any) {
        const data = { ...req.body, ...req.params };
        return db.Like.createModel(data);
    }
}
