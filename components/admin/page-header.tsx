"use client"

import { Button } from "@/components/ui/button"
import { Save } from "lucide-react"
import { ReactNode } from "react"

interface PageHeaderProps {
  title: string
  description?: string
  onSave?: () => void
  isSaving?: boolean
  actions?: ReactNode
}

export function PageHeader({ title, description, onSave, isSaving, actions }: PageHeaderProps) {
  return (
    <div className="sticky top-0 z-10 bg-white dark:bg-gray-950 border-b border-gray-200 dark:border-gray-800 px-6 py-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{title}</h1>
          {description && (
            <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">{description}</p>
          )}
        </div>
        <div className="flex items-center gap-2">
          {actions}
          {onSave && (
            <Button
              onClick={onSave}
              disabled={isSaving}
              className="flex items-center gap-2 bg-gray-900 hover:bg-gray-800 dark:bg-white dark:text-gray-900 dark:hover:bg-gray-100"
            >
              <Save className="h-4 w-4" />
              {isSaving ? "Saving..." : "Save Changes"}
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
