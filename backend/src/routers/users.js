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
import { authenticate } from '../middlewares/authenticate.js';

const router = Router();

router.use(authenticate);

router.get('/', ctrlWrapper(getUsersController));
router.get('/:userId', isValidId, ctrlWrapper(getUsersByIdController));
router.post(
  '/',
  validateBody(createUserSchema),
  ctrlWrapper(createUserController)
);
router.delete('/:userId', isValidId, ctrlWrapper(deleteUserController));
router.put(
  '/:userId',
  isValidId,
  validateBody(createUserSchema),
  ctrlWrapper(upsertUserController)
);
router.patch(
  '/:userId',
  isValidId,
  validateBody(updateUserSchema),
  ctrlWrapper(patchUserController)
);

export default router;
