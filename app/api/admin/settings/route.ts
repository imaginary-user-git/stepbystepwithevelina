export const dynamic = 'force-dynamic'

import { type NextRequest, NextResponse } from "next/server"
import { connectDB } from "@/lib/mongodb"
import { SettingsModel } from "@/lib/models/Settings"
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

// GET settings
async function getSettingsHandler(request: NextRequest) {
  await connectDB()
  let settings = await SettingsModel.findOne({})
  if (!settings) {
    settings = await SettingsModel.create({})
  }
  return successResponse(settings)
}

// PATCH update settings
async function updateSettingsHandler(request: NextRequest) {
  const admin = await checkAdmin(request)
  await connectDB()

  const updates = await request.json()
  
  let settings = await SettingsModel.findOne({})
  const before = settings ? JSON.parse(JSON.stringify(settings)) : {}

  settings = await SettingsModel.findOneAndUpdate(
    {},
    { $set: updates },
    { new: true, upsert: true }
  )

  // Log action
  await AuditLogModel.create({
    adminId: admin.userId,
    adminName: admin.username,
    action: "SETTINGS_UPDATE",
    targetType: "system",
    targetId: "global",
    details: {
      before,
      after: updates
    }
  })

  return successResponse({ 
    message: "Settings updated successfully",
    settings 
  })
}

export const GET = withErrorHandling(getSettingsHandler)
export const PATCH = withErrorHandling(updateSettingsHandler)
