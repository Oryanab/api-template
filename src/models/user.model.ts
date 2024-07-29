import mongoose, { Document, Schema } from 'mongoose';
import bcrypt from 'bcrypt';
import config from 'config';
import { User } from '../types';
import logger from '../utils/logger.utils';

export interface UserDocument extends User, Document {
    createdAt: Date;
    updatedAt: Date;
    comparePassword: (password: string) => Promise<boolean>;
}

const userSchema = new Schema<UserDocument>(
    {
        name: {
            type: String,
            required: true
        },
        email: {
            type: String,
            required: true,
            unique: true
        },
        password: {
            type: String,
            required: true
        }
    },
    { timestamps: true }
);

userSchema.pre('save', async function (next: (err?: Error) => void) {
    const user = this as UserDocument;
    if (!user.isModified('password')) {
        next();
        return;
    }
    const salt = await bcrypt.genSalt(config.get('salt'));
    user.password = bcrypt.hashSync(user.password, salt);
    next();
});

userSchema.methods.comparePassword = async function (
    password: string
): Promise<boolean> {
    const user = this as UserDocument;
    return await bcrypt.compare(password, user.password).catch((e: any) => {
        logger.error(e);
        return false;
    });
};

const UserModel = mongoose.model<UserDocument>('User', userSchema);

export default UserModel;
