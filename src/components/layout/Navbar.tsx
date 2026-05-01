"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const navLinks = [
  { href: "/products", label: "All Products" },
  { href: "/products?category=electronics", label: "Electronics" },
  { href: "/products?category=clothing", label: "Clothing" },
  { href: "/products?category=books", label: "Books" },
  { href: "/products?category=home", label: "Home & Garden" },
  { href: "/products?category=sports", label: "Sports" },
];

interface NavbarProps {
  onClose?: () => void;
}

export function Navbar({ onClose }: NavbarProps) {
  const pathname = usePathname();

  return (
    <nav>
      {navLinks.map((link) => {
        const isActive =
          pathname === link.href ||
          (link.href !== "/" && pathname.startsWith(link.href.split("?")[0]));
        return (
          <Link
            key={link.href}
            href={link.href}
            onClick={onClose}
            className={cn(
              "block py-2 text-sm transition-colors hover:text-foreground",
              isActive
                ? "text-foreground font-medium"
                : "text-muted-foreground"
            )}
          >
            {link.label}
          </Link>
        );
      })}
    </nav>
  );
}
