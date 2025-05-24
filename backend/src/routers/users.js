import { Router } from 'express';
import {
  createUserController,
  deleteUserController,
  getUserPublicKey,
  getUsersByIdController,
  getUsersController,
  patchUserController,
  uploadPublicKey,
  upsertUserController,
} from '../controllers/users.js';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import { validateBody } from '../middlewares/validateBody.js';
import { createUserSchema } from '../validation/users.js';
import { isValidId } from '../middlewares/isValidId.js';
import { authenticate } from '../middlewares/authenticate.js';
import { upload } from '../middlewares/multer.js';

const router = Router();

router.use(authenticate);

router.get('/', ctrlWrapper(getUsersController));
router.get('/:userId', isValidId, ctrlWrapper(getUsersByIdController));
router.post(
  '/',
  upload.single('photo'),
  validateBody(createUserSchema),
  ctrlWrapper(createUserController)
);
router.delete('/:userId', isValidId, ctrlWrapper(deleteUserController));
router.put(
  '/:userId',
  isValidId,
  upload.single('photo'),
  validateBody(createUserSchema),
  ctrlWrapper(upsertUserController)
);
router.patch(
  '/:userId',
  isValidId,
  upload.single('photo'),
  ctrlWrapper(patchUserController)
);
router.post('/public-key', uploadPublicKey);

router.get('/:id/public-key', getUserPublicKey);
export default router;
