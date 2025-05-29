import { LogsCollection } from '../db/models/logs.js';
import logger from './logger.js'; // новий

export const logActivity = async ({ req, userId, action, metadata = {} }) => {
  try {
    const logEntry = {
      userId,
      action,
      ip: req.ip,
      userAgent: req.headers['user-agent'],
      metadata,
      timestamp: new Date().toISOString(),
    };

    await LogsCollection.create(logEntry);

    logger.info(logEntry); // запис у лог-файл для Wazuh
  } catch (error) {
    console.error('Logging error:', error);
  }
};
