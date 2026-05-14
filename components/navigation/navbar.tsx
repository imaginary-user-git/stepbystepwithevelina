"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { useAuth } from "@/hooks/use-auth"
import { Menu, X, ArrowRight, BookOpen, DollarSign, Info, Phone } from "lucide-react"

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  const { user, logout } = useAuth()
  const router = useRouter()

  useEffect(() => {
    setMounted(true)
  }, [])

  const handleLogout = () => {
    logout()
    router.push("/")
  }

  const getDashboardLink = () => {
    if (!user) return "/dashboard"

    switch (user.role) {
      case "admin":
        return "/admin/dashboard"
      case "teacher":
        return "/teacher/dashboard"
      default:
        return "/dashboard"
    }
  }

  const navLinks = [
    { name: "Courses", href: "/courses", icon: BookOpen },
    { name: "Pricing", href: "/pricing", icon: DollarSign },
    { name: "About", href: "/about", icon: Info },
    { name: "Contact", href: "/contact", icon: Phone },
  ]

  return (
    <nav className="border-b bg-white/80 backdrop-blur-md supports-[backdrop-filter]:bg-white/60 sticky top-0 z-50">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center space-x-3 group">
          <div className="relative">
            <img src="/main-logo.jpeg" alt="Step by Step English Logo" className="w-10 h-10 rounded-full object-cover group-hover:scale-110 transition-transform duration-300 border border-indigo-200" />
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white animate-pulse"></div>
          </div>
          <span className="font-bold text-lg md:text-xl bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent truncate max-w-[150px] sm:max-w-none">
            Step by Step English
          </span>
        </Link>

        {/* Desktop Navigation Links */}
        <div className="hidden md:flex items-center space-x-8">
          {navLinks.map((link) => (
            <Link key={link.name} href={link.href} className="text-gray-700 hover:text-gray-900 transition-colors font-medium">
              {link.name}
            </Link>
          ))}
        </div>

        {/* User Actions & Mobile Toggle */}
          <div className="flex items-center space-x-2 md:space-x-4">
          <div className="hidden sm:flex items-center space-x-2">
            {mounted && (user ? (
              <Link href={getDashboardLink()}>
                <Button variant="ghost" className="hover:bg-indigo-100 hover:text-indigo-700 hidden lg:flex">Dashboard</Button>
              </Link>
            ) : (
              <Link href="/auth/login">
                <Button variant="ghost" className="hover:bg-indigo-100 hover:text-indigo-700 hidden lg:flex">
                  Sign In
                </Button>
              </Link>
            ))}
          </div>

          {mounted && (user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-9 w-9 rounded-full border border-indigo-100 p-0 overflow-hidden">
                  <Avatar className="h-full w-full">
                    <AvatarFallback className="bg-indigo-600 text-white">{user.username.charAt(0).toUpperCase()}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56 mt-2" align="end" forceMount>
                <div className="flex items-center justify-start gap-2 p-2 bg-gray-50/50">
                  <div className="flex flex-col space-y-1 leading-none">
                    <p className="font-bold text-gray-900">{user.username}</p>
                    <p className="w-[200px] truncate text-xs text-gray-500">{user.email}</p>
                    <Badge variant="secondary" className="w-fit text-[10px] py-0 mt-1 capitalize">{user.role}</Badge>
                  </div>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/profile" className="flex items-center px-2 py-2 cursor-pointer">
                    <span className="mr-3 text-lg">👤</span>
                    Profile
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/settings" className="flex items-center px-2 py-2 cursor-pointer">
                    <span className="mr-3 text-lg">⚙️</span>
                    Settings
                  </Link>
                </DropdownMenuItem>
                {user.role === "admin" && (
                  <>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link href="/admin/users" className="flex items-center px-2 py-2 cursor-pointer">
                        <span className="mr-3 text-lg">👥</span>
                        Manage Users
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/admin/courses" className="flex items-center px-2 py-2 cursor-pointer">
                        <span className="mr-3 text-lg">📚</span>
                        Course Oversight
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/admin/audit" className="flex items-center px-2 py-2 cursor-pointer">
                        <span className="mr-3 text-lg">📜</span>
                        Audit Trail
                      </Link>
                    </DropdownMenuItem>
                  </>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="flex items-center px-2 py-2 cursor-pointer text-red-600 focus:text-red-700 focus:bg-red-50">
                  <span className="mr-3 text-lg">🚪</span>
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Link href="/auth/register" className="hidden sm:block">
              <Button className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-md">
                <span className="hidden lg:inline">Get Started</span>
                <span className="lg:hidden">Start</span>
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          ))}
        </div>

          {/* Mobile Menu Button */}
          <button 
            className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="h-6 w-6 text-gray-600" /> : <Menu className="h-6 w-6 text-gray-600" />}
          </button>
        </div>

      {/* Mobile Menu Overlay */}
      {isMenuOpen && (
        <div className="md:hidden absolute top-16 left-0 w-full bg-white border-b shadow-xl animate-in slide-in-from-top duration-300 z-40">
          <div className="p-4 space-y-2">
            {navLinks.map((link) => (
              <Link 
                key={link.name} 
                href={link.href} 
                onClick={() => setIsMenuOpen(false)}
                className="flex items-center p-4 rounded-xl hover:bg-indigo-50 text-gray-700 hover:text-indigo-700 transition-all font-medium border border-transparent hover:border-indigo-100"
              >
                <link.icon className="mr-4 h-5 w-5 opacity-70" />
                {link.name}
              </Link>
            ))}
            <div className="pt-4 mt-4 border-t border-gray-100 grid grid-cols-2 gap-4">
              {!user ? (
                <>
                  <Link href="/auth/login" onClick={() => setIsMenuOpen(false)}>
                    <Button variant="outline" className="w-full border-indigo-100">Sign In</Button>
                  </Link>
                  <Link href="/auth/register" onClick={() => setIsMenuOpen(false)}>
                    <Button className="w-full bg-indigo-600 text-white">Register</Button>
                  </Link>
                </>
              ) : (
                <Link href={getDashboardLink()} onClick={() => setIsMenuOpen(false)} className="col-span-2">
                  <Button className="w-full bg-indigo-600 text-white">Go to Dashboard</Button>
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  )
}
