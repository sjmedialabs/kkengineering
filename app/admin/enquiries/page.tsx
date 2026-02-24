"use client"
import { PageHeader } from "@/components/admin/page-header"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import type { Enquiry } from "@/types"
import { Mail, Phone, Calendar, Search, Filter, MessageSquare, User, Trash2 } from "lucide-react"
import { AccordionItem } from "@/components/admin/accordion-item"
import { useToastContext } from "@/components/providers/toast-provider"
import { Checkbox } from "@/components/ui/checkbox"

export default function AdminEnquiriesPage() {
  const { success, error } = useToastContext()
  const [enquiries, setEnquiries] = useState<Enquiry[]>([])
  const [loading, setLoading] = useState(true)
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [typeFilter, setTypeFilter] = useState<string>("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedEnquiries, setSelectedEnquiries] = useState<Set<string>>(new Set())
  const [isDeleting, setIsDeleting] = useState(false)

  useEffect(() => {
    fetchEnquiries()
  }, [])

  const fetchEnquiries = async () => {
    try {
      const response = await fetch("/api/admin/enquiries")
      const data = await response.json()
      setEnquiries(data)
    } catch (error) {
      console.error("Failed to fetch enquiries:", error)
    } finally {
      setLoading(false)
    }
  }

  const updateEnquiryStatus = async (id: string, status: string) => {
    try {
      const response = await fetch(`/api/admin/enquiries/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status }),
      })

      if (!response.ok) throw new Error("Failed to update enquiry")

      success("Enquiry status updated successfully")
      fetchEnquiries()
    } catch (err) {
      error("Failed to update enquiry status")
    }
  }

  const deleteEnquiry = async (id: string) => {
    if (!confirm("Are you sure you want to delete this enquiry?")) return

    try {
      const response = await fetch(`/api/admin/enquiries/${id}`, {
        method: "DELETE",
      })

      if (!response.ok) throw new Error("Failed to delete enquiry")

      success("Enquiry deleted successfully")
      fetchEnquiries()
    } catch (err) {
      error("Failed to delete enquiry")
    }
  }

  const handleBulkDelete = async () => {
    if (selectedEnquiries.size === 0) {
      error("Please select at least one enquiry to delete")
      return
    }

    if (!confirm(`Are you sure you want to delete ${selectedEnquiries.size} enquir${selectedEnquiries.size !== 1 ? 'ies' : 'y'}?`)) {
      return
    }

    setIsDeleting(true)
    try {
      const response = await fetch("/api/admin/enquiries/bulk-delete", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ enquiryIds: Array.from(selectedEnquiries) }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || "Failed to delete enquiries")
      }

      const result = await response.json()
      success(result.message)
      setSelectedEnquiries(new Set())
      fetchEnquiries()
    } catch (err: any) {
      error(err.message || "Failed to delete enquiries")
    } finally {
      setIsDeleting(false)
    }
  }

  const toggleEnquirySelection = (id: string) => {
    const newSelection = new Set(selectedEnquiries)
    if (newSelection.has(id)) {
      newSelection.delete(id)
    } else {
      newSelection.add(id)
    }
    setSelectedEnquiries(newSelection)
  }

  const toggleSelectAll = () => {
    if (selectedEnquiries.size === filteredEnquiries.length) {
      setSelectedEnquiries(new Set())
    } else {
      setSelectedEnquiries(new Set(filteredEnquiries.map(e => e.id)))
    }
  }

  const getStatusVariant = (status: string) => {
    switch (status) {
      case "pending": return "warning"
      case "contacted": return "default"
      case "resolved": return "success"
      default: return "secondary"
    }
  }

  const filteredEnquiries = enquiries.filter((enquiry) => {
    const matchesStatus = statusFilter === "all" || enquiry.status === statusFilter
    const matchesType = typeFilter === "all" || enquiry.type === typeFilter
    const matchesSearch = 
      enquiry.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      enquiry.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (enquiry.company && enquiry.company.toLowerCase().includes(searchQuery.toLowerCase())) ||
      enquiry.message.toLowerCase().includes(searchQuery.toLowerCase())
    
    return matchesStatus && matchesType && matchesSearch
  })

  const enquiryTypes = [...new Set(enquiries.map(e => e.type).filter(Boolean))]
  const statusCounts = {
    all: enquiries.length,
    pending: enquiries.filter(e => e.status === "pending").length,
    contacted: enquiries.filter(e => e.status === "contacted").length,
    resolved: enquiries.filter(e => e.status === "resolved").length,
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Enquiries</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Manage customer enquiries and communications
            </p>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
            <MessageSquare className="h-4 w-4" />
            {filteredEnquiries.length} enquiries
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          <Card className="dark:bg-gray-800 dark:border-gray-700">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Total</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{statusCounts.all}</p>
                </div>
                <MessageSquare className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="dark:bg-gray-800 dark:border-gray-700">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Pending</p>
                  <p className="text-2xl font-bold text-orange-600">{statusCounts.pending}</p>
                </div>
                <Calendar className="h-8 w-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="dark:bg-gray-800 dark:border-gray-700">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Contacted</p>
                  <p className="text-2xl font-bold text-blue-600">{statusCounts.contacted}</p>
                </div>
                <Mail className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="dark:bg-gray-800 dark:border-gray-700">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Resolved</p>
                  <p className="text-2xl font-bold text-green-600">{statusCounts.resolved}</p>
                </div>
                <User className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters and Bulk Actions */}
        <div className="flex items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-4 flex-1">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search enquiries..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="contacted">Contacted</SelectItem>
                <SelectItem value="resolved">Resolved</SelectItem>
              </SelectContent>
            </Select>

            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                {enquiryTypes.map(type => (
                  <SelectItem key={type} value={type}>
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {selectedEnquiries.size > 0 && (
            <Button
              variant="destructive"
              size="sm"
              onClick={handleBulkDelete}
              disabled={isDeleting}
              className="flex items-center gap-2"
            >
              <Trash2 className="h-4 w-4" />
              Delete {selectedEnquiries.size} selected
            </Button>
          )}
        </div>

        {/* Select All */}
        {filteredEnquiries.length > 0 && (
          <div className="flex items-center gap-2 mb-3">
            <Checkbox
              id="select-all"
              checked={selectedEnquiries.size === filteredEnquiries.length}
              onCheckedChange={toggleSelectAll}
            />
            <label
              htmlFor="select-all"
              className="text-sm text-gray-600 dark:text-gray-400 cursor-pointer"
            >
              Select all ({filteredEnquiries.length})
            </label>
          </div>
        )}
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <div className="text-gray-500 dark:text-gray-400">Loading enquiries...</div>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredEnquiries.length === 0 ? (
            <Card className="p-12 text-center dark:bg-gray-800 dark:border-gray-700">
              <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No enquiries found</h3>
              <p className="text-gray-600 dark:text-gray-400">
                {searchQuery || statusFilter !== "all" || typeFilter !== "all" 
                  ? "Try adjusting your search criteria or filters" 
                  : "Customer enquiries will appear here"}
              </p>
            </Card>
          ) : (
            filteredEnquiries.map((enquiry) => (
              <div key={enquiry.id} className="flex items-start gap-3">
                <div className="pt-4">
                  <Checkbox
                    checked={selectedEnquiries.has(enquiry.id)}
                    onCheckedChange={() => toggleEnquirySelection(enquiry.id)}
                  />
                </div>
                <div className="flex-1">
                  <AccordionItem
                    id={enquiry.id}
                    title={enquiry.name}
                    subtitle={enquiry.email}
                    status={{
                      label: enquiry.status.charAt(0).toUpperCase() + enquiry.status.slice(1),
                      variant: getStatusVariant(enquiry.status) as any
                    }}
                    summary={
                      <div className="flex items-center gap-4 text-sm">
                        {enquiry.company && (
                          <>
                            <span className="text-gray-600 dark:text-gray-400">{enquiry.company}</span>
                            <span>•</span>
                          </>
                        )}
                        {enquiry.phone && (
                          <>
                            <span className="flex items-center gap-1">
                              <Phone className="h-3 w-3" />
                              {enquiry.phone}
                            </span>
                            <span>•</span>
                          </>
                        )}
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {new Date(enquiry.createdAt).toLocaleDateString()}
                        </span>
                        {enquiry.type && (
                          <>
                            <span>•</span>
                            <span className="capitalize">{enquiry.type}</span>
                          </>
                        )}
                      </div>
                    }
                    details={
                      <div className="space-y-4">
                        <div>
                          <h4 className="font-medium text-gray-900 dark:text-white mb-2">Message</h4>
                          <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                            {enquiry.message}
                          </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <h5 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">Contact Information</h5>
                            <div className="space-y-1 text-sm">
                              <div className="flex items-center gap-2">
                                <Mail className="h-4 w-4 text-gray-400" />
                                <span className="text-gray-900 dark:text-white">{enquiry.email}</span>
                              </div>
                              {enquiry.phone && (
                                <div className="flex items-center gap-2">
                                  <Phone className="h-4 w-4 text-gray-400" />
                                  <span className="text-gray-900 dark:text-white">{enquiry.phone}</span>
                                </div>
                              )}
                              {enquiry.company && (
                                <div className="flex items-center gap-2">
                                  <User className="h-4 w-4 text-gray-400" />
                                  <span className="text-gray-900 dark:text-white">{enquiry.company}</span>
                                </div>
                              )}
                            </div>
                          </div>

                          <div>
                            <h5 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">Details</h5>
                            <div className="space-y-1 text-sm">
                              <div className="flex justify-between">
                                <span className="text-gray-600 dark:text-gray-400">Type:</span>
                                <span className="text-gray-900 dark:text-white capitalize">
                                  {enquiry.type || "General"}
                                </span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-600 dark:text-gray-400">Received:</span>
                                <span className="text-gray-900 dark:text-white">
                                  {new Date(enquiry.createdAt).toLocaleDateString()} at{" "}
                                  {new Date(enquiry.createdAt).toLocaleTimeString()}
                                </span>
                              </div>
                              {enquiry.updatedAt && enquiry.updatedAt !== enquiry.createdAt && (
                                <div className="flex justify-between">
                                  <span className="text-gray-600 dark:text-gray-400">Updated:</span>
                                  <span className="text-gray-900 dark:text-white">
                                    {new Date(enquiry.updatedAt).toLocaleDateString()}
                                  </span>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
                          <div className="flex items-center gap-2">
                            <span className="text-sm text-gray-600 dark:text-gray-400">Status:</span>
                            <Select 
                              value={enquiry.status} 
                              onValueChange={(value) => updateEnquiryStatus(enquiry.id, value)}
                            >
                              <SelectTrigger className="w-32 h-8">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="pending">Pending</SelectItem>
                                <SelectItem value="contacted">Contacted</SelectItem>
                                <SelectItem value="resolved">Resolved</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>

                          <div className="flex items-center gap-2">
                            <Button
                              size="sm"
                              onClick={() => window.open(`mailto:${enquiry.email}`, '_blank')}
                              className="h-8"
                            >
                              <Mail className="h-3 w-3 mr-1" />
                              Reply
                            </Button>
                            {enquiry.phone && (
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => window.open(`tel:${enquiry.phone}`, '_blank')}
                                className="h-8"
                              >
                                <Phone className="h-3 w-3 mr-1" />
                                Call
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                    }
                    onDelete={() => deleteEnquiry(enquiry.id)}
                  />
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  )
}
