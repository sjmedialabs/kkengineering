"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"

export function ContactForm() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    countryCode: "+91",
    message: "",
    agreedToPrivacy: false,
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const response = await fetch("/api/enquiries", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          type: "general",
          name: `${formData.firstName} ${formData.lastName}`,
          email: formData.email,
          phone: `${formData.countryCode} ${formData.phone}`,
          message: formData.message,
        }),
      })

      if (response.ok) {
        // Reset form
        setFormData({
          firstName: "",
          lastName: "",
          email: "",
          phone: "",
          countryCode: "+91",
          message: "",
          agreedToPrivacy: false,
        })
        alert("Message sent successfully! We will contact you soon.")
      } else {
        alert("Failed to send message. Please try again.")
      }
    } catch (error) {
      console.error("Error submitting form:", error)
      alert("An error occurred. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="rounded-lg bg-white p-8">
      <h2 className="mb-3 font-sans text-4xl font-bold text-gray-900">Get in touch</h2>
      <p className="mb-8 font-sans text-base text-gray-600">We'd love to hear from you. Please fill out this form.</p>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* First Name and Last Name */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="firstName" className="font-sans text-base font-medium text-gray-700">
              First name
            </Label>
            <Input
              id="firstName"
              type="text"
              required
              value={formData.firstName}
              onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
              className="mt-2 h-11 text-base"
              placeholder=""
            />
          </div>
          <div>
            <Label htmlFor="lastName" className="font-sans text-base font-medium text-gray-700">
              Last name
            </Label>
            <Input
              id="lastName"
              type="text"
              required
              value={formData.lastName}
              onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
              className="mt-2 h-11 text-base"
              placeholder=""
            />
          </div>
        </div>

        {/* Email */}
        <div>
          <Label htmlFor="email" className="font-sans text-base font-medium text-gray-700">
            Email
          </Label>
          <Input
            id="email"
            type="email"
            required
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            className="mt-2 h-11 text-base"
            placeholder=""
          />
        </div>

        {/* Phone Number */}
        <div>
          <Label htmlFor="phone" className="font-sans text-base font-medium text-gray-700">
            Phone number
          </Label>
          <div className="mt-2 flex gap-2">
            <select
              value={formData.countryCode}
              onChange={(e) => setFormData({ ...formData, countryCode: e.target.value })}
              className="h-11 w-24 rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <option value="+91">+91</option>
              <option value="+1">+1</option>
              <option value="+44">+44</option>
              <option value="+86">+86</option>
            </select>
            <Input
              id="phone"
              type="tel"
              required
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="h-11 flex-1 text-base"
              placeholder=""
            />
          </div>
        </div>

        {/* Message */}
        <div>
          <Label htmlFor="message" className="font-sans text-base font-medium text-gray-700">
            Message
          </Label>
          <Textarea
            id="message"
            required
            value={formData.message}
            onChange={(e) => setFormData({ ...formData, message: e.target.value })}
            className="mt-2 min-h-[140px] text-base"
            placeholder=""
          />
        </div>

        {/* Privacy Policy Checkbox */}
        <div className="flex items-start gap-3">
          <Checkbox
            id="privacy"
            checked={formData.agreedToPrivacy}
            onCheckedChange={(checked) => setFormData({ ...formData, agreedToPrivacy: checked as boolean })}
            required
            className="mt-1"
          />
          <Label htmlFor="privacy" className="cursor-pointer font-sans text-base leading-relaxed text-gray-600">
            You agree to our friendly privacy policy.
          </Label>
        </div>

        {/* Submit Button */}
        <Button
          type="submit"
          disabled={isSubmitting || !formData.agreedToPrivacy}
          className="w-full rounded-md bg-[#1E40AF] py-7 font-sans text-lg font-semibold text-white hover:bg-[#1E40AF]/90"
        >
          {isSubmitting ? "Sending..." : "Send Message"}
        </Button>
      </form>
    </div>
  )
}
