import type { ObjectId } from "mongodb"
import mongoose from "mongoose"

export interface User {
  _id?: ObjectId
  username: string
  email: string
  password: string // hashed
  role: "student" | "teacher" | "admin"
  firstName?: string
  lastName?: string
  avatar?: string
  bio?: string
  phoneNumber?: string
  teacherStatus?: "none" | "pending" | "approved" | "rejected"
  suspensionReason?: string
  coursesEnrolled: ObjectId[] // array of course IDs
  coursesCreated: ObjectId[] // for teachers - courses they created
  progress: Record<
    string,
    {
      courseId: ObjectId
      completedLessons: ObjectId[]
      quizScores: Record<string, number>
      overallProgress: number
      lastAccessedAt: Date
    }
  >
  isActive: boolean
  lastLoginAt?: Date
  createdAt: Date
  updatedAt: Date
}

export interface CreateUserData {
  username: string
  email: string
  password: string
  role: "student" | "teacher" | "admin"
  firstName?: string
  lastName?: string
}

export interface UpdateUserData {
  username?: string
  email?: string
  firstName?: string
  lastName?: string
  avatar?: string
  bio?: string
  role?: "student" | "teacher" | "admin"
  isActive?: boolean
}

// Mongoose schema
const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      trim: true,
      minlength: 3,
      maxlength: 50,
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 8,
    },
    role: {
      type: String,
      enum: ["student", "teacher", "admin"],
      default: "student",
    },
    firstName: {
      type: String,
      trim: true,
      maxlength: 50,
    },
    lastName: {
      type: String,
      trim: true,
      maxlength: 50,
    },
    avatar: {
      type: String,
      trim: true,
    },
    bio: {
      type: String,
      maxlength: 500,
    },
    phoneNumber: {
      type: String,
      trim: true,
    },
    teacherStatus: {
      type: String,
      enum: ["none", "pending", "approved", "rejected"],
      default: "none",
    },
    suspensionReason: {
      type: String,
      trim: true,
    },
    coursesEnrolled: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
    }],
    coursesCreated: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
    }],
    progress: {
      type: Map,
      of: {
        courseId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Course",
        },
        completedLessons: [mongoose.Schema.Types.ObjectId],
        quizScores: {
          type: Map,
          of: Number,
        },
        overallProgress: {
          type: Number,
          min: 0,
          max: 100,
          default: 0,
        },
        lastAccessedAt: {
          type: Date,
          default: Date.now,
        },
      },
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    lastLoginAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
)

// Indexes for performance
userSchema.index({ email: 1 })
userSchema.index({ username: 1 })
userSchema.index({ role: 1 })
userSchema.index({ isActive: 1 })

// Virtual for full name
userSchema.virtual("fullName").get(function() {
  if (this.firstName && this.lastName) {
    return `${this.firstName} ${this.lastName}`
  }
  return this.username
})

// Remove password from JSON output
userSchema.methods.toJSON = function() {
  const userObject = this.toObject()
  delete userObject.password
  return userObject
}

export const UserModel = mongoose.models.User || mongoose.model("User", userSchema)
