import * as mongoose from 'mongoose';

export const UserSchema = new mongoose.Schema({
  id: String,
  createdAt: { type: Date, default: Date.now },
  firstName: String,
  lastName: String,
  email: { type : String, lowercase: true},
  password: String,
  role: { type: String, default: 'user' },
});
