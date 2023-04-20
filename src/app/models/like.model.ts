import mongoose, { Schema } from "mongoose";
const { Types } = Schema;

export interface LikeInput {
    like: boolean;
    articleId: string;
    userId: string;
}

export interface LikeDocument extends LikeInput, mongoose.Document {
    createdAt: Date;
    updatedAt: Date;
}

export const likeSchema: Schema = new Schema(
    {
        like: { type: Types.Boolean, default: null },
        userId: { type: Types.ObjectId, ref: "Users" },
        articleId: { type: Types.ObjectId, ref: "Articles" },
    },
    {
        timestamps: true,
        strict: true,
    }
);
likeSchema.index({ like: 1, userId: 1, articleId: 1 }, { unique: true });

const LikeModel = mongoose.model<LikeDocument>("Likes", likeSchema);

export default LikeModel;

export class Like {
    public static createModel(data: any, transaction?: any) {
        const likeSchema = new LikeModel(data);
        return likeSchema.save();
    }
}
