"use client"

import Image from "next/image"
import Link from "next/link"
import { Moon, Sun, LogIn, UserPlus } from "lucide-react"
import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"

const Navbar = () => {
  const { theme, setTheme } = useTheme()

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Services", href: "/services" },
    { name: "Pricing", href: "/pricing" },
    { name: "FAQs", href: "/FrequentlyAskedQuestions" },
    { name: "Documentation", href: "/documentation" },
  ]

  return (
    <nav className="fixed top-6 left-1/2 -translate-x-1/2 z-50 font-outfit w-[80%]">
      <div className="bg-white/40 dark:bg-gray-950/30 backdrop-blur-md border border-gray-200 dark:border-gray-800 rounded-full shadow-lg px-8 flex items-center justify-between gap-12 w-full">
        {/* Logo - Left */}
        <div className="shrink-0 relative w-28 h-20">
          <Link href="/" className="flex items-center">
            <Image 
              src="/Logo.png" 
              alt="Logo.png" 
              fill={true}
              className="object-contain"
            />
          </Link>
        </div>

        {/* Navigation Links - Center */}
        <div className="flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className="text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white duration-200 hover:scale-105 transform whitespace-nowrap transition-all ease-in-out"
            >
              {link.name}
            </Link>
          ))}
        </div>

        {/* Actions - Right */}
        <div className="flex items-center gap-2">
          {/* Theme Toggle */}
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

          {/* Login Button */}
          <Button
            variant="ghost"
            size="sm"
            className="flex items-center gap-2 font-medium rounded-full text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800"
            asChild
          >
            <Link href="/login">
              <LogIn className="h-4 w-4" />
              Log In
            </Link>
          </Button>

          {/* Sign Up Button */}
          <Button
            size="sm"
            className="flex items-center gap-2 font-medium rounded-full bg-gray-900 dark:bg-white text-white dark:text-gray-900 hover:bg-gray-800 dark:hover:bg-gray-100"
            asChild
          >
            <Link href="/signup">
              <UserPlus className="h-4 w-4" />
              Sign Up
            </Link>
          </Button>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
