import { db } from "@/lib/db";
import { formatPrice, formatDate } from "@/lib/utils";
import { AdminOrdersClient } from "@/components/admin/AdminOrdersClient";

export const dynamic = "force-dynamic";

export default async function AdminOrdersPage() {
  const orders = await db.order.findMany({
    include: {
      user: { select: { name: true, email: true } },
      items: {
        include: { product: { select: { name: true } } },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Orders</h1>
        <p className="text-muted-foreground">
          Manage all customer orders ({orders.length} orders)
        </p>
      </div>
      <AdminOrdersClient orders={orders} />
    </div>
  );
}
