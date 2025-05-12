import { SORT_ORDER } from '../constants/index.js';
import { UsersCollection } from '../db/models/users.js';
import { calculatePaginationData } from '../utils/calculatePaginationData.js';

export const getAllUsers = async ({
  page = 1,
  perPage = 10,
  sortOrder = SORT_ORDER.ASC,
  sortBy = '_id',
}) => {
  const limit = perPage;
  const skip = (page - 1) * perPage;

  const usersQuery = UsersCollection.find();
  const userCount = await UsersCollection.find()
    .merge(usersQuery)
    .countDocuments();

  const users = await usersQuery
    .skip(skip)
    .limit(limit)
    .sort({ [sortBy]: sortOrder })
    .exec();

  const paginationData = calculatePaginationData(userCount, perPage, page);
  return {
    data: users,
    ...paginationData,
  };
};

export const getUsersById = async usersId => {
  const user = await UsersCollection.findById(usersId);
  return user;
};

export const createUser = async payload => {
  const users = await UsersCollection.create(payload);
  return users;
};

export const deleteUser = async userId => {
  const user = await UsersCollection.findOneAndDelete({
    _id: userId,
  });
  return user;
};

export const updateUser = async (userId, payload, options = {}) => {
  const rawResult = await UsersCollection.findOneAndUpdate(
    { _id: userId },
    payload,
    {
      new: true,
      includeResultMetadata: true,
      ...options,
    }
  );
  if (!rawResult || !rawResult.value) return null;

  return {
    user: rawResult.value,
    isNew: Boolean(rawResult?.lastErrorObject?.upserted),
  };
};
