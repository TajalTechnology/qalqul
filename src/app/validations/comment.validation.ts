import { z, object } from "zod";
import _responce from "../common/utils/res.message";

const commentPayload = {
    body: object({
        comment: z
            .string()
            .min(5, { message: "Must be 5 or more characters long" }),
        userId: z.string(),
    }),
};

export const CommentInput = object({ ...commentPayload });
