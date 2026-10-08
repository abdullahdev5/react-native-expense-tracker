import { NextFunction, Request, Response } from "express"
import { HttpError } from "../utils/errors.util";
import { responseHelper } from "../helpers/responseHelper";

const errorHandler = (
    err: Error,
    req: Request,
    res: Response,
    next: NextFunction
) => {
    if (res.headersSent) {
        next(err);
    }

    let error = err;

    if (error instanceof HttpError) {
        return responseHelper.sendError(res, error.message, error.statusCode);
    }

    console.log(err.stack);

    return responseHelper.sendError(res, "Internal Error!")
};


export default errorHandler;