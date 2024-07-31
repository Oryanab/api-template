import { FilterQuery, UpdateQuery } from 'mongoose';
import SessionModel, { SessionDocument } from '../models/session.model';
import logger from '../utils/logger.utils';
import { signJwtToken, verifyJwtToken } from '../utils/jwt.utils';
import { get } from 'lodash';
import { findUser } from './auth.service';
import config from 'config';

export const createSession = async (
    userId: string,
    userAgent: string
): Promise<SessionDocument | null> => {
    try {
        const sessionExist = await SessionModel.findOne({ user: userId });
        if (sessionExist?.valid) {
            await SessionModel.findOneAndUpdate(
                { user: userId },
                { updatedAt: new Date() }
            );
            sessionExist.updatedAt = new Date();
            return sessionExist.toJSON();
        }
        const session = await SessionModel.create({ user: userId, userAgent });
        return session.toJSON();
    } catch (error: any) {
        logger.error(error);
        throw new Error('Failed to generate session, please try again later');
    }
};

export const getSessions = async (
    query: FilterQuery<SessionDocument>
): Promise<SessionDocument[]> => {
    try {
        return SessionModel.find(query).lean();
    } catch (error: any) {
        logger.error(error);
        throw new Error('Failed to get sessions, please try again later');
    }
};

export const updateSession = async (
    query: FilterQuery<SessionDocument>,
    updated: UpdateQuery<SessionDocument>
): Promise<UpdateQuery<SessionDocument>> => {
    try {
        return SessionModel.updateOne(query, updated);
    } catch (error: any) {
        logger.error(error);
        throw new Error('Failed to update session, please try again later');
    }
};

export const findSession = async (
    query: FilterQuery<SessionDocument>
): Promise<SessionDocument | null> => {
    try {
        return SessionModel.findOne(query).lean();
    } catch (e: any) {
        logger.error(e);
        throw new Error('Failed to find session, please try again later');
    }
};

export const reIssueAccessToken = async (
    refreshToken: string
): Promise<boolean | string | undefined> => {
    try {
        const { decoded } = verifyJwtToken(refreshToken);
        const decodedSessionId = get(decoded, 'session');
        if (!decoded || !decodedSessionId) {
            return false;
        }

        const session = await findSession({ _id: decodedSessionId });
        if (!session?.valid) {
            return false;
        }

        const user = await findUser({ _id: session.user });
        if (!user) {
            return false;
        }

        const accessToken = signJwtToken(
            {
                ...user,
                session: session._id
            },
            { expiresIn: config.get<string>('accessTokenTtl') }
        );
        return accessToken;
    } catch (error) {
        throw new Error('Failed to revalidate refresh token');
    }
};
