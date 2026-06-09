import { NextResponse } from 'next/server'
import mongoose, { Schema } from 'mongoose'

const MONGODB_URI = process.env.MONGODB_URI as string

let cached: any = (global as any).mongoose
if (!cached) cached = (global as any).mongoose = { conn: null, promise: null }

async function connectDB() {
  if (cached.conn) return cached.conn
  if (!cached.promise) cached.promise = mongoose.connect(MONGODB_URI, { bufferCommands: false })
  cached.conn = await cached.promise
  return cached.conn
}

const UserSchema = new Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  verified: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
})

const User = mongoose.models.User || mongoose.model('User', UserSchema)

export async function POST(req: Request) {
  try {
    const { name, email, password } = await req.json()
    await connectDB()
    const existingUser = await User.findOne({ email })
    if (existingUser) {
      return NextResponse.json({ error: 'Email already registered' }, { status: 400 })
    }
    await User.create({ name, email, password, verified: true })
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 })
  }
}