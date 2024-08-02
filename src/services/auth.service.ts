import UserModel, { UserDocument } from '../models/user.model';
import { omit } from 'lodash';
import logger from '../utils/logger.utils';
import { AuthRegisterValidator } from '../validators/auth.validator';
import { FilterQuery } from 'mongoose';
import { MongoServerError } from 'mongodb';

export const authRegister = async (
    input: Omit<AuthRegisterValidator['body'], 'passwordConfirm'>
): Promise<Omit<UserDocument, 'password'>> => {
    try {
        const user = await UserModel.create(input);
        return omit(user.toJSON(), 'password');
    } catch (error: any) {
        logger.error(error);
        if (error instanceof MongoServerError) {
            throw new Error(error.message);
        }
        throw new Error('Failed to register user, please try again later');
    }
};

export const validatePassword = async (
    email: string,
    password: string
): Promise<Omit<UserDocument, 'password'> | null> => {
    try {
        const user = await UserModel.findOne({ email });
        if (!user) {
            return null;
        }
        const isValid = await user.comparePassword(password);
        if (!isValid) return null;

        return omit(user.toJSON(), 'password');
    } catch (e: any) {
        logger.error(e);
        throw new Error('Failed to validate password, please try again later');
    }
};

export const findUser = async (
    query: FilterQuery<UserDocument>
): Promise<UserDocument | null> => {
    try {
        return UserModel.findOne(query).lean();
    } catch (e: any) {
        logger.error(e);
        throw new Error('Failed to find user, please try again later');
    }
};
