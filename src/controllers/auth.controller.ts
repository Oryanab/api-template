import { Request, Response } from 'express';
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

export const authLoginHandler = async (
    request: Request<{}, {}, AuthLoginValidator['body']>,
    response: Response
): Promise<void> => {
    const { email, password } = request.body;
    const user = await validatePassword(email, password);

    if (!user) {
        response.status(401).send('Invalid email or password');
    }

    const session = await createSession(
        user!._id as string,
        request.get('user-agent') || ''
    );

    const accessToken = signJwtToken(
        {
            ...user,
            session: session!._id as string
        },
        { expiresIn: config.get<string>('accessTokenTtl') }
    );

    const refreshToken = signJwtToken(
        {
            ...user,
            session: session!._id as string
        },
        { expiresIn: config.get<string>('refreshTokenTtl') }
    );

    response
        .cookie('x-access-token', accessToken, {
            httpOnly: true
        })
        .cookie('x-refresh', refreshToken, {
            httpOnly: true
        })
        .status(200)
        .send(`${user?.name} logged in successfully`);
};

export const authUserSessionsHandler = async (
    request: Request,
    response: Response
): Promise<void> => {
    const userId = response.locals.user._id;
    const sessions = await getSessions({ user: userId, valid: true });
    response.status(200).send(sessions);
};

export const authLogoutHandler = async (
    request: Request,
    response: Response
): Promise<void> => {
    const user = response.locals.user;
    await updateSession({ _id: user.session }, { valid: false });

    response
        .clearCookie('x-access-token')
        .clearCookie('x-refresh')
        .status(200)
        .send(`${user?.name} logged out successfully`);
};
