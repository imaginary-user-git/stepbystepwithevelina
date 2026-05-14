export const dynamic = 'force-dynamic'

import { type NextRequest, NextResponse } from "next/server"
import { connectDB } from "@/lib/mongodb"
import { AuditLogModel } from "@/lib/models/AuditLog"
import { withErrorHandling, successResponse } from "@/lib/api/apiUtils"
import { ApiErrors } from "@/lib/middleware/security"
import { verifyToken } from "@/lib/auth"

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

// GET all audit logs with pagination
async function getAuditLogsHandler(request: NextRequest) {
  await checkAdmin(request)
  await connectDB()

  const { searchParams } = new URL(request.url)
  const limit = parseInt(searchParams.get("limit") || "20")
  const page = parseInt(searchParams.get("page") || "1")
  const skip = (page - 1) * limit

  const total = await AuditLogModel.countDocuments()
  const logs = await AuditLogModel.find({})
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit)
    .lean()

  return successResponse({ 
    logs,
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit)
    }
  })
}

export const GET = withErrorHandling(getAuditLogsHandler)
