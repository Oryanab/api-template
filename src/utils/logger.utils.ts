import { pino, type Logger } from 'pino';
import dayjs from 'dayjs';

const logger: Logger = pino({
    transport: {
        target: 'pino-pretty'
    },
    base: {
        pid: false
    },
    timestamp: () => `,"time":"${dayjs().format('MM-DD-YYYY | HH:mm')}"`
});

export default logger;
