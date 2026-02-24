"use client";

import type React from "react";
import { useState, useEffect } from "react";
import type { Product, Category } from "@/types";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { X } from "lucide-react";

interface EnquiryModalProps {
  isOpen: boolean;
  onClose: () => void;
  product?: Product;
}

export function EnquiryModal({ isOpen, onClose, product }: EnquiryModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    mobile: "",
    productCategory: "",
    selectedProduct: "",
    message: "",
  });

  // Fetch categories and products
  useEffect(() => {
    if (isOpen) {
      fetchCategories();
      fetchAllProducts();
    }
  }, [isOpen]);

  // Set initial values if product is provided
  useEffect(() => {
    if (isOpen && product) {
      setFormData((prev) => ({
        ...prev,
        productCategory: product.category || "",
        selectedProduct: product.id || "",
      }));
    } else if (isOpen && !product) {
      setFormData({
        name: "",
        email: "",
        mobile: "",
        productCategory: "",
        selectedProduct: "",
        message: "",
      });
    }
  }, [isOpen, product]);

  // Filter products when category changes
  useEffect(() => {
    if (formData.productCategory) {
      const filtered = allProducts.filter(
        (p) => p.category === formData.productCategory
      );
      setFilteredProducts(filtered);
    } else {
      setFilteredProducts(allProducts);
    }
  }, [formData.productCategory, allProducts]);

  const fetchCategories = async () => {
    try {
      const response = await fetch("/api/categories");
      const data = await response.json();
      setCategories(data);
    } catch (error) {
      console.error("Failed to fetch categories:", error);
    }
  };

  const fetchAllProducts = async () => {
    try {
      const response = await fetch("/api/products?limit=1000");
      const data = await response.json();
      setAllProducts(data.products || []);
    } catch (error) {
      console.error("Failed to fetch products:", error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Get the selected product name
    const selectedProductObj = allProducts.find(
      (p) => p.id === formData.selectedProduct
    );

    try {
      const response = await fetch("/api/enquiries", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          type: product ? "product" : "general_product",
          name: formData.name,
          email: formData.email,
          phone: formData.mobile,
          productName: selectedProductObj?.name || product?.name || undefined,
          productCategory: formData.productCategory || undefined,
          selectedProductId: formData.selectedProduct || product?.id || undefined,
          message: formData.message,
        }),
      });

      if (response.ok) {
        setFormData({
          name: "",
          email: "",
          mobile: "",
          productCategory: "",
          selectedProduct: "",
          message: "",
        });
        onClose();
        alert("Enquiry submitted successfully! We will contact you soon.");
      } else {
        alert("Failed to submit enquiry. Please try again.");
      }
    } catch (error) {
      console.error("Error submitting enquiry:", error);
      alert("An error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Get subtitle text
  const getSubtitle = () => {
    if (product) {
      return product.name;
    }
    const selectedProd = allProducts.find(p => p.id === formData.selectedProduct);
    return selectedProd?.name || "Product Enquiry";
  };

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
    >
      <DialogContent
        className="flex max-h-[90vh] max-w-[500px] flex-col p-0"
        showCloseButton={false}
      >
        <DialogTitle className="sr-only">Enquiry Form</DialogTitle>
        <DialogDescription className="sr-only">
          Submit your enquiry and we will get back to you within 24 hours
        </DialogDescription>

        {/* Close Button */}
        <button
          onClick={onClose}
          type="button"
          className="absolute right-4 top-4 z-10 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
        >
          <X className="h-5 w-5" />
          <span className="sr-only">Close</span>
        </button>

        {/* Form: scrollable body + fixed footer */}
        <form
          onSubmit={handleSubmit}
          id="enquiry-form"
          className="flex min-h-0 flex-1 flex-col"
        >
          {/* Scrollable form content */}
          <div className="flex-1 overflow-y-auto p-6">
            {/* Header */}
            <div className="mb-6 text-center">
              <h2 className="mb-1 font-sans text-xl font-semibold text-[#1a2847]">
                Enquiry Now!
              </h2>
              <p className="font-sans text-sm text-gray-500">
                {getSubtitle()}
              </p>
            </div>

            <div className="space-y-4">
              {/* Name */}
              <div>
                <Label htmlFor="name" className="text-sm font-medium">
                  Name*
                </Label>
                <Input
                  id="name"
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="mt-1"
                />
              </div>

              {/* Email */}
              <div>
                <Label htmlFor="email" className="text-sm font-medium">
                  Email address*
                </Label>
                <Input
                  id="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  className="mt-1"
                />
              </div>

              {/* Mobile Number */}
              <div>
                <Label htmlFor="mobile" className="text-sm font-medium">
                  Mobile number*{" "}
                  <span className="text-xs text-red-500">(with country Code)</span>
                </Label>
                <Input
                  id="mobile"
                  type="tel"
                  required
                  value={formData.mobile}
                  onChange={(e) =>
                    setFormData({ ...formData, mobile: e.target.value })
                  }
                  className="mt-1"
                  placeholder="+91 1234567890"
                />
              </div>

              {/* Product Category */}
              <div>
                <Label htmlFor="productCategory" className="text-sm font-medium">
                  Product Category
                </Label>
                <Select
                  value={formData.productCategory}
                  onValueChange={(value) =>
                    setFormData({ ...formData, productCategory: value, selectedProduct: "" })
                  }
                  disabled={!!product}
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select Product" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category.id} value={category.name}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Select Product */}
              <div>
                <Label htmlFor="selectedProduct" className="text-sm font-medium">
                  Select Product
                </Label>
                <Select
                  value={formData.selectedProduct}
                  onValueChange={(value) =>
                    setFormData({ ...formData, selectedProduct: value })
                  }
                  disabled={!!product}
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select Product" />
                  </SelectTrigger>
                  <SelectContent>
                    {filteredProducts.map((prod) => (
                      <SelectItem key={prod.id} value={prod.id}>
                        {prod.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Message */}
              <div>
                <Label htmlFor="message" className="text-sm font-medium">
                  Write Message
                </Label>
                <Textarea
                  id="message"
                  value={formData.message}
                  onChange={(e) =>
                    setFormData({ ...formData, message: e.target.value })
                  }
                  className="mt-1 min-h-[80px]"
                  placeholder="Your message..."
                />
              </div>
            </div>
          </div>

          {/* Fixed form footer with Submit button */}
          <div className="flex-shrink-0 border-t bg-white p-4">
            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-[#1a2847] hover:bg-[#2a3a5a] rounded-full py-5 font-medium"
            >
              {isSubmitting ? "Submitting..." : "Submit"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
