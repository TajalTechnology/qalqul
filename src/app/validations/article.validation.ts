import { z, object } from "zod";
import _responce from "../common/utils/res.message";

const articlePayload = {
    body: object({
        title: z
            .string()
            .min(8, { message: "Must be 8 or more characters long" }),
        content: z
            .string()
            .min(18, { message: "Must be 18 or more characters long" }),
        tag: z.enum(["tranding", "new", "technology"]),
        categoryId: z.string(),
        userId: z.string(),
        like: z.number(),
        dislike: z.number(),
    }),
};

export const ArticleInput = object({ ...articlePayload });
