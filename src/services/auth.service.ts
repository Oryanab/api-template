import UserModel, { UserDocument } from '../models/user.model';
import { omit } from 'lodash';
import logger from '../utils/logger.utils';
import { AuthRegisterValidator } from '../validators/auth.validator';

export const authRegister = async (
    input: Omit<AuthRegisterValidator['body'], 'passwordConfirm'>
): Promise<Omit<UserDocument, 'password'>> => {
    try {
        const user = await UserModel.create(input);
        return omit(user.toJSON(), 'password');
    } catch (error: any) {
        logger.error(error);
        throw new Error('Failed to register user, please try again later');
    }
};
