import path from 'path';
import fs from 'fs';
import dotenv from 'dotenv';
import logger from './utils/logger.utils';

const envFile = `.env.${process.env.NODE_ENV || 'development'}`;
const isProduction = process.env.NODE_ENV === 'production';
const envFilePath = isProduction
    ? path.resolve(__dirname, '..', '..', envFile)
    : path.resolve(__dirname, '..', envFile);

if (fs.existsSync(envFilePath)) {
    dotenv.config({ path: envFilePath });
    logger.info(`Loaded environment variables from ${envFile}`);
} else {
    logger.error(`Environment file ${envFile} not found`);
}

import config from 'config';
import connectDatabase from './utils/connect.utils';
import createServer from './utils/server.utils';

const port = config.get<number>('port');
const app = createServer();

app.listen(port, async () => {
    logger.info(`App is running on port ${port}`);
    try {
        connectDatabase();
    } catch (error) {
        logger.error(error);
    }
});
