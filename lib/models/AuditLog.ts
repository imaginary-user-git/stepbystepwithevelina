import mongoose from "mongoose"
import type { ObjectId } from "mongodb"

export interface AuditLog {
  _id?: ObjectId
  adminId: ObjectId
  adminName: string
  action: string // e.g., "USER_ROLE_UPDATE", "COURSE_APPROVE", "USER_BAN"
  targetType: "user" | "course" | "system"
  targetId: ObjectId | string
  details: any // Store before/after values or relevant metadata
  ipAddress?: string
  createdAt: Date
}

const auditLogSchema = new mongoose.Schema(
  {
    adminId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    adminName: {
      type: String,
      required: true,
      trim: true,
    },
    action: {
      type: String,
      required: true,
      trim: true,
    },
    targetType: {
      type: String,
      enum: ["user", "course", "system"],
      required: true,
    },
    targetId: {
      type: mongoose.Schema.Types.Mixed,
      required: true,
    },
    details: {
      type: mongoose.Schema.Types.Mixed,
    },
    ipAddress: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
  }
)

// Indexes for high-performance searching in Admin Dashboard
auditLogSchema.index({ adminId: 1 })
auditLogSchema.index({ action: 1 })
auditLogSchema.index({ targetType: 1, targetId: 1 })
auditLogSchema.index({ createdAt: -1 })

export const AuditLogModel = mongoose.models.AuditLog || mongoose.model("AuditLog", auditLogSchema)
