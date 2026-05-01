import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
}

function pageHref(page: number) {
  const params = new URLSearchParams();
  if (page > 1) params.set("page", String(page));
  return `/products${params.toString() ? `?${params}` : ""}`;
}

export function Pagination({ currentPage, totalPages }: PaginationProps) {
  const pages = Array.from({ length: totalPages }, (_, index) => index + 1);

  return (
    <nav className="flex items-center justify-center gap-2" aria-label="Pagination">
      <Button asChild variant="outline" size="icon" disabled={currentPage <= 1}>
        <Link
          href={pageHref(Math.max(1, currentPage - 1))}
          aria-disabled={currentPage <= 1}
          className={cn(currentPage <= 1 && "pointer-events-none opacity-50")}
        >
          <ChevronLeft className="h-4 w-4" />
        </Link>
      </Button>
      {pages.map((page) => (
        <Button
          key={page}
          asChild
          variant={page === currentPage ? "default" : "outline"}
          size="icon"
        >
          <Link href={pageHref(page)} aria-current={page === currentPage ? "page" : undefined}>
            {page}
          </Link>
        </Button>
      ))}
      <Button asChild variant="outline" size="icon" disabled={currentPage >= totalPages}>
        <Link
          href={pageHref(Math.min(totalPages, currentPage + 1))}
          aria-disabled={currentPage >= totalPages}
          className={cn(currentPage >= totalPages && "pointer-events-none opacity-50")}
        >
          <ChevronRight className="h-4 w-4" />
        </Link>
      </Button>
    </nav>
  );
}
