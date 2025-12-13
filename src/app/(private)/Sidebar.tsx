
"use client"

import Link from "next/link"
import { useState } from "react"
import { usePathname } from "next/navigation"
import { 
  MdDashboard, 
  MdAdd, 
  MdSettings,
  MdMenu,
  MdClose
} from "react-icons/md"
import { 
  FaRobot, 
  FaTelegram, 
  FaDiscord, 
  FaInstagram, 
  FaWhatsapp 
} from "react-icons/fa"
import { 
  BiCodeBlock, 
  BiKey 
} from "react-icons/bi"
import { RiBillLine } from "react-icons/ri"
import Image from "next/image"

const Sidebar = () => {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)

  const isActive = (path: string) => pathname === path

  const mainNav = [
    { href: "/home", label: "Home", icon: MdDashboard },
    { href: "/CreateBots", label: "Create Bots", icon: MdAdd },
    { href: "/ManageBots", label: "Manage Bots", icon: FaRobot },
  ]

  const integrations = [
    { href: "/home/integration/telegram", label: "Telegram", icon: FaTelegram },
    { href: "/home/integration/discord", label: "Discord", icon: FaDiscord },
    { href: "/home/integration/instagram", label: "Instagram", icon: FaInstagram },
    { href: "/home/integration/whatsapp", label: "WhatsApp", icon: FaWhatsapp },
    { href: "/home/integration/custom", label: "Custom Webhook", icon: BiCodeBlock },
  ]

  const NavLink = ({ href, label, icon: Icon, active, size = "default" }: { href: string; label: string; icon: React.ElementType; active: boolean; size?: "default" | "small" }) => (
    <Link
      href={href}
      onClick={() => setIsOpen(false)}
      className={`group flex items-center gap-3 rounded-lg transition-all duration-200 ${
        size === "small" ? "px-3 py-2" : "px-4 py-2.5"
      } ${
        active
          ? "bg-linear-to-r from-blue-400 via-blue-500 to-blue-600  text-white shadow-lg"
          : "text-gray-700 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800/50"
      }`}
    >
      <Icon className={`${size === "small" ? "h-4 w-4" : "h-5 w-5"} ${!active && "group-hover:scale-110 transition-transform"}`} />
      <span className={`font-outfit ${size === "small" ? "text-xs" : "text-sm font-medium"}`}>
        {label}
      </span>
    </Link>
  )

  const renderSidebarContent = () => (
    <div className="flex flex-col h-full overflow-y-auto">
      <div className="flex-1 px-4 py-6">
        {/* Main Navigation Section */}
        <div className="mb-8">
          {mainNav.map((link) => {
            const active = isActive(link.href)
            return (
              <NavLink
                key={link.href}
                href={link.href}
                label={link.label}
                icon={link.icon}
                active={active}
              />
            )
          })}
        </div>

        {/* Integration Section */}
        <div className="mb-4">
          <h3 className="px-3 py- text-xs font-semibold text-gray-500 dark:text-gray-600 uppercase tracking-wider mb-3">
            Integrations
          </h3>
          <div className="space-y- pl-7">
            {integrations.map((link) => {
              const active = isActive(link.href)
              return (
                <NavLink
                  key={link.href}
                  href={link.href}
                  label={link.label}
                  icon={link.icon}
                  active={active}
                  size="small"
                />
              )
            })}
          </div>
        </div>

        {/* Automation & API Keys Section */}
        <div className="mb-8 space-y-2">
          <NavLink
            href="/home/automation"
            label="Automation Center"
            icon={BiCodeBlock}
            active={isActive("/home/automation")}
          />
          <NavLink
            href="/home/api-keys"
            label="API Keys"
            icon={BiKey}
            active={isActive("/home/api-keys")}
          />
        </div>
      </div>

   
    </div>
  )

  return (
    <>
      {/* Mobile Toggle Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed top-20 left-4 z-40 lg:hidden p-2 rounded-lg bg-pink-100 dark:bg-gray-950 border border-gray-200 dark:border-gray-800 shadow-lg"
        aria-label="Open sidebar"
      >
        <MdMenu className="h-6 w-6 text-gray-700 dark:text-gray-300" />
      </button>

      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Desktop Sidebar */}
      <aside className="hidden lg:block fixed left-0 top-0 h-screen w-64 bg-pink-50 dark:bg-black border-r border-gray-200 dark:border-gray-800 shadow-xl z-30 font-outfit">
        <div className="h-20 mt-8 mb-3 flex items-center justify-center dark:border-gray-800 bg-linear-to-r  dark:bg-black ">
          <Image src={"/logo.png"} alt="Nova Bot Logo" width={120} height={100} />
        </div>
        {renderSidebarContent()}
      </aside>

      {/* Mobile Sliding Sidebar */}
      <aside
        className={`fixed left-0 top-0 h-screen w-72 bg-white dark:bg-gray-950 border-r border-gray-200 dark:border-gray-800 shadow-2xl z-50 lg:hidden transform transition-transform duration-300 ease-in-out font-outfit ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="h-20 flex items-center justify-between px-4 border-b border-gray-200 dark:border-gray-800 bg-linear-to-r from-pink-50 to-blue-50 dark:from-gray-900 dark:to-gray-900">
          <h2 className="text-xl font-bold bg-linear-to-r from-pink-600 to-blue-600 bg-clip-text text-transparent">
            Nova Bot
          </h2>
          <button
            onClick={() => setIsOpen(false)}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
            aria-label="Close sidebar"
          >
            <MdClose className="h-6 w-6 text-gray-700 dark:text-gray-300" />
          </button>
        </div>
        {renderSidebarContent()}
      </aside>
    </>
  )
}

export default Sidebar
