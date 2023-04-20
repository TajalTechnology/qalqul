import mongoose, { Schema } from "mongoose";
const { Types } = Schema;

export interface CommentInput {
    comment: string;
    articleId: string;
    userId: string;
}

export interface ArticleDocument extends CommentInput, mongoose.Document {
    createdAt: Date;
    updatedAt: Date;
}

export const commentSchema: Schema = new Schema(
    {
        comment: { type: Types.String },
        userId: { type: Types.ObjectId, ref: "Users" },
        articleId: { type: Types.ObjectId, ref: "Articles" },
    },
    {
        timestamps: true,
        strict: true,
    }
);

const CommentModel = mongoose.model<ArticleDocument>("Comments", commentSchema);

export default CommentModel;

export class Comment {
    public static createModel(data: any, transaction?: any) {
        const commentSchema = new CommentModel(data);
        return commentSchema.save();
    }
}
