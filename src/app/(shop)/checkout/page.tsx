"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCartStore } from "@/store/cartStore";
import { CheckoutSteps } from "@/components/checkout/CheckoutSteps";
import { ShippingForm } from "@/components/checkout/ShippingForm";
import { PaymentForm } from "@/components/checkout/PaymentForm";
import { OrderSummary } from "@/components/checkout/OrderSummary";
import { EmptyState } from "@/components/common/EmptyState";
import { Button } from "@/components/ui/button";
import { ShoppingCart } from "lucide-react";
import Link from "next/link";
import type { CheckoutFormData } from "@/types";

export type CheckoutStep = "shipping" | "payment" | "confirmation";

export interface ShippingData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  country: string;
}

export default function CheckoutPage() {
  const router = useRouter();
  const { items, getTotalPrice } = useCartStore();
  const [currentStep, setCurrentStep] = useState<CheckoutStep>("shipping");
  const [shippingData, setShippingData] = useState<ShippingData | null>(null);
  const [clientSecret, setClientSecret] = useState<string | null>(null);

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-12">
        <EmptyState
          icon={<ShoppingCart className="h-16 w-16 text-muted-foreground" />}
          title="Your cart is empty"
          description="Add some items to your cart before checking out."
          action={
            <Link href="/products">
              <Button>Start Shopping</Button>
            </Link>
          }
        />
      </div>
    );
  }

  const handleShippingSubmit = async (data: ShippingData) => {
    setShippingData(data);
    // Create payment intent
    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: items.map((item) => ({
            productId: item.productId,
            quantity: item.quantity,
            price: item.product.price,
          })),
          shipping: data,
        }),
      });
      const result = await response.json();
      if (result.clientSecret) {
        setClientSecret(result.clientSecret);
        setCurrentStep("payment");
      }
    } catch (error) {
      console.error("Failed to create payment intent:", error);
    }
  };

  const handlePaymentSuccess = (orderId: string) => {
    router.push(`/checkout/success?orderId=${orderId}`);
  };

  return (
    <div className="container mx-auto px-4 py-6 max-w-6xl">
      <h1 className="text-2xl font-bold mb-6">Checkout</h1>

      <CheckoutSteps currentStep={currentStep} />

      <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          {currentStep === "shipping" && (
            <ShippingForm onSubmit={handleShippingSubmit} defaultValues={shippingData || undefined} />
          )}
          {currentStep === "payment" && clientSecret && shippingData && (
            <PaymentForm
              clientSecret={clientSecret}
              shippingData={shippingData}
              onSuccess={handlePaymentSuccess}
              onBack={() => setCurrentStep("shipping")}
            />
          )}
        </div>
        <div className="lg:col-span-1">
          <OrderSummary items={items} />
        </div>
      </div>
    </div>
  );
}
