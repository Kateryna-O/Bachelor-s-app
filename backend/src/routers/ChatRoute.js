import { Router } from 'express';
import { createChat, findChat, userChat } from '../controllers/Chat.js';

const router = Router();

router.post('/', createChat);
router.get('/:userId', userChat);
router.get('/find/:firstId/:secondId', findChat);

export default router;
