import { type Request, type Response, type NextFunction } from 'express';
import { type AnyZodObject } from 'zod';
import logger from '../utils/logger.utils';

const validateRequest =
    (schema: AnyZodObject) =>
    (request: Request, response: Response, next: NextFunction) => {
        try {
            schema.parse({
                body: request.body,
                query: request.query,
                params: request.params
            });
            next();
        } catch (error: any) {
            logger.error(error.issues ? error.issues : error);
            return response
                .status(400)
                .send(error.issues ? error.issues : error);
        }
    };

export default validateRequest;
