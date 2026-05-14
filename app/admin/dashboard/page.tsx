"use client"








import { useEffect, useState } from "react"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Skeleton } from "@/components/ui/skeleton"
import { ProtectedRoute } from "@/components/auth/protected-route"
import { useAuth } from "@/hooks/use-auth"
import { 
  Users, 
  BookOpen, 
  TrendingUp, 
  Shield, 
  AlertTriangle, 
  CheckCircle, 
  Clock,
  BarChart3,
  Settings,
  Eye,
  Edit,
  Trash2,
  Plus,
  Activity,
  Target,
  Award
} from "lucide-react"

import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  AreaChart,
  Area,
  Cell,
  PieChart,
  Pie
} from "recharts"
import { toast } from "sonner"

interface SystemStats {
  totalUsers: number
  totalStudents: number
  totalTeachers: number
  newUsersThisMonth: number
  totalCourses: number
  publishedCourses: number
  pendingCourses: number
  totalEnrollments: number
  averageCourseProgress: number
  activeUsers: number
  userGrowth: Array<{ _id: { month: number; year: number }; count: number }>
  topTeachers: Array<{ teacherName: string; courseCount: number; totalStudents: number }>
}

interface RecentUser {
  _id: string
  username: string
  email: string
  role: string
  createdAt: string
  isActive: boolean
}

interface RecentCourse {
  _id: string
  title: string
  teacherName: string
  enrolledStudents: number
  isPublished: boolean
  createdAt: string
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<SystemStats | null>(null)
  const [recentUsers, setRecentUsers] = useState<RecentUser[]>([])
  const [recentCourses, setRecentCourses] = useState<RecentCourse[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const { token } = useAuth()

  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        const statsRes = await fetch("/api/admin/stats", {
          headers: { Authorization: `Bearer ${token}` }
        })
        if (statsRes.ok) {
          const data = await statsRes.json()
          setStats(data.data)
        }

        const usersRes = await fetch("/api/admin/users?limit=5", {
          headers: { Authorization: `Bearer ${token}` }
        })
        if (usersRes.ok) {
          const data = await usersRes.json()
          setRecentUsers(data.data?.users || [])
        }

        const coursesRes = await fetch("/api/admin/courses?limit=5", {
          headers: { Authorization: `Bearer ${token}` }
        })
        if (coursesRes.ok) {
          const data = await coursesRes.json()
          setRecentCourses(data.data?.courses || [])
        }
      } catch (error) {
        toast.error("Failed to load dashboard data")
      } finally {
        setIsLoading(false)
      }
    }

    if (token) fetchAdminData()
  }, [token])

  const chartData = stats?.userGrowth?.map(item => ({
    name: `${item._id.month}/${item._id.year}`,
    users: item.count
  })) || []

  if (isLoading || !stats) {
    return (
      <ProtectedRoute allowedRoles={["admin"]}>
        <div className="container mx-auto px-4 py-8 space-y-8">
          <div className="flex justify-between items-center">
            <Skeleton className="h-10 w-64" />
            <Skeleton className="h-10 w-32" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => <Skeleton key={i} className="h-32 w-full rounded-2xl" />)}
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <Skeleton className="h-80 w-full rounded-2xl" />
            <Skeleton className="h-80 w-full rounded-2xl" />
          </div>
        </div>
      </ProtectedRoute>
    )
  }

  return (
    <ProtectedRoute allowedRoles={["admin"]}>
      <div className="container mx-auto px-4 py-8">
        <header className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-4">
          <div>
            <h1 className="text-4xl font-black text-gray-900 tracking-tight flex items-center gap-3">
              Organization <span className="text-indigo-600">Command Center</span>
            </h1>
            <p className="text-gray-500 font-medium mt-1">Enterprise oversight and platform growth analytics</p>
          </div>
          <div className="flex items-center gap-3">
            <Badge className="bg-indigo-50 text-indigo-700 hover:bg-indigo-100 border-indigo-100 px-4 py-1.5 text-sm font-bold rounded-full">
              Live Monitoring Active
            </Badge>
          </div>
        </header>

        {/* Vital Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          {[
            { label: "Active Students", value: stats.totalStudents, sub: `+${stats.newUsersThisMonth} new`, icon: Users, color: "indigo" },
            { label: "Faculty Network", value: stats.totalTeachers, sub: "Verified Teachers", icon: Shield, color: "emerald" },
            { label: "Course Library", value: stats.totalCourses, sub: `${stats.pendingCourses} pending QA`, icon: BookOpen, color: "amber" },
            { label: "Total Enrollments", value: stats.totalEnrollments, sub: `${stats.activeUsers} active now`, icon: TrendingUp, color: "purple" },
          ].map((item, i) => (
            <Card key={i} className="border-0 shadow-lg shadow-gray-200/50 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
              <CardContent className="p-6">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-xs font-black uppercase tracking-widest text-gray-400 mb-1">{item.label}</p>
                    <h3 className="text-3xl font-black text-gray-900 leading-none">{item.value?.toLocaleString() || "0"}</h3>
                    <p className={`text-xs font-bold mt-2 text-${item.color}-600`}>{item.sub}</p>
                  </div>
                  <div className={`p-3 bg-${item.color}-50 rounded-xl`}>
                    <item.icon className={`h-6 w-6 text-${item.color}-600`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-10">
          {/* Growth Chart */}
          <Card className="lg:col-span-2 border-0 shadow-2xl shadow-indigo-100/20 rounded-3xl overflow-hidden">
            <CardHeader className="bg-white/50 backdrop-blur-sm border-b border-gray-50 pb-8">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-xl font-bold">Acquisition Growth</CardTitle>
                  <CardDescription>Monthly student and teacher enrollment trends</CardDescription>
                </div>
                <div className="flex gap-2">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-gray-500 bg-gray-50 px-3 py-1.5 rounded-full">
                    <div className="h-2 w-2 rounded-full bg-indigo-500" /> New Users
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-10 h-[350px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6366f1" stopOpacity={0.1}/>
                      <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis 
                    dataKey="name" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{fill: '#94a3b8', fontSize: 12, fontWeight: 600}}
                    dy={10}
                  />
                  <YAxis 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{fill: '#94a3b8', fontSize: 12, fontWeight: 600}}
                  />
                  <Tooltip 
                    contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)' }}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="users" 
                    stroke="#6366f1" 
                    strokeWidth={4} 
                    fillOpacity={1} 
                    fill="url(#colorUsers)" 
                  />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Top Faculty */}
          <Card className="border-0 shadow-2xl shadow-emerald-100/20 rounded-3xl overflow-hidden bg-gradient-to-br from-indigo-900 to-indigo-950 text-white">
            <CardHeader className="border-b border-white/10 pb-6">
              <CardTitle className="text-xl font-bold flex items-center gap-2">
                <Award className="h-6 w-6 text-amber-400" /> Top Faculty Members
              </CardTitle>
              <CardDescription className="text-indigo-200">Most impactful teachers by enrollment</CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="space-y-6">
                {stats?.topTeachers?.map((teacher, i) => (
                  <div key={i} className="flex items-center justify-between group">
                    <div className="flex items-center gap-4">
                      <div className="h-10 w-10 rounded-full bg-white/10 flex items-center justify-center font-bold text-indigo-200 border border-white/5 group-hover:bg-indigo-500 group-hover:text-white transition-all">
                        {i + 1}
                      </div>
                      <div>
                        <p className="font-bold text-sm">{teacher.teacherName}</p>
                        <p className="text-[10px] text-indigo-300 font-bold uppercase tracking-wider">{teacher.courseCount} Courses Published</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-black text-white">{teacher.totalStudents?.toLocaleString() || "0"}</p>
                      <p className="text-[10px] text-indigo-300 font-bold">Students</p>
                    </div>
                  </div>
                ))}
              </div>
              <Link href="/admin/users?role=teacher" className="mt-8 block">
                <Button className="w-full bg-white/10 hover:bg-white/20 border-white/5 text-white font-bold rounded-xl py-6">
                  View Full Faculty Network
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Quick Oversight Table */}
          <Card className="border-0 shadow-xl shadow-gray-200/50 rounded-3xl overflow-hidden">
            <CardHeader className="bg-gray-50/50 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg font-bold">Recent Course Intake</CardTitle>
                <Link href="/admin/courses?status=pending">
                  <Button variant="ghost" size="sm" className="text-indigo-600 font-bold hover:bg-indigo-50">Review All</Button>
                </Link>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-gray-50">
                {recentCourses.map((course) => (
                  <div key={course._id} className="p-4 flex items-center justify-between hover:bg-gray-50/50 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-lg bg-indigo-50 flex items-center justify-center">
                        <BookOpen className="h-5 w-5 text-indigo-600" />
                      </div>
                      <div>
                        <p className="font-bold text-gray-900 text-sm leading-tight">{course.title}</p>
                        <p className="text-xs text-gray-400 font-medium">by {course.teacherName}</p>
                      </div>
                    </div>
                    <Badge className={course.isPublished ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700"}>
                      {course.isPublished ? "Active" : "Audit Required"}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* User Onboarding Monitor */}
          <Card className="border-0 shadow-xl shadow-gray-200/50 rounded-3xl overflow-hidden">
            <CardHeader className="bg-gray-50/50 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg font-bold">Student Onboarding Monitor</CardTitle>
                <Link href="/admin/users">
                  <Button variant="ghost" size="sm" className="text-indigo-600 font-bold hover:bg-indigo-50">Manage Users</Button>
                </Link>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-gray-50">
                {recentUsers.map((user) => (
                  <div key={user._id} className="p-4 flex items-center justify-between hover:bg-gray-50/50 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center font-bold text-gray-600">
                        {user.username.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="font-bold text-gray-900 text-sm leading-tight">{user.username}</p>
                        <p className="text-xs text-gray-400 font-medium">{user.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge variant="outline" className="text-[10px] font-bold uppercase tracking-widest">{user.role}</Badge>
                      <div className={`h-2 w-2 rounded-full ${user.isActive ? 'bg-emerald-500' : 'bg-rose-500'}`} />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </ProtectedRoute>
  )
}
