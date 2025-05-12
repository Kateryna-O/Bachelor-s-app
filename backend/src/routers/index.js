import { Router } from 'express';
import UsersRouter from './users.js';
import authRouter from './auth.js';

const router = Router();

router.use('/users', UsersRouter);
router.use('/auth', authRouter);

export default router;
