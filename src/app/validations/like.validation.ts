import { z, object } from "zod";
import _responce from "../common/utils/res.message";

const likePayload = {
    body: object({
        like: z.boolean(),
        userId: z.string(),
    }),
};

export const LikeInput = object({ ...likePayload });
