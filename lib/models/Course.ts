import type { ObjectId } from "mongodb"
import mongoose from "mongoose"

export interface Lesson {
  _id: ObjectId
  title: string
  type: "text" | "quiz" | "video"
  content: {
    text?: string
    questions?: QuizQuestion[]
    videoUrl?: string
    duration?: number // in minutes
  }
  order: number
  isPublished: boolean
  createdAt: Date
  updatedAt: Date
}

export interface QuizQuestion {
  question: string
  options: string[]
  correctAnswer: number
  explanation?: string
  points: number
}

export interface Course {
  _id?: ObjectId
  title: string
  description: string
  shortDescription?: string
  teacherId: ObjectId
  teacherName?: string // populated field
  lessons: Lesson[]
  enrolledStudents: ObjectId[]
  category?: string
  tags: string[]
  thumbnail?: string
  difficulty: "beginner" | "intermediate" | "advanced"
  estimatedDuration: number // in hours
  isPublished: boolean
  publishedAt?: Date
  status: "draft" | "pending" | "approved" | "rejected"
  rejectionReason?: string
  rating: number
  totalRatings: number
  createdAt: Date
  updatedAt: Date
}

export interface CreateCourseData {
  title: string
  description: string
  shortDescription?: string
  teacherId: ObjectId
  category?: string
  tags?: string[]
  thumbnail?: string
  difficulty?: "beginner" | "intermediate" | "advanced"
  estimatedDuration?: number
}

export interface UpdateCourseData {
  title?: string
  description?: string
  shortDescription?: string
  category?: string
  tags?: string[]
  thumbnail?: string
  difficulty?: "beginner" | "intermediate" | "advanced"
  estimatedDuration?: number
  isPublished?: boolean
}

// Mongoose schemas
const quizQuestionSchema = new mongoose.Schema({
  question: {
    type: String,
    required: true,
    trim: true,
  },
  options: [{
    type: String,
    required: true,
    trim: true,
  }],
  correctAnswer: {
    type: Number,
    required: true,
    min: 0,
  },
  explanation: {
    type: String,
    trim: true,
  },
  points: {
    type: Number,
    default: 1,
    min: 1,
  },
})

const lessonSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 200,
  },
  type: {
    type: String,
    enum: ["text", "quiz", "video"],
    required: true,
  },
  content: {
    text: {
      type: String,
      trim: true,
    },
    questions: [quizQuestionSchema],
    videoUrl: {
      type: String,
      trim: true,
    },
    duration: {
      type: Number,
      min: 0,
    },
  },
  order: {
    type: Number,
    required: true,
    min: 0,
  },
  isPublished: {
    type: Boolean,
    default: true,
  },
}, {
  timestamps: true,
})

const courseSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 200,
  },
  description: {
    type: String,
    required: true,
    trim: true,
    maxlength: 2000,
  },
  shortDescription: {
    type: String,
    trim: true,
    maxlength: 300,
  },
  teacherId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  teacherName: {
    type: String,
    trim: true,
  },
  lessons: [lessonSchema],
  enrolledStudents: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  }],
  category: {
    type: String,
    trim: true,
    maxlength: 50,
  },
  tags: [{
    type: String,
    trim: true,
    maxlength: 30,
  }],
  thumbnail: {
    type: String,
    trim: true,
  },
  difficulty: {
    type: String,
    enum: ["beginner", "intermediate", "advanced"],
    default: "beginner",
  },
  estimatedDuration: {
    type: Number,
    min: 0,
    default: 0,
  },
  isPublished: {
    type: Boolean,
    default: false,
  },
  publishedAt: {
    type: Date,
  },
  status: {
    type: String,
    enum: ["draft", "pending", "approved", "rejected"],
    default: "draft",
  },
  rejectionReason: {
    type: String,
    trim: true,
  },
  rating: {
    type: Number,
    min: 0,
    max: 5,
    default: 0,
  },
  totalRatings: {
    type: Number,
    min: 0,
    default: 0,
  },
}, {
  timestamps: true,
})

// Indexes for performance
courseSchema.index({ teacherId: 1 })
courseSchema.index({ isPublished: 1 })
courseSchema.index({ category: 1 })
courseSchema.index({ difficulty: 1 })
courseSchema.index({ rating: -1 })
courseSchema.index({ createdAt: -1 })
courseSchema.index({ title: "text", description: "text" }) // Text search

// Virtual for enrollment count
courseSchema.virtual("enrollmentCount").get(function () {
  return this.enrolledStudents.length
})

// Virtual for lesson count
courseSchema.virtual("lessonCount").get(function () {
  return this.lessons.length
})

// Pre-save middleware to update teacher name
courseSchema.pre("save", async function (next: any) {
  if (this.isModified("lessons")) {
    const lessons = this.lessons
    for (let i = 0; i < lessons.length; i++) {
      lessons[i].order = i + 1
    }
  }
  if (this.isModified("teacherId") && !this.teacherName) {
    try {
      const User = mongoose.model("User")
      const teacher = await User.findById(this.teacherId).select("username firstName lastName")
      if (teacher) {
        this.teacherName = teacher.fullName || teacher.username
      }
    } catch (error) {
      console.error("Error updating teacher name:", error)
    }
  }
  next()
})

export const CourseModel = mongoose.models.Course || mongoose.model("Course", courseSchema)
