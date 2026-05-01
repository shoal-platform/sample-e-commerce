import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { Breadcrumb } from "@/components/common/Breadcrumb";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/common/EmptyState";
import { formatPrice, formatDate } from "@/lib/utils";
import { Package, Eye } from "lucide-react";
import Link from "next/link";

export const dynamic = "force-dynamic";

const statusColors: Record<string, string> = {
  PENDING: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
  PROCESSING: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
  SHIPPED: "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400",
  DELIVERED: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
  CANCELLED: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
};

export default async function OrdersPage() {
  const session = await auth();
  if (!session) redirect("/login");

  const orders = await db.order.findMany({
    where: { userId: session.user.id },
    include: {
      items: {
        include: { product: true },
        take: 3,
      },
    },
    orderBy: { createdAt: "desc" },
  });

  const breadcrumbs = [
    { label: "Home", href: "/" },
    { label: "My Account", href: "/account" },
    { label: "Orders" },
  ];

  return (
    <div className="container mx-auto px-4 py-6 max-w-4xl">
      <Breadcrumb items={breadcrumbs} />

      <h1 className="text-2xl font-bold mt-4 mb-8">My Orders</h1>

      {orders.length === 0 ? (
        <EmptyState
          icon={<Package className="h-16 w-16 text-muted-foreground" />}
          title="No orders yet"
          description="You haven't placed any orders yet. Start shopping to see your orders here."
          action={
            <Link href="/products">
              <Button>Start Shopping</Button>
            </Link>
          }
        />
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div key={order.id} className="border rounded-xl overflow-hidden">
              {/* Order header */}
              <div className="bg-muted/30 px-5 py-4 flex flex-wrap items-center justify-between gap-3 border-b">
                <div className="flex flex-wrap gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">Order ID: </span>
                    <span className="font-mono font-medium">
                      {order.id.slice(0, 8)}...
                    </span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Date: </span>
                    <span className="font-medium">{formatDate(order.createdAt)}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Total: </span>
                    <span className="font-bold">{formatPrice(order.total)}</span>
                  </div>
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    statusColors[order.status] || ""
                  }`}
                >
                  {order.status}
                </span>
              </div>

              {/* Order items preview */}
              <div className="p-5">
                <div className="space-y-3">
                  {order.items.map((item) => (
                    <div key={item.id} className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-muted rounded-lg overflow-hidden shrink-0">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={`https://picsum.photos/seed/${item.productId}/48/48`}
                          alt={item.product.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">
                          {item.product.name}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Qty: {item.quantity} · {formatPrice(item.price)}
                        </p>
                      </div>
                    </div>
                  ))}
                  {order.items.length === 3 && (
                    <p className="text-xs text-muted-foreground text-center">
                      + more items
                    </p>
                  )}
                </div>

                {/* Shipping info */}
                {order.shippingAddress && (
                  <div className="mt-4 pt-4 border-t">
                    <p className="text-xs text-muted-foreground">
                      Shipping to: {order.shippingName} · {order.shippingAddress},{" "}
                      {order.shippingCity}, {order.shippingState}{" "}
                      {order.shippingZip}
                    </p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
