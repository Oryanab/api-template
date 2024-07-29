import { Request, Response } from 'express';
import logger from '../utils/logger.utils';
import { authRegister } from '../services/auth.service';
import { AuthRegisterValidator } from '../validators/auth.validator';
import { omit } from 'lodash';

export const authRegisterHandler = async (
    request: Request<{}, {}, AuthRegisterValidator['body']>,
    response: Response
): Promise<void> => {
    try {
        const user = await authRegister(omit(request.body, 'passwordConfirm'));
        response.status(200).send(omit(user, 'password'));
    } catch (error: any) {
        logger.error(error.message);
        response.status(409).send(error.message);
    }
};
