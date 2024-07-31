import { Request, Response, NextFunction } from 'express';
import { get } from 'lodash';
import { verifyJwtToken } from '../utils/jwt.utils';
import { reIssueAccessToken } from '../services/session.service';
import logger from '../utils/logger.utils';

const authenticateUser = async (
    request: Request,
    response: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const accessToken = get(request, 'cookies.x-access-token');
        const refreshToken = get(request, 'cookies.x-refresh');

        if (!accessToken) {
            throw new Error('Unauthenticated Access Denied');
        }

        const { decoded, expired } = verifyJwtToken(accessToken as string);

        if (decoded && !expired) {
            response.locals.user = decoded;
            next();
        } else if (expired && refreshToken) {
            const newAccessToken = await reIssueAccessToken(
                refreshToken as string
            );

            if (newAccessToken) {
                const { decoded } = verifyJwtToken(newAccessToken as string);
                response.locals.user = decoded;
                response.cookie('x-access-token', newAccessToken, {
                    httpOnly: true
                });
                next();
            }
        } else {
            throw new Error('Session expired, please login');
        }
    } catch (error: any) {
        response.status(403).send(error.message);
    }
};

export default authenticateUser;