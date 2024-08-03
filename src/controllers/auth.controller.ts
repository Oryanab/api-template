import { NextFunction, Request, Response } from 'express';
import logger from '../utils/logger.utils';
import { authRegister, validatePassword } from '../services/auth.service';
import {
    AuthLoginValidator,
    AuthRegisterValidator
} from '../validators/auth.validator';
import { omit } from 'lodash';
import {
    createSession,
    getSessions,
    updateSession
} from '../services/session.service';
import { signJwtToken } from '../utils/jwt.utils';
import config from 'config';
import { AuthenticationError } from '../errors/authentication-error.error';

export const authRegisterHandler = async (
    request: Request<{}, {}, AuthRegisterValidator['body']>,
    response: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const user = await authRegister(omit(request.body, 'passwordConfirm'));
        response.status(200).send(omit(user, 'password'));
    } catch (error: any) {
        logger.error(error.message);
        response.status(409).send(error.message);
    }
};

export const authLoginHandler = async (
    request: Request<{}, {}, AuthLoginValidator['body']>,
    response: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const { email, password } = request.body;
        const user = await validatePassword(email, password);

        if (!user) {
            response.status(401).send('Invalid email or password');
            return;
        }

        const session = await createSession(
            user._id as string,
            request.get('user-agent') || ''
        );

        const accessToken = signJwtToken(
            {
                ...user,
                session: session!._id as string
            },
            { expiresIn: Number(config.get<number>('accessTokenTtl')) }
        );

        const refreshToken = signJwtToken(
            {
                ...user,
                session: session!._id as string
            },
            { expiresIn: Number(config.get<number>('refreshTokenTtl')) }
        );

        response
            .cookie('x-access-token', accessToken, {
                httpOnly: true,
                maxAge: Number(config.get<number>('accessTokenTtl')),
                domain: config.get<string>('domain'),
                path: '/',
                sameSite: 'strict',
                secure: config.get<string>('env') !== 'dev'
            })
            .cookie('x-refresh', refreshToken, {
                httpOnly: true,
                maxAge: Number(config.get<number>('refreshTokenTtl')),
                domain: config.get<string>('domain'),
                path: '/',
                sameSite: 'strict',
                secure: config.get<string>('env') !== 'dev'
            })
            .status(200)
            .send(`${user?.name} logged in successfully`);
    } catch (error: any) {
        next(new AuthenticationError(error?.string as string));
    }
};

export const authUserSessionsHandler = async (
    request: Request,
    response: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const userId = response.locals.user._id;
        const sessions = await getSessions({ user: userId, valid: true });
        response.status(200).send(sessions);
    } catch (error: any) {
        next(new AuthenticationError(error?.string as string));
    }
};

export const authLogoutHandler = async (
    request: Request,
    response: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const user = response.locals.user;
        await updateSession({ _id: user.session }, { valid: false });

        response
            .clearCookie('x-access-token')
            .clearCookie('x-refresh')
            .status(200)
            .send(`${user?.name} logged out successfully`);
    } catch (error: any) {
        next(new AuthenticationError(error?.string as string));
    }
};

export const authSessionHandler = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        res.status(200).send(res.locals.user);
    } catch (error: any) {
        next(new AuthenticationError('Failed to retrive active session'));
    }
};
