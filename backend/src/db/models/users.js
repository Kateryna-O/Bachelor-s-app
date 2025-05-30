import { Schema, model } from 'mongoose';

const usersSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      default: 'User',
    },
    email: {
      type: String,
      required: true,
      unique: true,
      match: [/.+@.+\..+/, 'Please fill a valid email address'],
    },
    number: {
      type: String,
    },
    password: {
      type: String,
      required: true,
    },

    photo: {
      type: String,
    },
    aboutMe: {
      type: String,
    },
    dateOfBirth: {
      type: Date,
    },
    twoFactorCode: {
      type: String,
    },
    twoFactorExpires: {
      type: Date,
    },
    isTwoFactorVerified: {
      type: Boolean,
      default: false,
    },
    publicKey: {
      type: String,
    },
  },
  { timestamps: true, versionKey: false }
);

usersSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.password;
  return obj;
};

export const UsersCollection = model('users', usersSchema);
