import { Request, Response, NextFunction } from 'express';
import { get } from 'lodash';
import { verifyJwtToken } from '../utils/jwt.utils';
import { reIssueAccessToken } from '../services/session.service';
import config from 'config';
import { AuthenticationError } from '../errors/authentication-error.error';

const authenticateUser = async (
    request: Request,
    response: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const accessToken = get(request, 'cookies.x-access-token');
        const refreshToken = get(request, 'cookies.x-refresh');

        if (!accessToken && !refreshToken) {
            throw new Error('Unauthenticated Please login');
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
                    httpOnly: true,
                    maxAge: Number(config.get<number>('accessTokenTtl')),
                    domain: config.get<string>('domain'),
                    path: '/',
                    sameSite: 'strict',
                    secure: config.get<string>('env') !== 'dev'
                });
                next();
            }
        } else {
            throw new Error('Session expired, please login');
        }
    } catch (error: any) {
        next(new AuthenticationError(error.message as string));
    }
};

export default authenticateUser;
