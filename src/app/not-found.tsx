import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ShoppingBag, Home } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
      <div className="space-y-6 max-w-md">
        <div className="text-8xl font-bold text-primary/20">404</div>
        <div>
          <h1 className="text-3xl font-bold mb-2">Page Not Found</h1>
          <p className="text-muted-foreground">
            Sorry, we couldn&apos;t find the page you&apos;re looking for. It
            might have been moved, deleted, or never existed.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link href="/">
            <Button className="w-full sm:w-auto gap-2">
              <Home className="h-4 w-4" />
              Go Home
            </Button>
          </Link>
          <Link href="/products">
            <Button variant="outline" className="w-full sm:w-auto gap-2">
              <ShoppingBag className="h-4 w-4" />
              Shop Products
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
