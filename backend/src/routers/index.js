import { Router } from 'express';
import UsersRouter from './users.js';
import authRouter from './auth.js';
import ChatRoute from './ChatRoute.js';
import MessageRoute from './messageRoute.js';

const router = Router();

router.use('/users', UsersRouter);
router.use('/auth', authRouter);
router.use('/chat', ChatRoute);
router.use('/message', MessageRoute);
export default router;
