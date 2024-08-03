import 'dotenv/config';

export default {
    env: process.env.NODE_ENV,
    port: process.env.PORT,
    dbUri: process.env.MONGO_URI,
    salt: parseInt(process.env.SALT_ROUNDS!),
    origin: process.env.ORIGIN,
    domain: process.env.DOMAIN,
    privateKey: process.env.PRIVATE_KEY,
    accessTokenTtl: process.env.ACCESS_TOKEN_TTL,
    refreshTokenTtl: process.env.REFRESH_TOKEN_TTL,
    externalApis: process.env.EXTERNAL_APIS
};
