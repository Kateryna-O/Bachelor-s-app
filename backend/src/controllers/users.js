import createHttpError from 'http-errors';
import {
  createUser,
  deleteUser,
  getAllUsers,
  getUsersById,
  updateUser,
} from '../services/users.js';
import { parsePaginationParams } from '../utils/parsePaginationParams.js';
import { parseSortParams } from '../utils/parseSortParams.js';
import { saveFileToUploadDir } from '../utils/saveFileToUploadDir.js';
import { getEnvVar } from '../utils/getEnvVar.js';
import { saveFileToCloudinary } from '../utils/saveFileToCloudinary.js';
import { UsersCollection } from '../db/models/users.js';

export const getUsersController = async (req, res, next) => {
  try {
    const { page, perPage } = parsePaginationParams(req.query);

    const { sortBy, sortOrder } = parseSortParams(req.query);

    const users = await getAllUsers({
      page,
      perPage,
      sortBy,
      sortOrder,
    });

    res.json({
      status: 200,
      message: 'Successfully found users',
      data: users,
    });
  } catch (err) {
    next(err);
  }
};
export const getUsersByIdController = async (req, res, next) => {
  const { userId } = req.params;
  const user = await getUsersById(userId);
  if (!user) {
    throw createHttpError(404, 'User not found');
  }

  // Відповідь, якщо контакт знайдено
  res.json({
    status: 200,
    message: `Successfully found user with id ${userId}!`,
    data: user,
  });
};

export const createUserController = async (req, res) => {
  const user = await createUser(req.body);

  res.status(201).json({
    status: 201,
    message: 'Successfully created a student',
    data: user,
  });
};

export const deleteUserController = async (req, res, next) => {
  const { userId } = req.params;
  const user = await deleteUser(userId);

  if (!user) {
    next(createHttpError(404, 'User not found'));
    return;
  }
  res.status(204).send();
};

export const upsertUserController = async (req, res, next) => {
  const { userId } = req.params;
  const result = await updateUser(userId, req.body, {
    upsert: true,
  });

  if (!result) {
    next(createHttpError(404, 'User not found'));
  }

  const status = result.isNew ? 201 : 200;

  res.status(status).json({
    status,
    message: 'successfully upserted a user',
    data: result.user,
  });
};

export const patchUserController = async (req, res, next) => {
  const { userId } = req.params;
  const photo = req.file;

  let photoUrl;
  if (photo) {
    if (getEnvVar('ENABLE_CLOUDINARY') === 'true') {
      photoUrl = await saveFileToCloudinary(photo);
    } else {
      photoUrl = await saveFileToUploadDir(photo);
    }
  }

  const result = await updateUser(userId, { ...req.body, photo: photoUrl });

  if (!result) {
    next(createHttpError(404, 'User not found'));
    return;
  }

  res.status(200).json({
    status: 200,
    message: 'Successfully patched a user',
    data: result.user,
  });
};
export const uploadPublicKey = async (req, res) => {
  try {
    const { publicKey } = req.body;
    const userId = req.user.id;

    if (!publicKey) {
      return res.status(400).json({ message: 'Public key is required' });
    }

    await UsersCollection.findByIdAndUpdate(userId, { publicKey });
    return res.status(200).json({ message: 'Public key saved successfully' });
  } catch (error) {
    console.error('Error saving public key:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};

export const getUserPublicKey = async (req, res) => {
  try {
    const user = await UsersCollection.findById(req.params.id).select(
      'publicKey'
    );

    if (!user || !user.publicKey) {
      return res.status(404).json({ message: 'Public key not found' });
    }

    return res.status(200).json({ publicKey: user.publicKey });
  } catch (error) {
    console.error('Error fetching public key:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
