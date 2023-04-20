import mongoose, { Schema } from "mongoose";
const { Types } = Schema;

export interface CategoryInput {
    name: string;
}

export interface CategoryDocument extends CategoryInput, mongoose.Document {
    createdAt: Date;
    updatedAt: Date;
}

export const categorySchema: Schema = new Schema(
    {
        name: { type: Types.String },
    },
    {
        timestamps: true,
        strict: true,
    }
);

const CategoryModel = mongoose.model<CategoryDocument>(
    "Categories",
    categorySchema
);

export default CategoryModel;

export class Category {
    public static getModelById(id: Schema.Types.ObjectId, include?: any) {
        return CategoryModel.findById(id);
    }

    public static getModel(query: any) {
        if (Array.isArray(query)) return CategoryModel.aggregate(query);
        else return CategoryModel.findOne(query);
    }

    public static getModelCollection(query: any) {
        if (Array.isArray(query)) return CategoryModel.aggregate(query);
        else return CategoryModel.find(query);
    }

    public static createModel(data: any, transaction?: any) {
        const categorySchema = new CategoryModel(data);
        return categorySchema.save();
    }

    public static updateModel(
        id: Schema.Types.ObjectId,
        data: any,
        transaction?: any
    ) {
        return CategoryModel.findByIdAndUpdate(id, data, {
            new: true,
        });
    }

    public static deleteModel(id: Schema.Types.ObjectId, transaction?: any) {
        return CategoryModel.findByIdAndRemove(id);
    }
}
