"use client";

import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { cn } from "@/lib/utils";
import { generatePagination } from "@/utils";
import { usePathname } from "next/navigation";

export default function PostPagination({
  totalPages,
  currentPage,
}: {
  totalPages: number;
  currentPage: number;
}) {
  const pathname = usePathname();

  return (
    <Pagination>
      <PaginationContent>
        <PaginationItem
          className={cn({
            hidden: currentPage === 1,
          })}
        >
          <PaginationPrevious href={`${pathname}/?page=${currentPage - 1}`} />
        </PaginationItem>

        {generatePagination(totalPages, currentPage).map((item, index) => {
          if (typeof item === "string") {
            return (
              <PaginationItem key={index}>
                <PaginationEllipsis />
              </PaginationItem>
            );
          }
          return (
            <PaginationItem key={index}>
              <PaginationLink
                href={`${pathname}/?page=${item}`}
                isActive={item === currentPage}
              >
                {item}
              </PaginationLink>
            </PaginationItem>
          );
        })}

        <PaginationItem
          className={cn({
            hidden: currentPage === totalPages,
          })}
        >
          <PaginationNext href={`${pathname}/?page=${currentPage + 1}`} />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}
