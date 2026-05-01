import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { Breadcrumb } from "@/components/common/Breadcrumb";
import { ProfileForm } from "@/components/account/ProfileForm";
import { User, Mail, Calendar } from "lucide-react";
import { formatDate } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function AccountPage() {
  const session = await auth();
  if (!session) redirect("/login");

  const user = await db.user.findUnique({
    where: { id: session.user.id },
    include: {
      _count: {
        select: { orders: true },
      },
    },
  });

  if (!user) redirect("/login");

  const breadcrumbs = [
    { label: "Home", href: "/" },
    { label: "My Account" },
  ];

  return (
    <div className="container mx-auto px-4 py-6 max-w-4xl">
      <Breadcrumb items={breadcrumbs} />

      <h1 className="text-2xl font-bold mt-4 mb-8">My Account</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Stats */}
        <div className="md:col-span-3 grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="border rounded-xl p-5 flex items-center gap-4">
            <div className="rounded-full bg-primary/10 p-3">
              <User className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Account Type</p>
              <p className="font-bold capitalize">{user.role.toLowerCase()}</p>
            </div>
          </div>
          <div className="border rounded-xl p-5 flex items-center gap-4">
            <div className="rounded-full bg-primary/10 p-3">
              <Mail className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Orders</p>
              <p className="font-bold">{user._count.orders}</p>
            </div>
          </div>
          <div className="border rounded-xl p-5 flex items-center gap-4">
            <div className="rounded-full bg-primary/10 p-3">
              <Calendar className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Member Since</p>
              <p className="font-bold">{formatDate(user.createdAt)}</p>
            </div>
          </div>
        </div>

        {/* Profile Form */}
        <div className="md:col-span-3">
          <ProfileForm user={{
            id: user.id,
            name: user.name,
            email: user.email,
            image: user.image,
          }} />
        </div>
      </div>
    </div>
  );
}
