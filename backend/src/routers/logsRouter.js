import express from 'express';
import { getUserLogsController } from '../controllers/auth.js';

const router = express.Router();

router.get('/:userId', getUserLogsController); // додай перевірку прав

export default router;
