import { CustomError } from "./customError.service";
import { ERROR_CONSTANTS } from "./error.constants";

export class ErrorHttpResponse {
    error: any;

    constructor(error: any) {
        this.error = error;
    }

    public generate(): any {
        let response: any;

        if (Array.isArray(this.error) === true) {
            response = this.error;
        } else if (this.error instanceof CustomError || this.error.errors) {
            response = this.error.errors;
        } else {
            response = [
                {
                    type: "system",
                    values: [
                        {
                            msg: this.error.message,
                            code: ERROR_CONSTANTS.UNKNOWN_ERROR.CODE,
                        },
                    ],
                },
            ];
        }

        return response;
    }
}
