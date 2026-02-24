"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { Plus, Search, Image as ImageIcon } from "lucide-react"
import type { GalleryItem } from "@/types"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { useToastContext } from "@/components/providers/toast-provider"
import { AccordionItem } from "@/components/admin/accordion-item"
import { MediaUpload } from "@/components/admin/media-upload"
import { PageHeroSettings } from "@/components/admin/page-hero-settings"

export default function AdminGalleryPage() {
  const { success, error } = useToastContext()
  const [items, setItems] = useState<GalleryItem[]>([])
  const [search, setSearch] = useState("")
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<GalleryItem | null>(null)
  const [formData, setFormData] = useState({ 
    name: "", 
    image: "",
    category: "",
    order: 0
  })

  useEffect(() => {
    fetchItems()
  }, [])

  const fetchItems = async () => {
    try {
      const response = await fetch("/api/admin/gallery")
      const data = await response.json()
      setItems(data)
    } catch (err) {
      error("Failed to fetch gallery items")
    } finally {
      setLoading(false)
    }
  }

  const handleSaveItem = async () => {
    if (!formData.name || !formData.image) {
      error("Please fill in all required fields")
      return
    }

    setSaving(true)
    try {
      const method = editingItem ? "PUT" : "POST"
      const url = editingItem ? `/api/admin/gallery/${editingItem.id}` : "/api/admin/gallery"
      
      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      if (!response.ok) throw new Error("Failed to save gallery item")

      success(editingItem ? "Gallery item updated successfully" : "Gallery item created successfully")
      setDialogOpen(false)
      fetchItems()
    } catch (err) {
      error("Failed to save gallery item")
    } finally {
      setSaving(false)
    }
  }

  const handleDeleteItem = async (itemId: string) => {
    if (!confirm("Are you sure you want to delete this gallery item?")) return

    try {
      const response = await fetch(`/api/admin/gallery/${itemId}`, { method: "DELETE" })
      if (!response.ok) throw new Error("Failed to delete gallery item")
      success("Gallery item deleted successfully")
      fetchItems()
    } catch (err) {
      error("Failed to delete gallery item")
    }
  }

  const filteredItems = items.filter(item =>
    item.name.toLowerCase().includes(search.toLowerCase()) ||
    (item.category && item.category.toLowerCase().includes(search.toLowerCase()))
  )

  return (
    <div className="p-6">
      {/* Page Hero Settings */}
      <PageHeroSettings pageKey="gallery" pageTitle="Gallery" />

      <div className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Gallery</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">Manage product gallery images</p>
          </div>
          <Button onClick={() => { 
            setEditingItem(null); 
            setFormData({ name: "", image: "", category: "", order: 0 }); 
            setDialogOpen(true) 
          }}>
            <Plus className="h-4 w-4 mr-2" />Add Gallery Item
          </Button>
        </div>

        <div className="flex items-center gap-4">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input placeholder="Search gallery..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-10" />
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
            <ImageIcon className="h-4 w-4" />{filteredItems.length} items
          </div>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <div className="text-gray-500 dark:text-gray-400">Loading gallery...</div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredItems.length === 0 ? (
            <Card className="col-span-full p-12 text-center dark:bg-gray-800 dark:border-gray-700">
              <ImageIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No gallery items found</h3>
              <p className="text-gray-600 dark:text-gray-400">
                {search ? "Try adjusting your search criteria" : "Get started by adding your first gallery item"}
              </p>
            </Card>
          ) : (
            filteredItems.map((item) => (
              <Card key={item.id} className="overflow-hidden dark:bg-gray-800 dark:border-gray-700">
                <div className="aspect-square relative">
                  <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                </div>
                <div className="p-4">
                  <h3 className="font-medium text-gray-900 dark:text-white truncate">{item.name}</h3>
                  {item.category && (
                    <p className="text-sm text-gray-500 dark:text-gray-400">{item.category}</p>
                  )}
                  <div className="flex gap-2 mt-3">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => { 
                        setEditingItem(item); 
                        setFormData({ 
                          name: item.name, 
                          image: item.image,
                          category: item.category || "",
                          order: item.order || 0
                        }); 
                        setDialogOpen(true) 
                      }}
                    >
                      Edit
                    </Button>
                    <Button 
                      variant="destructive" 
                      size="sm" 
                      onClick={() => handleDeleteItem(item.id)}
                    >
                      Delete
                    </Button>
                  </div>
                </div>
              </Card>
            ))
          )}
        </div>
      )}

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{editingItem ? "Edit Gallery Item" : "Add Gallery Item"}</DialogTitle>
            <DialogDescription>
              {editingItem ? "Update gallery item details" : "Add a new image to the gallery"}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div>
              <Label htmlFor="name">Name*</Label>
              <Input 
                id="name" 
                value={formData.name} 
                onChange={(e) => setFormData({ ...formData, name: e.target.value })} 
                placeholder="Enter item name" 
              />
            </div>
            
            <div>
              <Label htmlFor="category">Category</Label>
              <Input 
                id="category" 
                value={formData.category} 
                onChange={(e) => setFormData({ ...formData, category: e.target.value })} 
                placeholder="Enter category (optional)" 
              />
            </div>

            <div>
              <Label htmlFor="order">Display Order</Label>
              <Input 
                id="order" 
                type="number"
                value={formData.order} 
                onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) || 0 })} 
                placeholder="0" 
              />
            </div>

            <div>
              <Label className="text-base font-medium mb-3 block">Image*</Label>
              <MediaUpload
                value={formData.image}
                onChange={(url) => setFormData({ ...formData, image: url })}
                accept="image"
                maxWidth={1200}
                maxHeight={800}
                maxSizeMB={5}
                placeholder="Upload gallery image"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleSaveItem} disabled={saving}>
              {saving ? "Saving..." : editingItem ? "Update" : "Create"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
