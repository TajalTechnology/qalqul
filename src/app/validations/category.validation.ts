import { z, object } from "zod";
import _responce from "../common/utils/res.message";

const categoryPayload = {
    body: object({
        name: z
            .string()
            .min(3, { message: "Must be 3 or more characters long" }),
    }),
};

export const CategoryInput = object({ ...categoryPayload });
