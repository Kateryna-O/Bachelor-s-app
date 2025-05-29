import winston from 'winston';
import path from 'path';

const logFilePath = path.join(process.cwd(), 'logs', 'app.log');

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [new winston.transports.File({ filename: logFilePath })],
});

export default logger;
