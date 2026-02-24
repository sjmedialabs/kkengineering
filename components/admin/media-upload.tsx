"use client"

import { useState, useRef } from "react"
import { Upload, X, Link, Image as ImageIcon, Play, AlertCircle, CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Progress } from "@/components/ui/progress"
import { cn } from "@/lib/utils"

interface MediaUploadProps {
  value: string
  onChange: (url: string) => void
  accept?: "image" | "video" | "both"
  maxWidth?: number
  maxHeight?: number
  maxSizeMB?: number
  aspectRatio?: string // e.g., "16:9", "4:3", "1:1"
  placeholder?: string
  uploadType?: "icon" | "image"
}

export function MediaUpload({
  value,
  onChange,
  accept = "both",
  maxWidth = 1920,
  maxHeight = 1080,
  maxSizeMB = 10,
  aspectRatio,
  placeholder = "Upload media or enter URL",
  uploadType = "image"
}: MediaUploadProps) {
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [inputMode, setInputMode] = useState<"upload" | "url">("upload")
  const [urlInput, setUrlInput] = useState("")
  const fileInputRef = useRef<HTMLInputElement>(null)

  const getAcceptString = () => {
    if (accept === "image") {
      // Allow .ico for favicons when uploadType is icon
      return uploadType === "icon" ? "image/*,.ico" : "image/*"
    }
    if (accept === "video") return "video/*"
    return "image/*,video/*"
  }

  const getAllowedTypes = () => {
    const imageTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"]
    if (accept === "image") {
      if (uploadType === "icon") {
        return [...imageTypes, "image/x-icon", "image/vnd.microsoft.icon"]
      }
      return imageTypes
    }
    if (accept === "video") return ["video/mp4", "video/webm", "video/ogg"]
    return ["image/jpeg", "image/png", "image/webp", "image/gif", "video/mp4", "video/webm"]
  }

  const validateFile = (file: File): string | null => {
    const allowedTypes = getAllowedTypes()
    const isIcoByName = uploadType === "icon" && /\.ico$/i.test(file.name)
    const typeOk = allowedTypes.includes(file.type) || isIcoByName

    // Check file type
    if (!typeOk) {
      const accepted = uploadType === "icon" ? "PNG, ICO, JPEG, WebP, GIF" : allowedTypes.map(type => type.split('/')[1].toUpperCase()).join(', ')
      return `File type not allowed. Accepted: ${accepted}`
    }

    // Check file size
    if (file.size > maxSizeMB * 1024 * 1024) {
      return `File size must be less than ${maxSizeMB}MB`
    }

    return null
  }

  const handleFileUpload = async (file: File) => {
    setError("")
    setIsLoading(true)
    setUploadProgress(0)

    // Validate file
    const fileError = validateFile(file)
    if (fileError) {
      setError(fileError)
      setIsLoading(false)
      return
    }

    // Simulate upload progress
    const progressInterval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 90) {
          clearInterval(progressInterval)
          return prev
        }
        return prev + 10
      })
    }, 100)

    try {
      const formData = new FormData()
      formData.append("file", file)
      formData.append("type", uploadType)

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      })

      const result = await response.json()

      if (response.ok) {
        setUploadProgress(100)
        setTimeout(() => {
          onChange(result.url)
          setError("")
          setIsLoading(false)
          setUploadProgress(0)
          clearInterval(progressInterval)
        }, 200)
      } else {
        setError(result.error || "Upload failed")
        setIsLoading(false)
        setUploadProgress(0)
        clearInterval(progressInterval)
      }
    } catch (err) {
      setError("Upload failed. Please try again.")
      setIsLoading(false)
      setUploadProgress(0)
      clearInterval(progressInterval)
    }
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files && files.length > 0) {
      handleFileUpload(files[0])
    }
  }

  const handleUrlSubmit = () => {
    if (urlInput.trim()) {
      onChange(urlInput.trim())
      setUrlInput("")
      setError("")
    }
  }

  const openFileDialog = () => {
    fileInputRef.current?.click()
  }

  const handleRemove = () => {
    onChange("")
    setError("")
    setUrlInput("")
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const isVideo = (url: string) => {
    const videoExtensions = ['.mp4', '.webm', '.ogg', '.mov', '.avi']
    return videoExtensions.some(ext => url.toLowerCase().includes(ext)) || 
           url.includes('youtube.com') || url.includes('vimeo.com')
  }

  const getFileTypeDisplay = () => {
    const allowedTypes = getAllowedTypes()
    return allowedTypes.map(type => type.split('/')[1].toUpperCase()).join(', ')
  }

  const hasFile = Boolean(value)
  const isImage = hasFile && !isVideo(value)

  return (
    <div className="space-y-3">
      {/* Current File Display */}
      {hasFile && (
        <div className="space-y-2">
          <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg border">
            {/* Small Thumbnail */}
            <div className="flex-shrink-0">
              {isImage ? (
                <div className="w-12 h-12 rounded overflow-hidden bg-gray-100 dark:bg-gray-700">
                  <img
                    src={value}
                    alt="Preview"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = "/placeholder.jpg"
                    }}
                  />
                </div>
              ) : (
                <div className="w-12 h-12 rounded bg-blue-100 dark:bg-blue-900/20 flex items-center justify-center">
                  <Play className="h-6 w-6 text-blue-600" />
                </div>
              )}
            </div>
            
            {/* File Info */}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                {value.split('/').pop() || 'Media file'}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {isImage ? 'Image' : 'Video'} • Ready
              </p>
            </div>
            
            {/* Replace / Remove Buttons */}
            <div className="flex items-center gap-1">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={openFileDialog}
                disabled={isLoading}
                className="h-8"
              >
                <Upload className="h-4 w-4 mr-1" />
                Replace
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={handleRemove}
                className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
          {isLoading && <Progress value={uploadProgress} className="h-1" />}
        </div>
      )}

      {/* Upload/URL Toggle */}
      {!hasFile && (
        <>
          <div className="flex rounded-lg border overflow-hidden bg-gray-100 dark:bg-gray-800">
            <button
              type="button"
              onClick={() => setInputMode("upload")}
              className={cn(
                "flex-1 px-4 py-2 text-sm font-medium transition-colors",
                inputMode === "upload"
                  ? "bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 shadow-sm"
                  : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
              )}
            >
              <Upload className="h-4 w-4 inline mr-2" />
              Upload
            </button>
            <button
              type="button"
              onClick={() => setInputMode("url")}
              className={cn(
                "flex-1 px-4 py-2 text-sm font-medium transition-colors",
                inputMode === "url"
                  ? "bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 shadow-sm"
                  : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
              )}
            >
              <Link className="h-4 w-4 inline mr-2" />
              URL
            </button>
          </div>

          {/* Upload Mode */}
          {inputMode === "upload" && (
            <div className="space-y-3">
              <Button
                type="button"
                variant="outline"
                onClick={openFileDialog}
                disabled={isLoading}
                className="w-full h-10 border-dashed border-2"
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <Upload className="h-4 w-4 animate-pulse" />
                    <span>Uploading...</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <Upload className="h-4 w-4" />
                    <span>Choose File</span>
                  </div>
                )}
              </Button>

              {/* Progress Bar */}
              {isLoading && (
                <Progress value={uploadProgress} className="h-1" />
              )}

              {/* File Restrictions */}
              <div className="text-xs text-gray-500 dark:text-gray-400 flex flex-wrap gap-x-4 gap-y-1">
                <span>{getFileTypeDisplay()}</span>
                <span>Max {maxSizeMB}MB</span>
                {maxWidth && maxHeight && <span>{maxWidth}×{maxHeight}px</span>}
                {aspectRatio && <span>{aspectRatio}</span>}
              </div>
            </div>
          )}

          {/* URL Mode */}
          {inputMode === "url" && (
            <div className="flex gap-2">
              <Input
                type="url"
                placeholder="Enter image or video URL"
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleUrlSubmit()}
                className="flex-1"
              />
              <Button
                type="button"
                onClick={handleUrlSubmit}
                disabled={!urlInput.trim()}
                size="sm"
              >
                Add
              </Button>
            </div>
          )}
        </>
      )}

      {/* Error Message */}
      {error && (
        <div className="p-2 bg-red-50 dark:bg-red-900/20 rounded border border-red-200 dark:border-red-800">
          <p className="text-xs text-red-600 dark:text-red-400 flex items-center gap-1">
            <AlertCircle className="h-3 w-3" />
            {error}
          </p>
        </div>
      )}

      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept={getAcceptString()}
        onChange={handleFileSelect}
        className="hidden"
      />
    </div>
  )
}
