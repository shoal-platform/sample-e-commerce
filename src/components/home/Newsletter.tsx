import { Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function Newsletter() {
  return (
    <section className="border-t bg-muted/30">
      <div className="container mx-auto grid gap-6 px-4 py-12 md:grid-cols-[1fr_420px] md:items-center">
        <div>
          <h2 className="text-2xl font-bold">Get Store Updates</h2>
          <p className="mt-2 text-muted-foreground">
            New products, limited offers, and seasonal picks in your inbox.
          </p>
        </div>
        <form className="flex gap-2">
          <div className="relative flex-1">
            <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input type="email" placeholder="Email address" className="pl-9" />
          </div>
          <Button type="submit">Subscribe</Button>
        </form>
      </div>
    </section>
  );
}
