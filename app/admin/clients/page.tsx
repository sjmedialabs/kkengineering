"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { Plus, Search, Users } from "lucide-react"
import type { Client } from "@/types"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { useToastContext } from "@/components/providers/toast-provider"
import { MediaUpload } from "@/components/admin/media-upload"
import { PageHeroSettings } from "@/components/admin/page-hero-settings"

export default function AdminClientsPage() {
  const { success, error } = useToastContext()
  const [clients, setClients] = useState<Client[]>([])
  const [search, setSearch] = useState("")
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingClient, setEditingClient] = useState<Client | null>(null)
  const [formData, setFormData] = useState({ 
    name: "", 
    logo: "",
    website: "",
    order: 0
  })

  useEffect(() => {
    fetchClients()
  }, [])

  const fetchClients = async () => {
    try {
      const response = await fetch("/api/admin/clients")
      const data = await response.json()
      setClients(data)
    } catch (err) {
      error("Failed to fetch clients")
    } finally {
      setLoading(false)
    }
  }

  const handleSaveClient = async () => {
    if (!formData.name || !formData.logo) {
      error("Please fill in all required fields")
      return
    }

    setSaving(true)
    try {
      const method = editingClient ? "PUT" : "POST"
      const url = editingClient ? `/api/admin/clients/${editingClient.id}` : "/api/admin/clients"
      
      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      if (!response.ok) throw new Error("Failed to save client")

      success(editingClient ? "Client updated successfully" : "Client created successfully")
      setDialogOpen(false)
      fetchClients()
    } catch (err) {
      error("Failed to save client")
    } finally {
      setSaving(false)
    }
  }

  const handleDeleteClient = async (clientId: string) => {
    if (!confirm("Are you sure you want to delete this client?")) return

    try {
      const response = await fetch(`/api/admin/clients/${clientId}`, { method: "DELETE" })
      if (!response.ok) throw new Error("Failed to delete client")
      success("Client deleted successfully")
      fetchClients()
    } catch (err) {
      error("Failed to delete client")
    }
  }

  const filteredClients = clients.filter(client =>
    client.name.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="p-6">
      {/* Page Hero Settings */}
      <PageHeroSettings pageKey="clients" pageTitle="Clients" />

      <div className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Clients</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">Manage client logos and partnerships</p>
          </div>
          <Button onClick={() => { 
            setEditingClient(null); 
            setFormData({ name: "", logo: "", website: "", order: 0 }); 
            setDialogOpen(true) 
          }}>
            <Plus className="h-4 w-4 mr-2" />Add Client
          </Button>
        </div>

        <div className="flex items-center gap-4">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input placeholder="Search clients..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-10" />
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
            <Users className="h-4 w-4" />{filteredClients.length} clients
          </div>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <div className="text-gray-500 dark:text-gray-400">Loading clients...</div>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {filteredClients.length === 0 ? (
            <Card className="col-span-full p-12 text-center dark:bg-gray-800 dark:border-gray-700">
              <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No clients found</h3>
              <p className="text-gray-600 dark:text-gray-400">
                {search ? "Try adjusting your search criteria" : "Get started by adding your first client"}
              </p>
            </Card>
          ) : (
            filteredClients.map((client) => (
              <Card key={client.id} className="p-4 dark:bg-gray-800 dark:border-gray-700">
                <div className="aspect-[3/2] relative bg-gray-50 dark:bg-gray-700 rounded-lg flex items-center justify-center mb-3">
                  <img src={client.logo} alt={client.name} className="max-w-full max-h-full object-contain p-2" />
                </div>
                <h3 className="font-medium text-gray-900 dark:text-white truncate text-center text-sm">{client.name}</h3>
                <div className="flex gap-2 mt-3 justify-center">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => { 
                      setEditingClient(client); 
                      setFormData({ 
                        name: client.name, 
                        logo: client.logo,
                        website: client.website || "",
                        order: client.order || 0
                      }); 
                      setDialogOpen(true) 
                    }}
                  >
                    Edit
                  </Button>
                  <Button 
                    variant="destructive" 
                    size="sm" 
                    onClick={() => handleDeleteClient(client.id)}
                  >
                    Delete
                  </Button>
                </div>
              </Card>
            ))
          )}
        </div>
      )}

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{editingClient ? "Edit Client" : "Add Client"}</DialogTitle>
            <DialogDescription>
              {editingClient ? "Update client details" : "Add a new client logo"}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div>
              <Label htmlFor="name">Client Name*</Label>
              <Input 
                id="name" 
                value={formData.name} 
                onChange={(e) => setFormData({ ...formData, name: e.target.value })} 
                placeholder="Enter client name" 
              />
            </div>
            
            <div>
              <Label htmlFor="website">Website URL</Label>
              <Input 
                id="website" 
                value={formData.website} 
                onChange={(e) => setFormData({ ...formData, website: e.target.value })} 
                placeholder="https://example.com (optional)" 
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
              <Label className="text-base font-medium mb-3 block">Client Logo*</Label>
              <MediaUpload
                value={formData.logo}
                onChange={(url) => setFormData({ ...formData, logo: url })}
                accept="image"
                maxWidth={400}
                maxHeight={200}
                maxSizeMB={2}
                placeholder="Upload client logo"
              />
              <p className="text-xs text-gray-500 mt-2">
                Recommended: PNG with transparent background, max 400x200px
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleSaveClient} disabled={saving}>
              {saving ? "Saving..." : editingClient ? "Update" : "Create"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
