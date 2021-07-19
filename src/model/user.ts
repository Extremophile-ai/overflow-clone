import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  email: {
    type: String,
    unique: true,
    lowercase: true,
    required: true,
    index: true
  },
  password: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    index: true
  },
  role: {
    type: String,
    default: 'user',
    enum: ['admin', 'super_admin', 'user'],
  },
  avatar: {
    data: Buffer,
    type: String,
  },
  questions: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Question'
    }
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

UserSchema.index({
  email: 'text',
  username: 'text'
});
export default mongoose.model('User', UserSchema);
