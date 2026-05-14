"use client"

import { useEffect, useState } from "react"
import { ProtectedRoute } from "@/components/auth/protected-route"
import { useAuth } from "@/hooks/use-auth"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Trash2, BookOpen, Eye, EyeOff, Search, ExternalLink, CheckCircle2, XCircle, MoreVertical, Filter, Layers, Users } from "lucide-react"
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu"
import Link from "next/link"
import { toast } from "sonner"

interface Course {
  _id: string
  title: string
  teacherName: string
  category: string
  difficulty: string
  status: string
  isPublished: boolean
  enrolledStudents: number
  lessonCount: number
  thumbnail: string
  createdAt: string
}

export default function ManageCoursesPage() {
  const [courses, setCourses] = useState<Course[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const { token } = useAuth()

  const fetchCourses = async () => {
    setIsLoading(true)
    try {
      let url = `/api/admin/courses?search=${encodeURIComponent(searchTerm)}`
      if (statusFilter !== "all") url += `&status=${statusFilter}`
      if (categoryFilter !== "all") url += `&category=${categoryFilter}`

      const response = await fetch(url, {
        headers: { Authorization: `Bearer ${token}` }
      })
      if (response.ok) {
        const data = await response.json()
        setCourses(data.data.courses || [])
      }
    } catch (error) {
      console.error("Error fetching courses:", error)
      toast.error("Failed to load courses")
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (token) fetchCourses()
    }, 500)

    return () => clearTimeout(delayDebounceFn)
  }, [token, searchTerm, statusFilter, categoryFilter])

  const handleUpdateCourse = async (courseId: string, updates: any) => {
    try {
      const response = await fetch("/api/admin/courses", {
        method: "PATCH",
        headers: { 
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}` 
        },
        body: JSON.stringify({ courseId, ...updates })
      })
      if (response.ok) {
        toast.success("Course updated successfully")
        fetchCourses()
      }
    } catch (error) {
      toast.error("Failed to update course")
    }
  }

  const handleDeleteCourse = async (courseId: string) => {
    if (!confirm("Are you sure you want to delete this course? This action cannot be undone.")) return

    try {
      const response = await fetch(`/api/admin/courses?courseId=${courseId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }
      })
      if (response.ok) {
        toast.success("Course deleted successfully")
        fetchCourses()
      }
    } catch (error) {
      toast.error("Failed to delete course")
    }
  }

  return (
    <ProtectedRoute allowedRoles={["admin"]}>
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-8 gap-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Global Course Oversight</h1>
            <p className="text-gray-600">Audit content quality and manage the platform's academic catalog</p>
          </div>
          
          <div className="flex flex-wrap gap-4">
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="text"
                placeholder="Search title or teacher..."
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <select 
              className="px-4 py-2 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500 bg-white text-sm"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">All Statuses</option>
              <option value="pending">Pending Review</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
              <option value="draft">Drafts</option>
            </select>
          </div>
        </div>

        <Card className="border-0 shadow-xl shadow-indigo-100/50 overflow-hidden">
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-left min-w-[900px]">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-100">
                    <th className="px-6 py-4 text-sm font-semibold text-gray-600">Course Metadata</th>
                    <th className="px-6 py-4 text-sm font-semibold text-gray-600">Faculty</th>
                    <th className="px-6 py-4 text-sm font-semibold text-gray-600">Engagement</th>
                    <th className="px-6 py-4 text-sm font-semibold text-gray-600">QA Status</th>
                    <th className="px-6 py-4 text-sm font-semibold text-gray-600 text-right">Moderation</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 bg-white">
                  {isLoading ? (
                    [...Array(5)].map((_, i) => (
                      <tr key={i}>
                        <td className="px-6 py-4"><Skeleton className="h-14 w-64" /></td>
                        <td className="px-6 py-4"><Skeleton className="h-6 w-32" /></td>
                        <td className="px-6 py-4"><Skeleton className="h-6 w-20" /></td>
                        <td className="px-6 py-4"><Skeleton className="h-6 w-24" /></td>
                        <td className="px-6 py-4 text-right"><Skeleton className="h-8 w-24 ml-auto" /></td>
                      </tr>
                    ))
                  ) : courses.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-6 py-20 text-center">
                        <div className="flex flex-col items-center gap-2 text-gray-400">
                          <Layers className="h-12 w-12 opacity-20" />
                          <p className="font-medium">No courses found matching your criteria</p>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    courses.map((course) => (
                      <tr key={course._id} className="hover:bg-gray-50/50 transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-4">
                            <img 
                              src={course.thumbnail || "https://images.unsplash.com/photo-1546410531-bb4caa6b424d?w=200&h=120&fit=crop"} 
                              alt="" 
                              className="w-16 h-10 rounded-lg object-cover shadow-sm ring-1 ring-gray-100"
                            />
                            <div>
                              <p className="font-bold text-gray-900 leading-tight">{course.title}</p>
                              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1">
                                {course.category} • {course.difficulty}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex flex-col">
                            <span className="text-sm font-bold text-gray-700">{course.teacherName}</span>
                            <span className="text-[10px] text-gray-400">Owner ID: {course._id.slice(-6)}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-4 text-xs font-bold text-gray-500">
                            <div className="flex items-center gap-1">
                              <Users className="h-3 w-3" /> {course.enrolledStudents}
                            </div>
                            <div className="flex items-center gap-1">
                              <BookOpen className="h-3 w-3" /> {course.lessonCount}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <Badge 
                            className={`rounded-md px-3 py-1 font-bold text-[10px] tracking-wider ${
                              course.status === "approved" ? "bg-emerald-50 text-emerald-700" :
                              course.status === "pending" ? "bg-amber-50 text-amber-700" :
                              course.status === "rejected" ? "bg-rose-50 text-rose-700" :
                              "bg-slate-100 text-slate-600"
                            }`}
                          >
                            {course.status?.toUpperCase() || "DRAFT"}
                          </Badge>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end gap-1">
                            <Link href={`/course/${course._id}`} target="_blank">
                              <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-indigo-600">
                                <ExternalLink className="h-4 w-4" />
                              </Button>
                            </Link>
                            
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                  <MoreVertical className="h-4 w-4 text-gray-400" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end" className="w-48">
                                {course.status === "pending" && (
                                  <>
                                    <DropdownMenuItem onClick={() => handleUpdateCourse(course._id, { status: "approved", isPublished: true })} className="text-emerald-600 font-medium">
                                      <CheckCircle2 className="h-4 w-4 mr-2" /> Approve & Publish
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => handleUpdateCourse(course._id, { status: "rejected" })} className="text-rose-600 font-medium">
                                      <XCircle className="h-4 w-4 mr-2" /> Reject Content
                                    </DropdownMenuItem>
                                  </>
                                )}
                                <DropdownMenuItem onClick={() => handleUpdateCourse(course._id, { isPublished: !course.isPublished })}>
                                  {course.isPublished ? (
                                    <><EyeOff className="h-4 w-4 mr-2 text-amber-500" /> Unpublish Course</>
                                  ) : (
                                    <><Eye className="h-4 w-4 mr-2 text-emerald-500" /> Publish Directly</>
                                  )}
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleDeleteCourse(course._id)} className="text-rose-600">
                                  <Trash2 className="h-4 w-4 mr-2" /> Delete Permanently
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
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
