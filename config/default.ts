import 'dotenv/config';

export default {
    port: process.env.PORT || 8080,
    dbUri: process.env.MONGO_URI,
    salt: parseInt(process.env.SALT_ROUNDS!),
    origin: process.env.ORIGIN || 'http://localhost:3000'
};
