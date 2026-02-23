"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
}

export const Pagination = ({ currentPage, totalPages, totalItems }: PaginationProps) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const handlePageChange = (page: number) => {
    const params = new URLSearchParams(searchParams);
    
    if (page === 1) {
      params.delete("page");
    } else {
      params.set("page", page.toString());
    }

    const queryString = params.toString();
    router.push(queryString ? `${pathname}?${queryString}` : pathname);

    // Scroll to top when changing pages
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (totalPages <= 1) {
    return null;
  }

  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const showEllipsisThreshold = 7;

    if (totalPages <= showEllipsisThreshold) {
      // Show all pages if total is small
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Always show first page
      pages.push(1);

      if (currentPage > 3) {
        pages.push("ellipsis-start");
      }

      // Show pages around current page
      for (let i = Math.max(2, currentPage - 1); i <= Math.min(totalPages - 1, currentPage + 1); i++) {
        pages.push(i);
      }

      if (currentPage < totalPages - 2) {
        pages.push("ellipsis-end");
      }

      // Always show last page
      pages.push(totalPages);
    }

    return pages;
  };

  const pageNumbers = getPageNumbers();

  return (
    <div className="mt-12 border-t border-border-subtle pt-8">
      <div className="flex flex-col items-center gap-4">
        {/* Page info */}
        <div className="text-body-sm text-text-tertiary">
          Page {currentPage} of {totalPages} · {totalItems} total
        </div>

        {/* Page buttons */}
        <div className="flex items-center gap-2">
          {/* Previous button */}
          <Button
            variant="secondary"
            size="sm"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="mr-2"
          >
            Previous
          </Button>

          {/* Page numbers */}
          {pageNumbers.map((page, index) => {
            if (typeof page === "string") {
              return (
                <span key={`${page}-${index}`} className="px-2 text-text-tertiary">
                  ...
                </span>
              );
            }

            return (
              <Button
                key={page}
                variant={currentPage === page ? "primary" : "secondary"}
                size="sm"
                onClick={() => handlePageChange(page)}
                className="min-w-10"
              >
                {page}
              </Button>
            );
          })}

          {/* Next button */}
          <Button
            variant="secondary"
            size="sm"
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="ml-2"
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
};
