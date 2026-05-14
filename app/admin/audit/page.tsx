"use client"



import { useEffect, useState } from "react"
import { ProtectedRoute } from "@/components/auth/protected-route"
import { useAuth } from "@/hooks/use-auth"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Search, Clock, Shield, User, FileText, ChevronRight, ChevronLeft } from "lucide-react"
import { toast } from "sonner"
import { format } from "date-fns"

interface AuditLog {
  _id: string
  adminName: string
  action: string
  targetType: string
  targetId: string
  details: any
  createdAt: string
}

export default function AuditLogsPage() {
  const [logs, setLogs] = useState<AuditLog[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const { token } = useAuth()

  const fetchLogs = async () => {
    setIsLoading(true)
    try {
      const response = await fetch(`/api/admin/audit?page=${page}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      if (response.ok) {
        const data = await response.json()
        setLogs(data.data.logs || [])
        setTotalPages(data.data.pagination.totalPages || 1)
      }
    } catch (error) {
      toast.error("Failed to load audit logs")
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (token) fetchLogs()
  }, [token, page])

  return (
    <ProtectedRoute allowedRoles={["admin"]}>
      <div className="container mx-auto px-4 py-8">
        <header className="mb-10">
          <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center gap-3">
            <Shield className="h-8 w-8 text-indigo-600" /> Operational Audit Trail
          </h1>
          <p className="text-gray-600">Total transparency and accountability for all administrative actions</p>
        </header>

        <Card className="border-0 shadow-2xl shadow-gray-200/50 rounded-3xl overflow-hidden">
          <CardHeader className="bg-gray-50/50 border-b border-gray-100 py-6">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg font-bold">System Activity Logs</CardTitle>
              <div className="flex items-center gap-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  disabled={page <= 1}
                  onClick={() => setPage(p => p - 1)}
                  className="rounded-xl"
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <span className="text-sm font-bold text-gray-500 px-2">
                  Page {page} of {totalPages}
                </span>
                <Button 
                  variant="outline" 
                  size="sm" 
                  disabled={page >= totalPages}
                  onClick={() => setPage(p => p + 1)}
                  className="rounded-xl"
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-left min-w-[800px]">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-100">
                    <th className="px-6 py-4 text-xs font-black uppercase tracking-widest text-gray-400">Timestamp</th>
                    <th className="px-6 py-4 text-xs font-black uppercase tracking-widest text-gray-400">Administrator</th>
                    <th className="px-6 py-4 text-xs font-black uppercase tracking-widest text-gray-400">Action</th>
                    <th className="px-6 py-4 text-xs font-black uppercase tracking-widest text-gray-400">Target Type</th>
                    <th className="px-6 py-4 text-xs font-black uppercase tracking-widest text-gray-400">Context/Details</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50 bg-white">
                  {isLoading ? (
                    [...Array(8)].map((_, i) => (
                      <tr key={i}>
                        <td className="px-6 py-4"><Skeleton className="h-4 w-32" /></td>
                        <td className="px-6 py-4"><Skeleton className="h-4 w-24" /></td>
                        <td className="px-6 py-4"><Skeleton className="h-6 w-32" /></td>
                        <td className="px-6 py-4"><Skeleton className="h-4 w-20" /></td>
                        <td className="px-6 py-4"><Skeleton className="h-4 w-48" /></td>
                      </tr>
                    ))
                  ) : logs.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-6 py-20 text-center text-gray-400 font-medium">
                        No activity logs recorded yet
                      </td>
                    </tr>
                  ) : (
                    logs.map((log) => (
                      <tr key={log._id} className="hover:bg-gray-50/50 transition-colors group">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2 text-sm text-gray-500 font-medium">
                            <Clock className="h-3 w-3" /> {format(new Date(log.createdAt), "MMM d, HH:mm:ss")}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <div className="h-7 w-7 rounded-full bg-indigo-50 flex items-center justify-center font-bold text-[10px] text-indigo-600 border border-indigo-100">
                              {log.adminName.charAt(0).toUpperCase()}
                            </div>
                            <span className="text-sm font-bold text-gray-700">{log.adminName}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <Badge className={`rounded-md px-2 py-0.5 font-bold text-[10px] tracking-wider ${
                            log.action.includes("DELETE") ? "bg-rose-50 text-rose-700" :
                            log.action.includes("CREATE") ? "bg-emerald-50 text-emerald-700" :
                            "bg-indigo-50 text-indigo-700"
                          }`}>
                            {log.action.replace("_", " ")}
                          </Badge>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-1.5 text-xs font-bold text-gray-400 uppercase tracking-widest">
                            {log.targetType === "user" ? <User className="h-3 w-3" /> : <FileText className="h-3 w-3" />}
                            {log.targetType}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-xs text-gray-600 font-medium bg-gray-50 rounded-lg p-2 group-hover:bg-white transition-colors border border-transparent group-hover:border-gray-100">
                            {JSON.stringify(log.details).length > 60 
                              ? JSON.stringify(log.details).substring(0, 60) + "..." 
                              : JSON.stringify(log.details)}
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
