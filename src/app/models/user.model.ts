import mongoose, { Schema } from "mongoose";
const { Types } = Schema;

export interface UserInput {
    email: string;
    username: string;
    password: string;
    likeIds: string;
}

export interface UserDocument extends UserInput, mongoose.Document {
    createdAt: Date;
    updatedAt: Date;
}

export const userSchema: Schema = new Schema(
    {
        email: { type: Types.String, unique: true },
        username: { type: Types.String },
        password: { type: Types.String },
        likeIds: [
            {
                type: Types.ObjectId,
                ref: "Articles",
            },
        ],
    },
    {
        timestamps: true,
        strict: true,
    }
);

const UserModel = mongoose.model<UserDocument>("Users", userSchema);

export default UserModel;

export class User {
    public static getModelById(id: Schema.Types.ObjectId, include?: any) {
        return UserModel.findById(id)
            .populate("likeIds", ["title", "content"])
            .exec();
    }

    public static getModel(query: any) {
        if (Array.isArray(query)) {
            return UserModel.aggregate(query);
        } else {
            return UserModel.findOne(query);
        }
    }

    public static getModelCollection(query: any) {
        if (Array.isArray(query)) {
            return UserModel.aggregate(query);
        } else {
            return UserModel.find(query);
        }
    }

    public static async createModel(data: any, transaction?: any) {
        const userSchema = new UserModel(data);
        const existingUser = await UserModel.findOne({
            email: data.email,
        });
        if (!existingUser) return userSchema.save();
        else return false;
    }

    public static async updateModel(
        id: Schema.Types.ObjectId,
        data: any,
        transaction?: any
    ) {
        const existingUser = await UserModel.findOne({
            email: data.email,
        });
        if (!existingUser) {
            return UserModel.findByIdAndUpdate(id, data, {
                new: true,
            });
        } else return false;
    }

    public static deleteModel(id: Schema.Types.ObjectId, transaction?: any) {
        return UserModel.findByIdAndRemove(id);
    }
}
