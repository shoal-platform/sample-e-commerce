import { db } from "@/lib/db";
import { formatPrice, formatDate } from "@/lib/utils";
import {
  DollarSign,
  ShoppingCart,
  Package,
  Users,
  TrendingUp,
  TrendingDown,
} from "lucide-react";

async function getAdminStats() {
  const [
    totalRevenue,
    totalOrders,
    totalProducts,
    totalUsers,
    recentOrders,
    pendingOrders,
  ] = await Promise.all([
    db.order.aggregate({
      _sum: { total: true },
      where: { status: { not: "CANCELLED" } },
    }),
    db.order.count(),
    db.product.count({ where: { isActive: true } }),
    db.user.count(),
    db.order.findMany({
      include: {
        user: { select: { name: true, email: true } },
        items: { include: { product: true }, take: 1 },
      },
      orderBy: { createdAt: "desc" },
      take: 5,
    }),
    db.order.count({ where: { status: "PENDING" } }),
  ]);

  return {
    totalRevenue: totalRevenue._sum.total ?? 0,
    totalOrders,
    totalProducts,
    totalUsers,
    recentOrders,
    pendingOrders,
  };
}

const statusColors: Record<string, string> = {
  PENDING: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
  PROCESSING: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
  SHIPPED: "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400",
  DELIVERED: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
  CANCELLED: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
};

export default async function AdminDashboard() {
  const stats = await getAdminStats();

  const statCards = [
    {
      title: "Total Revenue",
      value: formatPrice(stats.totalRevenue),
      icon: DollarSign,
      color: "text-green-500",
      bg: "bg-green-100 dark:bg-green-900/30",
      change: "+12.5%",
      up: true,
    },
    {
      title: "Total Orders",
      value: stats.totalOrders.toString(),
      icon: ShoppingCart,
      color: "text-blue-500",
      bg: "bg-blue-100 dark:bg-blue-900/30",
      change: "+8.2%",
      up: true,
    },
    {
      title: "Active Products",
      value: stats.totalProducts.toString(),
      icon: Package,
      color: "text-purple-500",
      bg: "bg-purple-100 dark:bg-purple-900/30",
      change: "+3.1%",
      up: true,
    },
    {
      title: "Total Customers",
      value: stats.totalUsers.toString(),
      icon: Users,
      color: "text-orange-500",
      bg: "bg-orange-100 dark:bg-orange-900/30",
      change: "+18.7%",
      up: true,
    },
  ];

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome back! Here&apos;s what&apos;s happening in your store.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {statCards.map((card) => (
          <div key={card.title} className="bg-card border rounded-xl p-5">
            <div className="flex items-center justify-between mb-4">
              <div className={`rounded-xl p-3 ${card.bg}`}>
                <card.icon className={`h-6 w-6 ${card.color}`} />
              </div>
              <div
                className={`flex items-center gap-1 text-sm font-medium ${
                  card.up ? "text-green-500" : "text-red-500"
                }`}
              >
                {card.up ? (
                  <TrendingUp className="h-4 w-4" />
                ) : (
                  <TrendingDown className="h-4 w-4" />
                )}
                {card.change}
              </div>
            </div>
            <p className="text-2xl font-bold">{card.value}</p>
            <p className="text-sm text-muted-foreground mt-1">{card.title}</p>
          </div>
        ))}
      </div>

      {/* Alert for pending orders */}
      {stats.pendingOrders > 0 && (
        <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-xl p-4 flex items-center justify-between">
          <div>
            <p className="font-semibold text-yellow-800 dark:text-yellow-400">
              {stats.pendingOrders} Pending Order{stats.pendingOrders > 1 ? "s" : ""}
            </p>
            <p className="text-sm text-yellow-700 dark:text-yellow-500">
              Review and process pending orders to keep customers happy.
            </p>
          </div>
          <a
            href="/admin/orders"
            className="text-sm font-medium text-yellow-800 dark:text-yellow-400 hover:underline whitespace-nowrap ml-4"
          >
            View Orders →
          </a>
        </div>
      )}

      {/* Recent Orders */}
      <div className="bg-card border rounded-xl overflow-hidden">
        <div className="px-6 py-4 border-b flex items-center justify-between">
          <h2 className="font-semibold text-lg">Recent Orders</h2>
          <a
            href="/admin/orders"
            className="text-sm text-primary hover:underline"
          >
            View all
          </a>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b bg-muted/30">
                <th className="text-left px-6 py-3 text-sm font-medium text-muted-foreground">
                  Order
                </th>
                <th className="text-left px-6 py-3 text-sm font-medium text-muted-foreground">
                  Customer
                </th>
                <th className="text-left px-6 py-3 text-sm font-medium text-muted-foreground">
                  Date
                </th>
                <th className="text-left px-6 py-3 text-sm font-medium text-muted-foreground">
                  Status
                </th>
                <th className="text-right px-6 py-3 text-sm font-medium text-muted-foreground">
                  Total
                </th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {stats.recentOrders.map((order) => (
                <tr key={order.id} className="hover:bg-muted/20 transition-colors">
                  <td className="px-6 py-4">
                    <span className="font-mono text-sm font-medium">
                      #{order.id.slice(0, 8)}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div>
                      <p className="text-sm font-medium">
                        {order.user?.name || "Guest"}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {order.user?.email}
                      </p>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-muted-foreground">
                    {formatDate(order.createdAt)}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                        statusColors[order.status] || ""
                      }`}
                    >
                      {order.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right font-medium">
                    {formatPrice(order.total)}
                  </td>
                </tr>
              ))}
              {stats.recentOrders.length === 0 && (
                <tr>
                  <td
                    colSpan={5}
                    className="px-6 py-8 text-center text-muted-foreground"
                  >
                    No orders yet
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
