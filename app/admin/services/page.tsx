"use client"
import { PageHeader } from "@/components/admin/page-header"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { Plus, Search, Briefcase, Globe, Image, Star } from "lucide-react"
import type { Service } from "@/types"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useToastContext } from "@/components/providers/toast-provider"
import { AccordionItem } from "@/components/admin/accordion-item"
import { Checkbox } from "@/components/ui/checkbox"
import { MediaUpload } from "@/components/admin/media-upload"
import { PageHeroSettings } from "@/components/admin/page-hero-settings"

export default function AdminServicesPage() {
  const { success, error } = useToastContext()
  const [services, setServices] = useState<Service[]>([])
  const [search, setSearch] = useState("")
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingService, setEditingService] = useState<Service | null>(null)
  const [formData, setFormData] = useState({ 
    title: "", 
    description: "", 
    shortDescription: "",
    icon: "",
    image: "",
    featured: false 
  })

  useEffect(() => {
    fetchServices()
  }, [])

  const fetchServices = async () => {
    try {
      const response = await fetch("/api/admin/services")
      const data = await response.json(); // Map subtitle to shortDescription for frontend compatibility
      const servicesWithShortDescription = data.map((service: any) => ({
        ...service,
        shortDescription: service.subtitle || service.shortDescription || ""
      }))
      setServices(servicesWithShortDescription)
    } catch (err) {
      error("Failed to fetch services")
    } finally {
      setLoading(false)
    }
  }

  const handleSaveService = async () => {
    if (!formData.title || !formData.description || !formData.shortDescription) {
      error("Please fill in all required fields")
      return
    }
    const wordCount = formData.shortDescription.trim().split(/\s+/).filter(Boolean).length
    if (wordCount > 7) {
      error("Short description must be 7 words or less (used on service cards)")
      return
    }

    setSaving(true)
    try {
      const method = editingService ? "PUT" : "POST"
      const url = editingService ? `/api/admin/services/${editingService.id}` : "/api/admin/services"
      
      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      if (!response.ok) throw new Error("Failed to save service")

      success(editingService ? "Service updated successfully" : "Service created successfully")
      setDialogOpen(false)
      fetchServices()
    } catch (err) {
      error("Failed to save service")
    } finally {
      setSaving(false)
    }
  }

  const handleDeleteService = async (serviceId: string) => {
    if (!confirm("Are you sure you want to delete this service?")) return

    try {
      const response = await fetch(`/api/admin/services/${serviceId}`, { method: "DELETE" })
      if (!response.ok) throw new Error("Failed to delete service")
      success("Service deleted successfully")
      fetchServices()
    } catch (err) {
      error("Failed to delete service")
    }
  }

  const filteredServices = services.filter(service =>
    service.title.toLowerCase().includes(search.toLowerCase()) ||
    service.description.toLowerCase().includes(search.toLowerCase()) ||
    (service.shortDescription && service.shortDescription.toLowerCase().includes(search.toLowerCase()))
  )

  return (
    <div className="p-6">
      {/* Page Hero Settings */}
      <PageHeroSettings pageKey="services" pageTitle="Services" />

      <div className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Services</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">Manage company services and offerings</p>
          </div>
          <Button onClick={() => { 
            setEditingService(null); 
            setFormData({ title: "", description: "", shortDescription: "", icon: "", image: "", featured: false }); 
            setDialogOpen(true) 
          }}>
            <Plus className="h-4 w-4 mr-2" />Add Service
          </Button>
        </div>

        <div className="flex items-center gap-4">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input placeholder="Search services..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-10" />
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
            <Briefcase className="h-4 w-4" />{filteredServices.length} services
          </div>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <div className="text-gray-500 dark:text-gray-400">Loading services...</div>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredServices.length === 0 ? (
            <Card className="p-12 text-center dark:bg-gray-800 dark:border-gray-700">
              <Briefcase className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No services found</h3>
              <p className="text-gray-600 dark:text-gray-400">
                {search ? "Try adjusting your search criteria" : "Get started by adding your first service"}
              </p>
            </Card>
          ) : (
            filteredServices.map((service) => (
              <AccordionItem
                key={service.id}
                id={service.id}
                title={service.title}
                status={service.featured ? {
                  label: "Featured",
                  variant: "success"
                } : undefined}
                summary={
                  <div className="flex items-center gap-4">
                    {/* Service Icon & Image Preview */}
                    <div className="flex items-center gap-2">
                      {service.icon && (
                        <div className="w-8 h-8 rounded bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
                          <img src={service.icon} alt="Icon" className="w-5 h-5 object-contain" />
                        </div>
                      )}
                      {service.image && (
                        <div className="w-8 h-8 rounded overflow-hidden">
                          <img src={service.image} alt="Preview" className="w-full h-full object-cover" />
                        </div>
                      )}
                    </div>
                    <span className="text-gray-600 dark:text-gray-400">{service.shortDescription || service.description?.substring(0, 80) + "..."}</span>
                    {service.featured && (
                      <>
                        <span>•</span>
                        <span className="flex items-center gap-1 text-green-600 dark:text-green-400">
                          <Globe className="h-3 w-3" />
                          Featured
                        </span>
                      </>
                    )}
                  </div>
                }
                details={
                  <div className="space-y-4">
                    {/* Media Preview Section */}
                    {(service.icon || service.image) && (
                      <div>
                        <h4 className="font-medium text-gray-900 dark:text-white mb-3">Media</h4>
                        <div className="flex items-center gap-4">
                          {service.icon && (
                            <div className="text-center">
                              <div className="w-16 h-16 rounded-lg bg-gray-100 dark:bg-gray-700 flex items-center justify-center mb-2">
                                <img src={service.icon} alt="Service Icon" className="w-10 h-10 object-contain" />
                              </div>
                              <span className="text-xs text-gray-500">Icon</span>
                            </div>
                          )}
                          {service.image && (
                            <div className="text-center">
                              <div className="w-16 h-16 rounded-lg overflow-hidden mb-2">
                                <img src={service.image} alt="Service Image" className="w-full h-full object-cover" />
                              </div>
                              <span className="text-xs text-gray-500">Image</span>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                    
                    {service.shortDescription && (
                      <div>
                        <h4 className="font-medium text-gray-900 dark:text-white mb-2">Short Description</h4>
                        <p className="text-gray-700 dark:text-gray-300">{service.shortDescription}</p>
                      </div>
                    )}
                    <div>
                      <h4 className="font-medium text-gray-900 dark:text-white mb-2">Full Description</h4>
                      <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">{service.description}</p>
                    </div>
                    <div className="flex items-center justify-between pt-2 border-t border-gray-200 dark:border-gray-700">
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        Created: {new Date(service.createdAt).toLocaleDateString()}
                        {service.updatedAt && service.updatedAt !== service.createdAt && (
                          <span className="ml-4">Updated: {new Date(service.updatedAt).toLocaleDateString()}</span>
                        )}
                      </div>
                      {service.featured && (
                        <div className="flex items-center gap-1 text-green-600 dark:text-green-400">
                          <Globe className="h-4 w-4" />
                          <span className="text-sm">Featured Service</span>
                        </div>
                      )}
                    </div>
                  </div>
                }
                onEdit={() => { 
                  setEditingService(service); 
                  setFormData({ 
                    title: service.title, 
                    description: service.description, 
                    shortDescription: service.shortDescription || "",
                    icon: service.icon || "",
                    image: service.image || "",
                    featured: service.featured || false
                  }); 
                  setDialogOpen(true) 
                }}
                onDelete={() => handleDeleteService(service.id)}
              />
            ))
          )}
        </div>
      )}

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingService ? "Edit Service" : "Create New Service"}</DialogTitle>
            <DialogDescription>
              {editingService ? "Update service information" : "Add a new company service"}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-6 py-4">
            {/* Basic Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="title">Service Title*</Label>
                <Input 
                  id="title" 
                  value={formData.title} 
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })} 
                  placeholder="Enter service title" 
                />
              </div>
              <div className="flex items-center space-x-2 pt-6">
                <Checkbox
                  id="featured"
                  checked={formData.featured}
                  onCheckedChange={(checked) => setFormData({ ...formData, featured: checked as boolean })}
                />
                <Label htmlFor="featured">Featured Service</Label>
              </div>
            </div>

            {/* Media Upload Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label className="text-base font-medium mb-3 block">Service Icon</Label>
                <MediaUpload
                  value={formData.icon}
                  onChange={(url) => setFormData({ ...formData, icon: url })}
                  accept="image"
                  maxWidth={256}
                  maxHeight={256}
                  maxSizeMB={2}
                  aspectRatio="1:1"
                  uploadType="icon"
                  placeholder="Upload service icon"
                />
                <p className="text-xs text-gray-500 mt-2">
                  Square icon for service display. Recommended: 64x64px or 128x128px
                </p>
              </div>

              <div>
                <Label className="text-base font-medium mb-3 block">Service Image</Label>
                <MediaUpload
                  value={formData.image}
                  onChange={(url) => setFormData({ ...formData, image: url })}
                  accept="image"
                  maxWidth={1200}
                  maxHeight={800}
                  maxSizeMB={5}
                  aspectRatio="3:2"
                  uploadType="image"
                  placeholder="Upload service image"
                />
                <p className="text-xs text-gray-500 mt-2">
                  Main service image for detailed view. Recommended: 800x533px
                </p>
              </div>
            </div>

            {/* Descriptions */}
            <div>
              <Label htmlFor="shortDescription">Short Description* (max 7 words)</Label>
              <Textarea 
                id="shortDescription" 
                value={formData.shortDescription} 
                onChange={(e) => setFormData({ ...formData, shortDescription: e.target.value })} 
                placeholder="e.g. Industrial boiler installation and maintenance" 
                rows={2} 
              />
              <p className="text-xs text-gray-500 mt-1">
                Shown on service cards. Max 7 words.
              </p>
            </div>
            
            <div>
              <Label htmlFor="description">Full Description*</Label>
              <Textarea 
                id="description" 
                value={formData.description} 
                onChange={(e) => setFormData({ ...formData, description: e.target.value })} 
                placeholder="Enter detailed service description" 
                rows={5} 
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleSaveService} disabled={saving}>
              {saving ? "Saving..." : editingService ? "Update Service" : "Create Service"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
