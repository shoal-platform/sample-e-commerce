"use client";

import { useState, useEffect } from "react";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  PaymentElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { Button } from "@/components/ui/button";
import { formatPrice, getShippingCost, calculateOrderTotal } from "@/lib/utils";
import { useCartStore } from "@/store/cartStore";
import { ArrowLeft, Loader2, Shield } from "lucide-react";
import type { ShippingData } from "@/app/(shop)/checkout/page";

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY ?? ""
);

interface PaymentFormProps {
  clientSecret: string;
  shippingData: ShippingData;
  onSuccess: (orderId: string) => void;
  onBack: () => void;
}

function PaymentFormInner({
  shippingData,
  onSuccess,
  onBack,
}: Omit<PaymentFormProps, "clientSecret">) {
  const stripe = useStripe();
  const elements = useElements();
  const { getTotalPrice, clearCart } = useCartStore();
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const subtotal = getTotalPrice();
  const shipping = getShippingCost(subtotal);
  const { tax, total } = calculateOrderTotal(subtotal, shipping);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setIsProcessing(true);
    setError(null);

    try {
      const { error: stripeError, paymentIntent } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/checkout/success`,
          payment_method_data: {
            billing_details: {
              name: `${shippingData.firstName} ${shippingData.lastName}`,
              email: shippingData.email,
              phone: shippingData.phone,
              address: {
                line1: shippingData.address,
                city: shippingData.city,
                state: shippingData.state,
                postal_code: shippingData.zip,
                country: shippingData.country,
              },
            },
          },
        },
        redirect: "if_required",
      });

      if (stripeError) {
        setError(stripeError.message ?? "Payment failed. Please try again.");
      } else if (paymentIntent && paymentIntent.status === "succeeded") {
        clearCart();
        onSuccess(paymentIntent.id);
      }
    } catch {
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="bg-card border rounded-xl p-6">
        <h2 className="text-lg font-semibold mb-4">Payment Information</h2>

        {/* Shipping summary */}
        <div className="bg-muted/30 rounded-lg p-3 mb-5 text-sm">
          <p className="font-medium">Shipping to:</p>
          <p className="text-muted-foreground mt-0.5">
            {shippingData.firstName} {shippingData.lastName} · {shippingData.address},{" "}
            {shippingData.city}, {shippingData.state} {shippingData.zip}
          </p>
        </div>

        {/* Stripe Elements */}
        <PaymentElement
          options={{
            layout: "tabs",
          }}
        />

        {error && (
          <div className="bg-destructive/10 border border-destructive/20 text-destructive rounded-lg p-3 text-sm mt-4">
            {error}
          </div>
        )}
      </div>

      {/* Price summary */}
      <div className="bg-card border rounded-xl p-4 text-sm space-y-2">
        <div className="flex justify-between text-muted-foreground">
          <span>Subtotal</span>
          <span>{formatPrice(subtotal)}</span>
        </div>
        <div className="flex justify-between text-muted-foreground">
          <span>Shipping</span>
          <span className={shipping === 0 ? "text-green-500" : ""}>
            {shipping === 0 ? "FREE" : formatPrice(shipping)}
          </span>
        </div>
        <div className="flex justify-between text-muted-foreground">
          <span>Tax</span>
          <span>{formatPrice(tax)}</span>
        </div>
        <div className="flex justify-between font-bold text-base border-t pt-2">
          <span>Total charged</span>
          <span className="text-primary">{formatPrice(total)}</span>
        </div>
      </div>

      <div className="flex gap-3">
        <Button
          type="button"
          variant="outline"
          onClick={onBack}
          className="gap-2"
          disabled={isProcessing}
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </Button>
        <Button
          type="submit"
          className="flex-1 gap-2"
          size="lg"
          disabled={!stripe || isProcessing}
        >
          {isProcessing ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Processing...
            </>
          ) : (
            <>
              <Shield className="h-4 w-4" />
              Pay {formatPrice(total)}
            </>
          )}
        </Button>
      </div>

      <p className="text-center text-xs text-muted-foreground flex items-center justify-center gap-1.5">
        <Shield className="h-3 w-3" />
        Payments are secured and encrypted by Stripe
      </p>
    </form>
  );
}

export function PaymentForm({
  clientSecret,
  shippingData,
  onSuccess,
  onBack,
}: PaymentFormProps) {
  return (
    <Elements
      stripe={stripePromise}
      options={{
        clientSecret,
        appearance: {
          theme: "stripe",
          variables: {
            colorPrimary: "#3b82f6",
          },
        },
      }}
    >
      <PaymentFormInner
        shippingData={shippingData}
        onSuccess={onSuccess}
        onBack={onBack}
      />
    </Elements>
  );
}
