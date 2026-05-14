"use client"

import { useEffect, useState } from "react"
import { ProtectedRoute } from "@/components/auth/protected-route"
import { useAuth } from "@/hooks/use-auth"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Search, Mail, Filter, UserX, UserCheck, Trash2, CheckCircle2, XCircle, MoreVertical } from "lucide-react"
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu"

interface User {
  _id: string
  username: string
  email: string
  role: string
  isActive: boolean
  teacherStatus?: string
  createdAt: string
}

export default function ManageUsersPage() {
  const [users, setUsers] = useState<User[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [roleFilter, setRoleFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")
  const [teacherStatusFilter, setTeacherStatusFilter] = useState("all")
  const { token } = useAuth()

  const fetchUsers = async () => {
    setIsLoading(true)
    try {
      let url = `/api/admin/users?search=${encodeURIComponent(searchTerm)}`
      if (roleFilter !== "all") url += `&role=${roleFilter}`
      if (statusFilter !== "all") url += `&isActive=${statusFilter === "active"}`
      if (teacherStatusFilter !== "all") url += `&teacherStatus=${teacherStatusFilter}`

      const response = await fetch(url, {
        headers: { Authorization: `Bearer ${token}` }
      })
      if (response.ok) {
        const data = await response.json()
        setUsers(data.data.users || [])
      }
    } catch (error) {
      console.error("Error fetching users:", error)
      toast.error("Failed to load users")
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (token) fetchUsers()
    }, 500)

    return () => clearTimeout(delayDebounceFn)
  }, [token, searchTerm, roleFilter, statusFilter, teacherStatusFilter])

  const handleUpdateUser = async (userId: string, updates: any) => {
    try {
      const response = await fetch("/api/admin/users", {
        method: "PATCH",
        headers: { 
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}` 
        },
        body: JSON.stringify({ userId, ...updates })
      })
      if (response.ok) {
        toast.success("User updated successfully")
        fetchUsers()
      }
    } catch (error) {
      toast.error("Failed to update user")
    }
  }

  const handleDeleteUser = async (userId: string) => {
    if (!confirm("Are you sure you want to delete this user? This action cannot be undone.")) return

    try {
      const response = await fetch(`/api/admin/users?userId=${userId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }
      })
      if (response.ok) {
        toast.success("User deleted successfully")
        fetchUsers()
      }
    } catch (error) {
      toast.error("Failed to delete user")
    }
  }

  return (
    <ProtectedRoute allowedRoles={["admin"]}>
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-8 gap-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">User Management</h1>
            <p className="text-gray-600">Oversee your global community and faculty network</p>
          </div>
          
          <div className="flex flex-wrap gap-4">
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="text"
                placeholder="Search by name or email..."
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <select 
              className="px-4 py-2 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500 bg-white text-sm"
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
            >
              <option value="all">All Roles</option>
              <option value="student">Students</option>
              <option value="teacher">Teachers</option>
              <option value="admin">Admins</option>
            </select>

            <select 
              className="px-4 py-2 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500 bg-white text-sm"
              value={teacherStatusFilter}
              onChange={(e) => setTeacherStatusFilter(e.target.value)}
            >
              <option value="all">Onboarding: All</option>
              <option value="pending">Pending Review</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
        </div>

        <Card className="border-0 shadow-xl shadow-indigo-100/50 overflow-hidden">
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-left min-w-[800px]">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-100">
                    <th className="px-6 py-4 text-sm font-semibold text-gray-600">Identity</th>
                    <th className="px-6 py-4 text-sm font-semibold text-gray-600">Authorization</th>
                    <th className="px-6 py-4 text-sm font-semibold text-gray-600">Onboarding</th>
                    <th className="px-6 py-4 text-sm font-semibold text-gray-600">Status</th>
                    <th className="px-6 py-4 text-sm font-semibold text-gray-600 text-right">Moderation</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 bg-white">
                  {isLoading ? (
                    [...Array(5)].map((_, i) => (
                      <tr key={i}>
                        <td className="px-6 py-4"><Skeleton className="h-12 w-48" /></td>
                        <td className="px-6 py-4"><Skeleton className="h-6 w-20" /></td>
                        <td className="px-6 py-4"><Skeleton className="h-6 w-24" /></td>
                        <td className="px-6 py-4"><Skeleton className="h-6 w-16" /></td>
                        <td className="px-6 py-4 text-right"><Skeleton className="h-8 w-24 ml-auto" /></td>
                      </tr>
                    ))
                  ) : users.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-6 py-20 text-center">
                        <div className="flex flex-col items-center gap-2">
                          <Users className="h-12 w-12 text-gray-200" />
                          <p className="text-gray-500 font-medium">No users found matching your criteria</p>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    users.map((user) => (
                      <tr key={user._id} className="hover:bg-gray-50/50 transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-4">
                            <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-xl flex items-center justify-center text-white font-bold shadow-lg shadow-indigo-100">
                              {user.username.charAt(0).toUpperCase()}
                            </div>
                            <div>
                              <p className="font-bold text-gray-900">{user.username}</p>
                              <p className="text-xs text-gray-500 font-medium flex items-center gap-1">
                                <Mail className="h-3 w-3" /> {user.email}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <Badge 
                            variant="secondary" 
                            className={`rounded-md px-3 py-1 font-semibold ${
                              user.role === "admin" ? "bg-red-50 text-red-700" : 
                              user.role === "teacher" ? "bg-indigo-50 text-indigo-700" : 
                              "bg-slate-50 text-slate-700"
                            }`}
                          >
                            {user.role.toUpperCase()}
                          </Badge>
                        </td>
                        <td className="px-6 py-4">
                          {user.role === "teacher" || user.teacherStatus !== "none" ? (
                            <Badge 
                              className={`rounded-md px-3 py-1 font-semibold ${
                                user.teacherStatus === "approved" ? "bg-emerald-50 text-emerald-700" :
                                user.teacherStatus === "pending" ? "bg-amber-50 text-amber-700" :
                                "bg-rose-50 text-rose-700"
                              }`}
                            >
                              {user.teacherStatus?.toUpperCase() || "PENDING"}
                            </Badge>
                          ) : (
                            <span className="text-gray-400 text-xs">-</span>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <div className={`h-2 w-2 rounded-full ${user.isActive ? "bg-emerald-500" : "bg-rose-500"}`} />
                            <span className={`text-sm font-bold ${user.isActive ? "text-emerald-600" : "text-rose-600"}`}>
                              {user.isActive ? "ACTIVE" : "SUSPENDED"}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                <MoreVertical className="h-4 w-4 text-gray-400" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-48">
                              {user.teacherStatus === "pending" && (
                                <>
                                  <DropdownMenuItem onClick={() => handleUpdateUser(user._id, { teacherStatus: "approved", role: "teacher" })} className="text-emerald-600 font-medium">
                                    <CheckCircle2 className="h-4 w-4 mr-2" /> Approve Teacher
                                  </DropdownMenuItem>
                                  <DropdownMenuItem onClick={() => handleUpdateUser(user._id, { teacherStatus: "rejected" })} className="text-rose-600 font-medium">
                                    <XCircle className="h-4 w-4 mr-2" /> Reject Application
                                  </DropdownMenuItem>
                                </>
                              )}
                              <DropdownMenuItem onClick={() => handleUpdateUser(user._id, { isActive: !user.isActive })}>
                                {user.isActive ? (
                                  <><UserX className="h-4 w-4 mr-2 text-rose-500" /> Suspend Account</>
                                ) : (
                                  <><UserCheck className="h-4 w-4 mr-2 text-emerald-500" /> Reactivate Account</>
                                )}
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleDeleteUser(user._id)} className="text-rose-600">
                                <Trash2 className="h-4 w-4 mr-2" /> Delete Permanently
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </ProtectedRoute>
  )
}
