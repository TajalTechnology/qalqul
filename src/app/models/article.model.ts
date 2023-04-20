import mongoose, { Schema } from "mongoose";
const { Types } = Schema;

export interface UserInput {
    title: string;
    content: string;
    tag: string;
    categoryId: string;
    userId: string;
    commentIds: string;
}

export interface ArticleDocument extends UserInput, mongoose.Document {
    createdAt: Date;
    updatedAt: Date;
}

export const articleSchema: Schema = new Schema(
    {
        title: { type: Types.String },
        content: { type: Types.String },
        tag: {
            type: Types.String,
            enum: Object.values(["tranding", "new", "technology"]),
            required: true,
        },
        commentIds: [
            {
                type: Types.ObjectId,
                ref: "Comments",
            },
        ],
        categoryId: { type: Types.ObjectId, ref: "Categories" },
        userId: { type: Types.ObjectId, ref: "Users" },
    },
    {
        timestamps: true,
        strict: true,
    }
);

const ArticleModel = mongoose.model<ArticleDocument>("Articles", articleSchema);

export default ArticleModel;

export class Article {
    public static getModelById(id: Schema.Types.ObjectId, include?: any) {
        return ArticleModel.findById(id)
            .populate("categoryId", ["name"])
            .populate("commentIds", ["comment"])
            .populate("userId", ["email", "username"])
            .exec();
    }

    public static getModel(query: any) {
        if (Array.isArray(query)) return ArticleModel.aggregate(query);
        else
            return ArticleModel.findOne(query)
                .populate("userId", ["email", "username"])
                .populate("userId", ["email", "username"])
                .exec();
    }

    public static getModelCollection(req: any) {
        if (Array.isArray(req)) return ArticleModel.aggregate(req);
        else return ArticleModel.find();
    }

    public static createModel(data: any, transaction?: any) {
        const articleSchema = new ArticleModel(data);
        return articleSchema.save();
    }

    public static updateModel(
        id: Schema.Types.ObjectId,
        data: any,
        transaction?: any
    ) {
        return ArticleModel.findByIdAndUpdate(id, data, {
            new: true,
        });
    }

    public static deleteModel(id: Schema.Types.ObjectId, transaction?: any) {
        return ArticleModel.findByIdAndRemove(id);
    }
}
