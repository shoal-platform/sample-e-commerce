import Link from "next/link";
import { ShoppingBag } from "lucide-react";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex">
      {/* Left side - branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-primary flex-col items-center justify-center p-12 text-primary-foreground">
        <div className="max-w-md text-center space-y-6">
          <Link href="/" className="flex items-center gap-3 justify-center mb-8">
            <div className="bg-primary-foreground rounded-xl p-2">
              <ShoppingBag className="h-8 w-8 text-primary" />
            </div>
            <span className="text-3xl font-bold">ShopNext</span>
          </Link>
          <h1 className="text-4xl font-bold leading-tight">
            Your Ultimate Shopping Destination
          </h1>
          <p className="text-primary-foreground/80 text-lg">
            Discover thousands of products, enjoy exclusive deals, and experience
            seamless shopping with fast delivery right to your door.
          </p>
          <div className="grid grid-cols-3 gap-4 pt-4">
            <div className="text-center">
              <div className="text-3xl font-bold">20K+</div>
              <div className="text-sm text-primary-foreground/70">Products</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold">50K+</div>
              <div className="text-sm text-primary-foreground/70">Customers</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold">4.9★</div>
              <div className="text-sm text-primary-foreground/70">Rating</div>
            </div>
          </div>
        </div>
      </div>

      {/* Right side - form */}
      <div className="flex-1 flex flex-col items-center justify-center p-6 lg:p-12">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <Link href="/" className="flex items-center gap-2 mb-8 lg:hidden">
            <div className="bg-primary rounded-lg p-1.5">
              <ShoppingBag className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold">ShopNext</span>
          </Link>
          {children}
        </div>
      </div>
    </div>
  );
}
