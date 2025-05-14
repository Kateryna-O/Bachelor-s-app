import Joi from 'joi';

export const createUserSchema = Joi.object({
  name: Joi.string().min(3).max(50).required(),
  email: Joi.string().email().required().messages({
    'string.email': 'Please fill a valid email address',
  }),
  number: Joi.number().max(13).messages({
    'number.base': 'Phone number must be a valid number',
  }),
  password: Joi.string().min(8).required().messages({
    'string.min': 'Password must be at least 6 characters long',
  }),
  aboutMe: Joi.string().max(500),
  dateOfBirth: Joi.date().greater('1-1-1900'),
});

export const updateUserSchema = Joi.object({
  name: Joi.string().min(3).max(50),
  email: Joi.string().email().messages({
    'string.email': 'Please fill a valid email address',
  }),
  number: Joi.number().max(13).messages({
    'number.base': 'Phone number must be a valid number',
  }),
  password: Joi.string().min(8).messages({
    'string.min': 'Password must be at least 8 characters long',
  }),
  aboutMe: Joi.string().max(500),
  dateOfBirth: Joi.date().greater('1-1-1900'),
});

export const registerUserSchema = Joi.object({
  name: Joi.string().min(3).max(30),
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

export const loginUserSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});
