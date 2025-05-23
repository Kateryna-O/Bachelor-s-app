import { model, Schema } from 'mongoose';

const ChatSchema = Schema(
  {
    members: {
      type: Array,
    },
  },
  {
    timestamps: true,
  }
);

export const ChatModel = model('Chat', ChatSchema);
