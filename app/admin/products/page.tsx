"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import {
  Plus,
  Search,
  Package,
  ChevronLeft,
  ChevronRight,
  Trash2,
} from "lucide-react";
import type { Product, Category } from "@/types";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { useToastContext } from "@/components/providers/toast-provider";
import { AccordionItem } from "@/components/admin/accordion-item";
import { Badge } from "@/components/ui/badge";
import { PageHeroSettings } from "@/components/admin/page-hero-settings";

export default function AdminProductsPage() {
  const { success, error } = useToastContext();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);

  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [selectedProducts, setSelectedProducts] = useState<Set<string>>(
    new Set(),
  );
  const [isDeleting, setIsDeleting] = useState(false);
  const [isBulkDeleteMode, setIsBulkDeleteMode] = useState(false);
  const [stats, setStats] = useState<{
    totalProducts: number;
    activeProducts: number;
    inactiveProducts: number;
    categoryStats: Array<{
      categoryId: string;
      categoryName: string;
      totalProducts: number;
      activeProducts: number;
      inactiveProducts: number;
    }>;
  } | null>(null);
  const [deletingCategory, setDeletingCategory] = useState<string | null>(null);

  const ITEMS_PER_PAGE = 10;

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    category: "",
    image: "",
    // Industrial equipment specifications
    productType: "",
    capacity: "",
    screenDimension: "",
    numberOfDecks: "",
    motorPower: "",
    gyratoryCircular: "",
    specialFeatures: "",
    availability: "In Stock",
  });

  useEffect(() => {
    fetchProducts();
    fetchCategories();

    fetchStats();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await fetch("/api/admin/products?limit=1000");
      const data = await response.json();
      setProducts(data.products || data);
      fetchStats();
    } catch (error) {
      console.error("Failed to fetch products:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await fetch("/api/admin/categories");
      const data = await response.json();
      setCategories(data);
    } catch (error) {
      console.error("Failed to fetch categories:", error);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await fetch("/api/admin/products/stats");
      const data = await response.json();
      setStats(data);
    } catch (error) {
      console.error("Failed to fetch stats:", error);
    }
  };

  const handleDeleteCategory = async (categoryName: string) => {
    if (
      !confirm(
        `Are you sure you want to delete ALL products in category "${categoryName}"? This action cannot be undone.`,
      )
    ) {
      return;
    }

    setDeletingCategory(categoryName);
    try {
      const response = await fetch("/api/admin/products/bulk-delete-category", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ categoryName }),
      });

      const data = await response.json();

      if (response.ok) {
        success(data.message);
        await fetchProducts();
        await fetchStats();
      } else {
        error(data.error || "Failed to delete products");
      }
    } catch (err) {
      error("Failed to delete products by category");
      console.error(err);
    } finally {
      setDeletingCategory(null);
    }
  };

  const handleCreateProduct = () => {
    setEditingProduct(null);
    setFormData({
      name: "",
      description: "",
      category: "",
      image: "",
      productType: "",
      capacity: "",
      screenDimension: "",
      numberOfDecks: "",
      motorPower: "",
      gyratoryCircular: "",
      specialFeatures: "",
      availability: "In Stock",
    });
    setDialogOpen(true);
  };

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      description: product.description || "",
      category: product.categoryId || product.category || "",
      image: product.image || "",
      productType: product.productType || "",
      capacity: product.capacity || "",
      screenDimension: product.screenDimension || "",
      numberOfDecks: product.numberOfDecks || "",
      motorPower: product.motorPower || "",
      gyratoryCircular: product.gyratoryCircular || "",
      specialFeatures: product.specialFeatures || "",
      availability: product.availability || "In Stock",
    });
    setDialogOpen(true);
  };

  const handleSaveProduct = async () => {
    if (!formData.name || !formData.category) {
      error("Please fill in all required fields");
      return;
    }

    // Find the category name from the selected category ID
    const selectedCategory = categories.find(cat => cat.id === formData.category);
    const categoryName = selectedCategory?.name || formData.category;

    setSaving(true);
    try {
      const method = editingProduct ? "PUT" : "POST";
      const url = editingProduct
        ? `/api/admin/products/${editingProduct.id}`
        : "/api/admin/products";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          description: formData.description || null,
          category: categoryName,
          categoryId: formData.category,
          image: formData.image || null,
          productType: formData.productType || null,
          capacity: formData.capacity || null,
          screenDimension: formData.screenDimension || null,
          numberOfDecks: formData.numberOfDecks || null,
          motorPower: formData.motorPower || null,
          gyratoryCircular: formData.gyratoryCircular || null,
          specialFeatures: formData.specialFeatures || null,
          availability: formData.availability || "In Stock",
        }),
      });

      if (!response.ok) throw new Error("Failed to save product");

      success(
        editingProduct
          ? "Product updated successfully"
          : "Product created successfully",
      );
      setDialogOpen(false);
      fetchProducts();
    } catch (err) {
      error("Failed to save product");
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteProduct = async (productId: string) => {
    if (!confirm("Are you sure you want to delete this product?")) return;

    try {
      const response = await fetch(`/api/admin/products/${productId}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Failed to delete product");

      success("Product deleted successfully");
      fetchProducts();
    } catch (err) {
      error("Failed to delete product");
    }
  };

  const handleBulkDelete = async () => {
    if (selectedProducts.size === 0) {
      error("Please select at least one product to delete");
      return;
    }

    if (
      !confirm(
        `Are you sure you want to delete ${selectedProducts.size} product${selectedProducts.size !== 1 ? "s" : ""}?`,
      )
    ) {
      return;
    }

    setIsDeleting(true);
    try {
      const response = await fetch("/api/admin/products/bulk-delete", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ productIds: Array.from(selectedProducts) }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to delete products");
      }

      const result = await response.json();
      success(result.message);
      setSelectedProducts(new Set());
      setIsBulkDeleteMode(false);
      fetchProducts();
    } catch (err: any) {
      error(err.message || "Failed to delete products");
    } finally {
      setIsDeleting(false);
    }
  };

  const toggleProductSelection = (id: string) => {
    const newSelection = new Set(selectedProducts);
    if (newSelection.has(id)) {
      newSelection.delete(id);
    } else {
      newSelection.add(id);
    }
    setSelectedProducts(newSelection);
  };

  const toggleSelectAll = () => {
    if (selectedProducts.size === paginatedProducts.length) {
      setSelectedProducts(new Set());
    } else {
      setSelectedProducts(new Set(paginatedProducts.map((p) => p.id)));
    }
  };

  const filteredProducts = products.filter(
    (product) =>
      product.name.toLowerCase().includes(search.toLowerCase()) ||
      (product.category && product.category.toLowerCase().includes(search.toLowerCase())),
  );

  const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedProducts = filteredProducts.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE,
  );

  const getCategoryName = (product: Product) => {
    if (product.categoryId) {
      return (
        categories.find((cat) => cat.id === product.categoryId)?.name ||
        "Unknown"
      );
    }
    return product.category || "Unknown";
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="p-6">
      {/* Page Hero Settings */}
      <PageHeroSettings pageKey="products" pageTitle="Products" />

      <div className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Products
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Manage pharmaceutical products and APIs
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              onClick={handleCreateProduct}
              className="flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              Add Product
            </Button>
          </div>
        </div>

        {/* Stats Dashboard */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <Card className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    Total Products
                  </p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                    {stats.totalProducts}
                  </p>
                </div>
                <Package className="h-8 w-8 text-blue-500" />
              </div>
            </Card>
            <Card className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    Active Products
                  </p>
                  <p className="text-2xl font-bold text-green-600 dark:text-green-400 mt-1">
                    {stats.activeProducts}
                  </p>
                </div>
                <Badge variant="default" className="bg-green-500">
                  In Stock
                </Badge>
              </div>
            </Card>
            <Card className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    Out of Stock
                  </p>
                  <p className="text-2xl font-bold text-red-600 dark:text-red-400 mt-1">
                    {stats.inactiveProducts}
                  </p>
                </div>
                <Badge variant="destructive">Out of Stock</Badge>
              </div>
            </Card>
          </div>
        )}

        {/* Category Stats - Show as compact cards in grid */}
        {stats && stats.categoryStats.length > 0 && (
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
              Products by Category
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {stats.categoryStats.map((categoryStat) => (
                <Card key={categoryStat.categoryId} className="p-3">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-900 dark:text-white truncate text-sm">
                        {categoryStat.categoryName}
                      </p>
                      <div className="flex gap-3 mt-1 text-xs">
                        <span className="text-gray-600 dark:text-gray-400">
                          <span className="font-semibold">
                            {categoryStat.totalProducts}
                          </span>{" "}
                          total
                        </span>
                        <span className="text-green-600 dark:text-green-400">
                          <span className="font-semibold">
                            {categoryStat.activeProducts}
                          </span>{" "}
                          active
                        </span>
                        <span className="text-red-600 dark:text-red-400">
                          <span className="font-semibold">
                            {categoryStat.inactiveProducts}
                          </span>{" "}
                          out
                        </span>
                      </div>
                    </div>
                    {categoryStat.totalProducts > 0 && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() =>
                          handleDeleteCategory(categoryStat.categoryName)
                        }
                        disabled={
                          deletingCategory === categoryStat.categoryName
                        }
                        className="h-7 w-7 p-0 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    )}
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}

        <div className="flex items-center justify-between gap-4 mb-4">
          <div className="flex items-center gap-4 flex-1">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search products..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setCurrentPage(1);
                }}
                className="pl-10"
              />
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
              <Package className="h-4 w-4" />
              {filteredProducts.length} products
            </div>
          </div>

          <div className="flex items-center gap-2">
            {!isBulkDeleteMode && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsBulkDeleteMode(true)}
                className="flex items-center gap-2"
              >
                <Trash2 className="h-4 w-4" />
                Bulk Delete
              </Button>
            )}

            {isBulkDeleteMode && (
              <>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setIsBulkDeleteMode(false);
                    setSelectedProducts(new Set());
                  }}
                >
                  Cancel
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={handleBulkDelete}
                  disabled={isDeleting || selectedProducts.size === 0}
                  className="flex items-center gap-2"
                >
                  <Trash2 className="h-4 w-4" />
                  Delete{" "}
                  {selectedProducts.size > 0 ? selectedProducts.size : ""}{" "}
                  selected
                </Button>
              </>
            )}
          </div>
        </div>

        {/* Select All - only show in bulk delete mode */}
        {isBulkDeleteMode && paginatedProducts.length > 0 && (
          <div className="flex items-center gap-2 mb-3">
            <Checkbox
              id="select-all-products"
              checked={
                selectedProducts.size === paginatedProducts.length &&
                paginatedProducts.length > 0
              }
              onCheckedChange={toggleSelectAll}
            />
            <label
              htmlFor="select-all-products"
              className="text-sm text-gray-600 dark:text-gray-400 cursor-pointer"
            >
              Select all on this page ({paginatedProducts.length})
            </label>
          </div>
        )}
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <div className="text-gray-500 dark:text-gray-400">
            Loading products...
          </div>
        </div>
      ) : (
        <>
          <div className="space-y-2 mb-6">
            {paginatedProducts.length === 0 ? (
              <Card className="p-12 text-center dark:bg-gray-800 dark:border-gray-700">
                <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                  No products found
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  {search
                    ? "Try adjusting your search criteria"
                    : "Get started by adding your first product"}
                </p>
              </Card>
            ) : (
              paginatedProducts.map((product) => (
                <div key={product.id} className="flex items-start gap-2">
                  {isBulkDeleteMode && (
                    <div className="pt-3">
                      <Checkbox
                        checked={selectedProducts.has(product.id)}
                        onCheckedChange={() =>
                          toggleProductSelection(product.id)
                        }
                      />
                    </div>
                  )}
                  <div className="flex-1">
                    <AccordionItem
                      id={product.id}
                      title={product.name}
                      subtitle={getCategoryName(product)}
                      status={{
                        label: product.availability || "In Stock",
                        variant: product.availability === "Out of Stock" ? "destructive" : "success",
                      }}
                      summary={
                        <div className="flex items-center gap-4">
                          <span>{getCategoryName(product)}</span>
                          {product.productType && (
                            <>
                              <span>•</span>
                              <span className="text-xs">
                                {product.productType}
                              </span>
                            </>
                          )}
                        </div>
                      }
                      details={
                        <div className="space-y-4">
                          {product.description && (
                            <div>
                              <h4 className="font-medium text-gray-900 dark:text-white mb-2">
                                Description
                              </h4>
                              <p className="text-gray-700 dark:text-gray-300">
                                {product.description}
                              </p>
                            </div>
                          )}

                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div>
                              <h5 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                                Category
                              </h5>
                              <p className="text-sm text-gray-900 dark:text-white">
                                {getCategoryName(product)}
                              </p>
                            </div>

                            {product.productType && (
                              <div>
                                <h5 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                                  Product Type
                                </h5>
                                <p className="text-sm text-gray-900 dark:text-white">
                                  {product.productType}
                                </p>
                              </div>
                            )}

                            {product.capacity && (
                              <div>
                                <h5 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                                  Capacity
                                </h5>
                                <p className="text-sm text-gray-900 dark:text-white">
                                  {product.capacity}
                                </p>
                              </div>
                            )}

                            {product.motorPower && (
                              <div>
                                <h5 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                                  Motor Power
                                </h5>
                                <p className="text-sm text-gray-900 dark:text-white">
                                  {product.motorPower}
                                </p>
                              </div>
                            )}
                          </div>

                          <div className="flex items-center justify-between pt-2 border-t border-gray-200 dark:border-gray-700">
                            <div className="text-xs text-gray-500 dark:text-gray-400">
                              Created:{" "}
                              {new Date(product.createdAt).toLocaleDateString()}
                              {product.updatedAt &&
                                product.updatedAt !== product.createdAt && (
                                  <span className="ml-4">
                                    Updated:{" "}
                                    {new Date(
                                      product.updatedAt,
                                    ).toLocaleDateString()}
                                  </span>
                                )}
                            </div>
                            <Badge
                              variant={
                                product.availability === "Out of Stock" ? "destructive" : "success"
                              }
                            >
                              {product.availability || "In Stock"}
                            </Badge>
                          </div>
                        </div>
                      }
                      onEdit={() => handleEditProduct(product)}
                      onDelete={() => handleDeleteProduct(product.id)}
                    />
                  </div>
                </div>
              ))
            )}
          </div>

          {totalPages > 1 && (
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Showing {startIndex + 1}-
                {Math.min(startIndex + ITEMS_PER_PAGE, filteredProducts.length)}{" "}
                of {filteredProducts.length} products
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                >
                  <ChevronLeft className="h-4 w-4" />
                  Previous
                </Button>

                <div className="flex items-center gap-1">
                  {Array.from(
                    { length: Math.min(totalPages, 10) },
                    (_, i) => i + 1,
                  ).map((page) => (
                    <Button
                      key={page}
                      variant={currentPage === page ? "default" : "outline"}
                      size="sm"
                      onClick={() => handlePageChange(page)}
                      className="w-8 h-8 p-0"
                    >
                      {page}
                    </Button>
                  ))}
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                >
                  Next
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </>
      )}

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingProduct ? "Edit Product" : "Create New Product"}
            </DialogTitle>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">Product Name*</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  placeholder="Enter product name"
                />
              </div>

              <div>
                <Label htmlFor="category">Category*</Label>
                <Select
                  value={formData.category}
                  onValueChange={(value) =>
                    setFormData({ ...formData, category: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                placeholder="Enter product description"
                rows={3}
              />
            </div>

            <div>
              <Label>Product Image</Label>
              {formData.image && (
                <img
                  src={formData.image}
                  alt="Preview"
                  className="w-32 h-32 object-contain border rounded mb-2"
                />
              )}
              <Input
                type="file"
                accept="image/*"
                onChange={async (e) => {
                  if (!e.target.files?.[0]) return;
                  const file = e.target.files[0];
                  const form = new FormData();
                  form.append("file", file);
                  form.append("type", "image");
                  form.append("category", "products");
                  const res = await fetch("/api/upload", {
                    method: "POST",
                    body: form,
                  });
                  const data = await res.json();
                  if (data.url) {
                    setFormData({ ...formData, image: data.url });
                  }
                }}
              />
            </div>

            {/* Key Features and Details */}
            <div className="border-t pt-4 mt-2">
              <h4 className="font-medium text-gray-900 dark:text-white mb-3">Key Features and Details</h4>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="productType">Product Type</Label>
                  <Input
                    id="productType"
                    value={formData.productType}
                    onChange={(e) =>
                      setFormData({ ...formData, productType: e.target.value })
                    }
                    placeholder="e.g., Rectangular"
                  />
                </div>

                <div>
                  <Label htmlFor="capacity">Capacity</Label>
                  <Input
                    id="capacity"
                    value={formData.capacity}
                    onChange={(e) =>
                      setFormData({ ...formData, capacity: e.target.value })
                    }
                    placeholder="e.g., 100 TPH"
                  />
                </div>

                <div>
                  <Label htmlFor="screenDimension">Screen Dimension</Label>
                  <Input
                    id="screenDimension"
                    value={formData.screenDimension}
                    onChange={(e) =>
                      setFormData({ ...formData, screenDimension: e.target.value })
                    }
                    placeholder="e.g., 16 ft x 5 ft"
                  />
                </div>

                <div>
                  <Label htmlFor="numberOfDecks">Number of Decks</Label>
                  <Input
                    id="numberOfDecks"
                    value={formData.numberOfDecks}
                    onChange={(e) =>
                      setFormData({ ...formData, numberOfDecks: e.target.value })
                    }
                    placeholder="e.g., 2"
                  />
                </div>

                <div>
                  <Label htmlFor="motorPower">Motor Power</Label>
                  <Input
                    id="motorPower"
                    value={formData.motorPower}
                    onChange={(e) =>
                      setFormData({ ...formData, motorPower: e.target.value })
                    }
                    placeholder="e.g., 5 HP"
                  />
                </div>

                <div>
                  <Label htmlFor="gyratoryCircular">Gyratory / Circular</Label>
                  <Input
                    id="gyratoryCircular"
                    value={formData.gyratoryCircular}
                    onChange={(e) =>
                      setFormData({ ...formData, gyratoryCircular: e.target.value })
                    }
                    placeholder="Special Features"
                  />
                </div>

                <div>
                  <Label htmlFor="specialFeatures">Special Features</Label>
                  <Input
                    id="specialFeatures"
                    value={formData.specialFeatures}
                    onChange={(e) =>
                      setFormData({ ...formData, specialFeatures: e.target.value })
                    }
                    placeholder="e.g., Ball / Slider Deck"
                  />
                </div>

                <div>
                  <Label htmlFor="availability">Availability</Label>
                  <Select
                    value={formData.availability}
                    onValueChange={(value) =>
                      setFormData({ ...formData, availability: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select availability" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="In Stock">In Stock</SelectItem>
                      <SelectItem value="Out of Stock">Out of Stock</SelectItem>
                      <SelectItem value="Made to Order">Made to Order</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveProduct} disabled={saving}>
              {saving
                ? "Saving..."
                : editingProduct
                  ? "Update Product"
                  : "Create Product"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
