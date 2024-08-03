import { ErrorRequestHandler, Request, Response, NextFunction } from 'express';
import { CustomError } from '../utils/custom-error.utils';

export const errorHandler: ErrorRequestHandler = (
    error: Error,
    request: Request,
    response: Response,
    next: NextFunction
) => {
    if (error instanceof CustomError) {
        return response.status(error.StatusCode).json(error.serialize());
    } else {
        return response.status(500).json({
            message: error.message || 'Server was unable to serialize error'
        });
    }
};
