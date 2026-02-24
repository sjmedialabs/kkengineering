import type React from "react"
import type { Metadata } from "next"
import { AdminSidebar } from "@/components/admin/admin-sidebar"
import { ToastProvider } from "@/components/providers/toast-provider"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "sonner"
import { connectDB } from "@/lib/db/mongodb"
import { SettingsModel } from "@/lib/db/models/Settings"

async function getSettings() {
  try {
    await connectDB()
    const settings = await SettingsModel.findOne()
    return settings
  } catch (error) {
    return null
  }
}

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSettings()
  const favicon = settings?.branding?.dashboardFavicon || "/favicon.ico"
  
  return {
    title: "Admin Dashboard",
    icons: {
      icon: favicon,
      shortcut: favicon,
    },
  }
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="light"
      enableSystem={false}
      disableTransitionOnChange={false}
    >
      <ToastProvider>
        <div className="flex h-screen overflow-hidden">
          <AdminSidebar />
          <main className="flex-1 overflow-y-auto bg-gray-50 dark:bg-gray-900">
            {children}
          </main>
        </div>
        <Toaster position="top-right" richColors />
      </ToastProvider>
    </ThemeProvider>
  )
}
