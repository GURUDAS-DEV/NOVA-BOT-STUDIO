"use client"

import { useState, useRef, useEffect } from "react"
import Image from "next/image"
import { MdNotificationsNone, MdOutlineSettings, MdKeyboardArrowDown } from "react-icons/md"
import { Moon, Sun, User, LogOut, Users, Settings, UserCircle } from "lucide-react"
import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"
import { useAuthStore } from "@/lib/Store/store"
import { CiMoneyCheck1 } from "react-icons/ci"

const TopBar = () => {
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement | null>(null);
  const {email, username} = useAuthStore();

  const {theme, setTheme} = useTheme();

  useEffect(() => {
    const onClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setUserMenuOpen(false)
      }
    }
    document.addEventListener("mousedown", onClickOutside)
    return () => document.removeEventListener("mousedown", onClickOutside)
  }, [])

  return (
    <div className="w-full mt-8 bg-pink-50 dark:bg-black/60   dark:supports-backdrop-filter:bg-black/50 ">
      <div className="mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-end gap-4">
        {/* Left side - Plan Badge */}
        <div className="flex items-center">
          <div className="group cursor-pointer px-4 py-1.5 bg-white dark:bg-stone-900 border border-gray-200 dark:border-stone-800 rounded-full hover:border-pink-300 dark:hover:border-pink-900 transition-all duration-200 hover:shadow-sm">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-gray-900 dark:text-white font-outfit">
                Free Plan
              </span>
              <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
            </div>
          </div>
        </div>

        {/* Right controls */}
        <div className="flex items-center gap-2">
          {/* Optional quick action button */}
          <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="rounded-full cursor-pointer text-gray-700 dark:text-gray-300 hover:text-gray-900 hover:bg-accent h-9 w-9"
            >
              <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
              <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
              <span className="sr-only">Toggle theme</span>
            </Button>

          {/* Notifications */}
<Button
              variant="ghost"
              size="icon"
              className="rounded-full cursor-pointer text-gray-700 dark:text-gray-300 hover:text-gray-900 hover:bg-accent h-9 w-9"
            >
              <MdNotificationsNone className="h-5 w-5" />
            </Button>
          {/* User avatar with dropdown */}
          <div className="relative" ref={menuRef}>
           <Button
              variant="ghost"
              size="icon"
              onClick={() => setUserMenuOpen(!userMenuOpen)}
              className="rounded-full cursor-pointer text-gray-700 dark:text-gray-300 hover:text-gray-900 hover:bg-accent h-9 w-9"
            >
              <User className="h-5 w-5"  />
              <span className="sr-only">Toggle theme</span>
            </Button>

            {userMenuOpen && (
              <div className="absolute right-0 mt-3 w-64 rounded-2xl border border-gray-200 dark:border-stone-800 bg-white dark:bg-stone-900 shadow-2xl backdrop-blur-xl animate-in fade-in slide-in-from-top-2 duration-200 overflow-hidden">
                {/* User Info Header */}
                <div className="p-4 bg-gradient-to-br from-pink-50 to-white dark:from-stone-800 dark:to-stone-900 border-b border-gray-200 dark:border-stone-800">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-pink-500 to-pink-600 flex items-center justify-center text-white font-semibold text-sm shadow-lg">
                        {username?.charAt(0).toUpperCase() || "U"}
                      </div>
                      <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border-2 border-white dark:border-stone-900" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">{username || "User"}</p>
                      <p className="text-xs text-gray-600 dark:text-gray-400 truncate">{email || "user@example.com"}</p>
                    </div>
                  </div>
                </div>

                {/* Menu Items */}
                <div className="p-2">
                  <button className="w-full flex items-center gap-3 px-3 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-stone-800 rounded-lg transition-colors group">
                    <UserCircle className="w-4 h-4 text-gray-500 dark:text-gray-400 group-hover:text-pink-600 dark:group-hover:text-pink-400 transition-colors" />
                    <span className="font-medium">Profile</span>
                  </button>
                  
                  <button className="w-full flex items-center gap-3 px-3 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-stone-800 rounded-lg transition-colors group">
                    <Users className="w-4 h-4 text-gray-500 dark:text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors" />
                    <span className="font-medium">Team</span>
                  </button>
                  
                  <button className="w-full flex items-center gap-3 px-3 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-stone-800 rounded-lg transition-colors group">
                    <CiMoneyCheck1 className="w-4 h-4 text-gray-500 dark:text-gray-400 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors" />
                    <span className="font-medium">Billing</span>
                  </button>
                  <button className="w-full flex items-center gap-3 px-3 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-stone-800 rounded-lg transition-colors group">
                    <Settings className="w-4 h-4 text-gray-500 dark:text-gray-400 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors" />
                    <span className="font-medium">Settings</span>
                  </button>
                </div>

                {/* Logout Section */}
                <div className="p-2 border-t border-gray-200 dark:border-stone-800">
                  <button className="w-full flex items-center gap-3 px-3 py-2.5 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-lg transition-colors group">
                    <LogOut className="w-4 h-4" />
                    <span className="font-medium">Log out</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default TopBar
