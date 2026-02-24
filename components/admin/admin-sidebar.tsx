"use client"

import Link from "next/link"
import Image from "next/image"
import { usePathname, useRouter } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { LayoutDashboard, Package, FolderTree, Mail, LogOut, Beaker, Briefcase, FileText, Settings, Image as ImageIcon, Users, MessageSquare } from "lucide-react"
import { ThemeToggle } from "./theme-toggle"
import { useEffect, useState } from "react"

const navigation = [
  { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { name: "Products", href: "/admin/products", icon: Package },
  { name: "Categories", href: "/admin/categories", icon: FolderTree },
  { name: "Services", href: "/admin/services", icon: Briefcase },
  { name: "Gallery", href: "/admin/gallery", icon: ImageIcon },
  { name: "Clients", href: "/admin/clients", icon: Users },
  { name: "Testimonials", href: "/admin/testimonials", icon: MessageSquare },
  { name: "Enquiries", href: "/admin/enquiries", icon: Mail },
  { name: "Content", href: "/admin/content", icon: FileText },
  { name: "Settings", href: "/admin/settings", icon: Settings },
]

export function AdminSidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const [logo, setLogo] = useState<string | null>(null)

  useEffect(() => {
    fetch("/api/admin/settings")
      .then(res => res.json())
      .then(data => {
        if (data?.branding?.dashboardLogo) {
          setLogo(data.branding.dashboardLogo)
        }
      })
      .catch(() => {})
  }, [])

  const handleLogout = async () => {
    await fetch("/api/admin/logout", { method: "POST" })
    router.push("/admin/login")
    router.refresh()
  }

  return (
    <div className="flex h-full w-64 flex-col bg-white border-r border-gray-200 text-gray-900 dark:bg-gray-950 dark:border-gray-800 dark:text-white">
      <div className="flex h-16 items-center justify-center border-b border-gray-200 dark:border-gray-800 px-6">
        {logo ? (
          <Image src={logo} alt="Logo" width={150} height={40} className="object-contain max-h-10" />
        ) : (
          <Beaker className="h-7 w-7 text-blue-600 dark:text-blue-400" />
        )}
      </div>

      <nav className="flex-1 space-y-1 px-3 py-4">
        {navigation.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                isActive 
                  ? "bg-blue-50 text-blue-700 dark:bg-gray-800 dark:text-white" 
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-white",
              )}
            >
              <item.icon className="h-5 w-5" />
              {item.name}
            </Link>
          )
        })}
      </nav>

      <div className="border-t border-gray-200 dark:border-gray-800 p-4 space-y-2">
        <ThemeToggle />
        <Button
          variant="ghost"
          className="w-full justify-start text-gray-600 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-white"
          onClick={handleLogout}
        >
          <LogOut className="mr-3 h-5 w-5" />
          Logout
        </Button>
      </div>
    </div>
  )
}
