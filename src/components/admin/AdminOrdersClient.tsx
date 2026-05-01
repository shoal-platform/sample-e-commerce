"use client";

import { useState } from "react";
import { formatDate, formatPrice } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type AdminOrder = {
  id: string;
  status: string;
  total: number;
  createdAt: Date | string;
  user?: { name?: string | null; email?: string | null } | null;
  items: Array<{ id: string; quantity: number; product?: { name: string } | null }>;
};

const statuses = ["PENDING", "PROCESSING", "SHIPPED", "DELIVERED", "CANCELLED"];

export function AdminOrdersClient({ orders }: { orders: AdminOrder[] }) {
  const [orderRows, setOrderRows] = useState(orders);

  async function updateStatus(orderId: string, status: string) {
    setOrderRows((rows) =>
      rows.map((order) => (order.id === orderId ? { ...order, status } : order))
    );
    await fetch("/api/orders", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ orderId, status }),
    });
  }

  return (
    <div className="overflow-hidden rounded-lg border bg-card">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b bg-muted/30">
              <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Order</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Customer</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Items</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Date</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Status</th>
              <th className="px-4 py-3 text-right text-sm font-medium text-muted-foreground">Total</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {orderRows.map((order) => (
              <tr key={order.id}>
                <td className="px-4 py-3 font-mono text-sm">#{order.id.slice(0, 8)}</td>
                <td className="px-4 py-3 text-sm">
                  <div className="font-medium">{order.user?.name ?? "Guest"}</div>
                  <div className="text-xs text-muted-foreground">{order.user?.email}</div>
                </td>
                <td className="px-4 py-3 text-sm text-muted-foreground">
                  {order.items.reduce((total, item) => total + item.quantity, 0)}
                </td>
                <td className="px-4 py-3 text-sm text-muted-foreground">
                  {formatDate(order.createdAt)}
                </td>
                <td className="px-4 py-3">
                  <Select
                    value={order.status}
                    onValueChange={(status) => updateStatus(order.id, status)}
                  >
                    <SelectTrigger className="w-40">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {statuses.map((status) => (
                        <SelectItem key={status} value={status}>
                          {status}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </td>
                <td className="px-4 py-3 text-right font-medium">
                  {formatPrice(order.total)}
                </td>
              </tr>
            ))}
            {orderRows.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-10 text-center text-muted-foreground">
                  No orders yet
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
