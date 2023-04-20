const db = require("../models/comment.model");

export class Comments {
    public createComment(req: any) {
        const data = { ...req.body, ...req.params };
        return db.Comment.createModel(data);
    }
}
