import mongoose from "mongoose"

const settingsSchema = new mongoose.Schema({
  siteName: {
    type: String,
    default: "Step by Step English",
  },
  maintenanceMode: {
    type: Boolean,
    default: false,
  },
  announcement: {
    text: { type: String, default: "" },
    isActive: { type: Boolean, default: false },
    type: { type: String, enum: ["info", "warning", "success"], default: "info" }
  },
  featuredCategories: [String],
  updatedBy: String,
  updatedAt: {
    type: Date,
    default: Date.now,
  },
}, {
  timestamps: true,
})

export const SettingsModel = mongoose.models.Settings || mongoose.model("Settings", settingsSchema)
