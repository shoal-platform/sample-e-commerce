"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowRight } from "lucide-react";
import type { ShippingData } from "@/app/(shop)/checkout/page";

const shippingSchema = z.object({
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  lastName: z.string().min(2, "Last name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email"),
  phone: z.string().min(10, "Please enter a valid phone number"),
  address: z.string().min(5, "Please enter a valid address"),
  city: z.string().min(2, "Please enter a valid city"),
  state: z.string().min(2, "Please enter a valid state"),
  zip: z.string().min(5, "Please enter a valid ZIP code"),
  country: z.string().min(2, "Please enter a valid country"),
});

interface ShippingFormProps {
  onSubmit: (data: ShippingData) => void;
  defaultValues?: Partial<ShippingData>;
}

export function ShippingForm({ onSubmit, defaultValues }: ShippingFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ShippingData>({
    resolver: zodResolver(shippingSchema),
    defaultValues: {
      country: "US",
      ...defaultValues,
    },
  });

  return (
    <div className="bg-card border rounded-xl p-6">
      <h2 className="text-lg font-semibold mb-5">Shipping Information</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium block mb-1">First Name *</label>
            <Input placeholder="John" {...register("firstName")} />
            {errors.firstName && (
              <p className="text-destructive text-xs mt-1">{errors.firstName.message}</p>
            )}
          </div>
          <div>
            <label className="text-sm font-medium block mb-1">Last Name *</label>
            <Input placeholder="Doe" {...register("lastName")} />
            {errors.lastName && (
              <p className="text-destructive text-xs mt-1">{errors.lastName.message}</p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium block mb-1">Email *</label>
            <Input
              type="email"
              placeholder="you@example.com"
              {...register("email")}
            />
            {errors.email && (
              <p className="text-destructive text-xs mt-1">{errors.email.message}</p>
            )}
          </div>
          <div>
            <label className="text-sm font-medium block mb-1">Phone *</label>
            <Input
              type="tel"
              placeholder="+1 (555) 000-0000"
              {...register("phone")}
            />
            {errors.phone && (
              <p className="text-destructive text-xs mt-1">{errors.phone.message}</p>
            )}
          </div>
        </div>

        <div>
          <label className="text-sm font-medium block mb-1">Address *</label>
          <Input placeholder="123 Main Street, Apt 4B" {...register("address")} />
          {errors.address && (
            <p className="text-destructive text-xs mt-1">{errors.address.message}</p>
          )}
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          <div className="col-span-2 sm:col-span-1">
            <label className="text-sm font-medium block mb-1">City *</label>
            <Input placeholder="New York" {...register("city")} />
            {errors.city && (
              <p className="text-destructive text-xs mt-1">{errors.city.message}</p>
            )}
          </div>
          <div>
            <label className="text-sm font-medium block mb-1">State *</label>
            <Input placeholder="NY" {...register("state")} />
            {errors.state && (
              <p className="text-destructive text-xs mt-1">{errors.state.message}</p>
            )}
          </div>
          <div>
            <label className="text-sm font-medium block mb-1">ZIP *</label>
            <Input placeholder="10001" {...register("zip")} />
            {errors.zip && (
              <p className="text-destructive text-xs mt-1">{errors.zip.message}</p>
            )}
          </div>
        </div>

        <div>
          <label className="text-sm font-medium block mb-1">Country *</label>
          <select
            {...register("country")}
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          >
            <option value="US">United States</option>
            <option value="CA">Canada</option>
            <option value="GB">United Kingdom</option>
            <option value="AU">Australia</option>
            <option value="DE">Germany</option>
            <option value="FR">France</option>
            <option value="JP">Japan</option>
          </select>
          {errors.country && (
            <p className="text-destructive text-xs mt-1">{errors.country.message}</p>
          )}
        </div>

        <Button type="submit" className="w-full gap-2" size="lg" disabled={isSubmitting}>
          Continue to Payment
          <ArrowRight className="h-4 w-4" />
        </Button>
      </form>
    </div>
  );
}
