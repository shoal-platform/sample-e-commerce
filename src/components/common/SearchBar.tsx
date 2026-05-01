"use client";

import { FormEvent, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

export function SearchBar() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [query, setQuery] = useState(searchParams.get("search") ?? "");

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const params = new URLSearchParams();
    const trimmed = query.trim();
    if (trimmed) params.set("search", trimmed);
    router.push(`/products${params.toString() ? `?${params}` : ""}`);
  };

  return (
    <form onSubmit={handleSubmit} role="search" className="relative">
      <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
      <Input
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        placeholder="Search products"
        className="pl-9"
      />
    </form>
  );
}
