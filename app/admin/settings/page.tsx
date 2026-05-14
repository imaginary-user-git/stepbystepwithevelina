"use client"

import { useEffect, useState } from "react"
import { ProtectedRoute } from "@/components/auth/protected-route"
import { useAuth } from "@/hooks/use-auth"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Settings, Bell, ShieldAlert, Globe, Save } from "lucide-react"
import { toast } from "sonner"

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const { token } = useAuth()

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await fetch("/api/admin/settings", {
          headers: { Authorization: `Bearer ${token}` }
        })
        if (response.ok) {
          const data = await response.json()
          setSettings(data.data)
        }
      } catch (error) {
        toast.error("Failed to load settings")
      } finally {
        setIsLoading(false)
      }
    }

    if (token) fetchSettings()
  }, [token])

  const handleSave = async () => {
    setIsSaving(true)
    try {
      const response = await fetch("/api/admin/settings", {
        method: "PATCH",
        headers: { 
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}` 
        },
        body: JSON.stringify(settings)
      })
      if (response.ok) {
        toast.success("Platform settings updated successfully")
      }
    } catch (error) {
      toast.error("Failed to update settings")
    } finally {
      setIsSaving(false)
    }
  }

  if (isLoading || !settings) {
    return <div className="container mx-auto p-8">Loading settings...</div>
  }

  return (
    <ProtectedRoute allowedRoles={["admin"]}>
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <header className="mb-10 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center gap-3">
              <Settings className="h-8 w-8 text-indigo-600" /> Platform Configuration
            </h1>
            <p className="text-gray-600">Manage site-wide constants and operational states</p>
          </div>
          <Button onClick={handleSave} disabled={isSaving} className="bg-indigo-600 hover:bg-indigo-700 rounded-xl px-8 font-bold">
            {isSaving ? "Saving..." : <><Save className="h-4 w-4 mr-2" /> Save Changes</>}
          </Button>
        </header>

        <div className="space-y-8">
          {/* General Settings */}
          <Card className="border-0 shadow-xl shadow-gray-200/50 rounded-3xl overflow-hidden">
            <CardHeader className="bg-gray-50/50 border-b border-gray-100">
              <CardTitle className="text-lg font-bold flex items-center gap-2">
                <Globe className="h-5 w-5 text-indigo-600" /> Identity & Locale
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6 space-y-4">
              <div className="space-y-2">
                <Label htmlFor="siteName" className="font-bold text-gray-700">Platform Name</Label>
                <Input 
                  id="siteName"
                  value={settings.siteName}
                  onChange={(e) => setSettings({...settings, siteName: e.target.value})}
                  className="rounded-xl border-gray-200 focus:ring-indigo-500"
                />
              </div>
            </CardContent>
          </Card>

          {/* Maintenance Mode */}
          <Card className="border-0 shadow-xl shadow-rose-100/50 rounded-3xl overflow-hidden border-l-4 border-l-rose-500">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg font-bold flex items-center gap-2">
                    <ShieldAlert className="h-5 w-5 text-rose-600" /> Maintenance Governance
                  </CardTitle>
                  <CardDescription>Lock platform access for system upgrades</CardDescription>
                </div>
                <Switch 
                  checked={settings.maintenanceMode}
                  onCheckedChange={(checked) => setSettings({...settings, maintenanceMode: checked})}
                />
              </div>
            </CardHeader>
            <CardContent>
              <div className="bg-rose-50 p-4 rounded-2xl border border-rose-100">
                <p className="text-sm text-rose-700 font-medium">
                  <strong>Warning:</strong> Enabling maintenance mode will prevent students and teachers from accessing their dashboards. Only administrators will be able to log in.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Announcements */}
          <Card className="border-0 shadow-xl shadow-amber-100/50 rounded-3xl overflow-hidden border-l-4 border-l-amber-500">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg font-bold flex items-center gap-2">
                    <Bell className="h-5 w-5 text-amber-600" /> Broadcast Center
                  </CardTitle>
                  <CardDescription>Publish site-wide notifications to all users</CardDescription>
                </div>
                <Switch 
                  checked={settings.announcement.isActive}
                  onCheckedChange={(checked) => setSettings({
                    ...settings, 
                    announcement: { ...settings.announcement, isActive: checked }
                  })}
                />
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label className="font-bold text-gray-700">Announcement Content</Label>
                <textarea 
                  className="w-full h-24 p-4 rounded-2xl border border-gray-200 focus:ring-2 focus:ring-amber-500 outline-none text-sm"
                  placeholder="Type your platform-wide message here..."
                  value={settings.announcement.text}
                  onChange={(e) => setSettings({
                    ...settings,
                    announcement: { ...settings.announcement, text: e.target.value }
                  })}
                />
              </div>
              <div className="flex gap-4">
                {["info", "warning", "success"].map((type) => (
                  <Button
                    key={type}
                    variant={settings.announcement.type === type ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSettings({
                      ...settings,
                      announcement: { ...settings.announcement, type }
                    })}
                    className="capitalize rounded-full px-6 font-bold"
                  >
                    {type}
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </ProtectedRoute>
  )
}
