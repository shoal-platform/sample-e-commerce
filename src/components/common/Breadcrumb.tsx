import Link from "next/link";
import { ChevronRight, Home } from "lucide-react";
import { cn } from "@/lib/utils";

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
  className?: string;
}

export function Breadcrumb({ items, className }: BreadcrumbProps) {
  return (
    <nav
      aria-label="Breadcrumb"
      className={cn("flex items-center text-sm text-muted-foreground", className)}
    >
      <ol className="flex min-w-0 items-center gap-1">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          const isHome = index === 0 && item.href === "/";

          return (
            <li key={`${item.label}-${index}`} className="flex min-w-0 items-center">
              {index > 0 && (
                <ChevronRight className="mx-1 h-4 w-4 shrink-0" aria-hidden="true" />
              )}
              {item.href && !isLast ? (
                <Link
                  href={item.href}
                  className="inline-flex min-w-0 items-center gap-1 hover:text-foreground"
                >
                  {isHome && <Home className="h-4 w-4 shrink-0" aria-hidden="true" />}
                  <span className="truncate">{item.label}</span>
                </Link>
              ) : (
                <span
                  aria-current={isLast ? "page" : undefined}
                  className="truncate text-foreground"
                >
                  {item.label}
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
