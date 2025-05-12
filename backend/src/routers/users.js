import { Router } from 'express';
import {
  createUserController,
  deleteUserController,
  getUsersByIdController,
  getUsersController,
  patchUserController,
  upsertUserController,
} from '../controllers/users.js';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import { validateBody } from '../middlewares/validateBody.js';
import { createUserSchema, updateUserSchema } from '../validation/users.js';
import { isValidId } from '../middlewares/isValidId.js';

const router = Router();

router.get('/users', ctrlWrapper(getUsersController));
router.get('/users/:userId', isValidId, ctrlWrapper(getUsersByIdController));
router.post(
  '/users',
  validateBody(createUserSchema),
  ctrlWrapper(createUserController)
);
router.delete('/users/:userId', isValidId, ctrlWrapper(deleteUserController));
router.put(
  '/users/:userId',
  isValidId,
  validateBody(createUserSchema),
  ctrlWrapper(upsertUserController)
);
router.patch(
  '/users/:userId',
  isValidId,
  validateBody(updateUserSchema),
  ctrlWrapper(patchUserController)
);

export default router;
