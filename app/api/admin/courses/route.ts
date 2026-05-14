export const dynamic = 'force-dynamic'

import { type NextRequest, NextResponse } from "next/server"
import { connectDB } from "@/lib/mongodb"
import { CourseModel } from "@/lib/models/Course"
import { withErrorHandling, successResponse } from "@/lib/api/apiUtils"
import { ApiErrors } from "@/lib/middleware/security"
import { verifyToken } from "@/lib/auth"

import { AuditLogModel } from "@/lib/models/AuditLog"

// Helper to check admin role
async function checkAdmin(request: NextRequest) {
  const authHeader = request.headers.get("authorization")
  if (!authHeader?.startsWith("Bearer ")) {
    throw ApiErrors.UNAUTHORIZED("Authentication required")
  }
  const token = authHeader.split(" ")[1]
  const decoded = verifyToken(token)
  if (!decoded || decoded.role !== "admin") {
    throw ApiErrors.FORBIDDEN("Only admins can access this resource")
  }
  return decoded
}

// GET all courses for admin with search, filter, and pagination
async function getAdminCoursesHandler(request: NextRequest) {
  const admin = await checkAdmin(request)
  await connectDB()

  const { searchParams } = new URL(request.url)
  const limit = parseInt(searchParams.get("limit") || "50")
  const page = parseInt(searchParams.get("page") || "1")
  const skip = (page - 1) * limit

  const search = searchParams.get("search") || ""
  const status = searchParams.get("status")
  const category = searchParams.get("category")
  const difficulty = searchParams.get("difficulty")

  // Build query
  const query: any = {}
  if (search) {
    query.$or = [
      { title: { $regex: search, $options: "i" } },
      { teacherName: { $regex: search, $options: "i" } },
    ]
  }
  if (status) query.status = status
  if (category) query.category = category
  if (difficulty) query.difficulty = difficulty

  const total = await CourseModel.countDocuments(query)
  const courses = await CourseModel.find(query)
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit)
    .lean()

  // Transform for frontend: convert enrolledStudents array to count
  const transformedCourses = courses.map(course => ({
    ...course,
    enrolledStudents: course.enrolledStudents?.length || 0,
    lessonCount: course.lessons?.length || 0
  }))

  return successResponse({ 
    courses: transformedCourses,
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit)
    }
  })
}

// PATCH update course (publish/unpublish/approve/reject)
async function updateAdminCourseHandler(request: NextRequest) {
  const admin = await checkAdmin(request)
  await connectDB()

  const body = await request.json()
  const { courseId, ...updates } = body

  if (!courseId) {
    throw ApiErrors.BAD_REQUEST("Course ID is required")
  }

  const oldCourse = await CourseModel.findById(courseId).lean()
  if (!oldCourse) {
    throw ApiErrors.NOT_FOUND("Course not found")
  }

  // If approving, also set publishedAt if not set
  if (updates.status === "approved" && !oldCourse.publishedAt) {
    updates.publishedAt = new Date()
    updates.isPublished = true
  }

  const course = await CourseModel.findByIdAndUpdate(
    courseId,
    { $set: updates },
    { new: true }
  )

  // Log action
  await AuditLogModel.create({
    adminId: admin.userId,
    adminName: admin.username,
    action: "COURSE_UPDATE",
    targetType: "course",
    targetId: courseId,
    details: {
      before: { title: oldCourse.title, status: oldCourse.status },
      after: updates
    }
  })

  return successResponse({ 
    message: "Course updated successfully",
    course 
  })
}

// DELETE course
async function deleteAdminCourseHandler(request: NextRequest) {
  const admin = await checkAdmin(request)
  await connectDB()

  const { searchParams } = new URL(request.url)
  const courseId = searchParams.get("courseId")

  if (!courseId) {
    throw ApiErrors.BAD_REQUEST("Course ID is required")
  }

  const course = await CourseModel.findByIdAndDelete(courseId)
  if (!course) {
    throw ApiErrors.NOT_FOUND("Course not found")
  }

  // Log action
  await AuditLogModel.create({
    adminId: admin.userId,
    adminName: admin.username,
    action: "COURSE_DELETE",
    targetType: "course",
    targetId: courseId,
    details: { deletedCourse: course.title }
  })

  return successResponse({ message: "Course deleted successfully" })
}

export const GET = withErrorHandling(getAdminCoursesHandler)
export const PATCH = withErrorHandling(updateAdminCourseHandler)
export const DELETE = withErrorHandling(deleteAdminCourseHandler)
