import mongoose, { Schema } from 'mongoose'

const UserSchema = new Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  verified: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
})

const User = mongoose.models.User || mongoose.model('User', UserSchema)

export default User