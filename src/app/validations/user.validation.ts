import { z, object, TypeOf, ZodIssueCode } from "zod";
import _responce from "../common/utils/res.message";

const userPayload = {
    body: object({
        email: z.string().email({ message: "Invalid email address" }),
        username: z
            .string()
            .min(5, { message: "Must be 5 or more characters long" }),
        password: z
            .string()
            .min(5, { message: "Must be 5 or more characters long" }),
    }),
};

export const userInput = object({ ...userPayload });
