export const dynamic = 'force-dynamic'

import { type NextRequest, NextResponse } from "next/server"
import { connectDB } from "@/lib/mongodb"
import { UserModel } from "@/lib/models/User"
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

// GET all users with search, filter, and pagination
async function getUsersHandler(request: NextRequest) {
  await checkAdmin(request)
  await connectDB()

  const { searchParams } = new URL(request.url)
  const limit = parseInt(searchParams.get("limit") || "50")
  const page = parseInt(searchParams.get("page") || "1")
  const skip = (page - 1) * limit
  
  const search = searchParams.get("search") || ""
  const role = searchParams.get("role")
  const teacherStatus = searchParams.get("teacherStatus")
  const isActive = searchParams.get("isActive")

  // Build query
  const query: any = {}
  
  if (search) {
    query.$or = [
      { username: { $regex: search, $options: "i" } },
      { email: { $regex: search, $options: "i" } },
      { firstName: { $regex: search, $options: "i" } },
      { lastName: { $regex: search, $options: "i" } },
    ]
  }

  if (role) query.role = role
  if (teacherStatus) query.teacherStatus = teacherStatus
  if (isActive !== null && isActive !== undefined) query.isActive = isActive === "true"

  const total = await UserModel.countDocuments(query)
  const users = await UserModel.find(query)
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit)
    .select("-password")
    .lean()

  return successResponse({ 
    users,
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit)
    }
  })
}

// PATCH update user (e.g., toggle active status or change role)
async function updateUserHandler(request: NextRequest) {
  const admin = await checkAdmin(request)
  await connectDB()

  const body = await request.json()
  const { userId, ...updates } = body

  if (!userId) {
    throw ApiErrors.BAD_REQUEST("User ID is required")
  }

  // Prevent admin from deactivating themselves
  if (userId === admin.userId && updates.isActive === false) {
    throw ApiErrors.BAD_REQUEST("You cannot deactivate your own admin account")
  }

  const oldUser = await UserModel.findById(userId).lean()
  if (!oldUser) {
    throw ApiErrors.NOT_FOUND("User not found")
  }

  const user = await UserModel.findByIdAndUpdate(
    userId,
    { $set: updates },
    { new: true }
  ).select("-password")

  // Log action
  await AuditLogModel.create({
    adminId: admin.userId,
    adminName: admin.username,
    action: "USER_UPDATE",
    targetType: "user",
    targetId: userId,
    details: {
      before: oldUser,
      after: updates
    }
  })

  return successResponse({ 
    message: "User updated successfully",
    user 
  })
}

// DELETE user
async function deleteUserHandler(request: NextRequest) {
  const admin = await checkAdmin(request)
  await connectDB()

  const { searchParams } = new URL(request.url)
  const userId = searchParams.get("userId")

  if (!userId) {
    throw ApiErrors.BAD_REQUEST("User ID is required")
  }

  if (userId === admin.userId) {
    throw ApiErrors.BAD_REQUEST("You cannot delete your own admin account")
  }

  const user = await UserModel.findByIdAndDelete(userId)
  if (!user) {
    throw ApiErrors.NOT_FOUND("User not found")
  }

  // Log action
  await AuditLogModel.create({
    adminId: admin.userId,
    adminName: admin.username,
    action: "USER_DELETE",
    targetType: "user",
    targetId: userId,
    details: { deletedUser: user.username }
  })

  return successResponse({ message: "User deleted successfully" })
}

export const GET = withErrorHandling(getUsersHandler)
export const PATCH = withErrorHandling(updateUserHandler)
export const DELETE = withErrorHandling(deleteUserHandler)
