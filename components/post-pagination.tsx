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

export default function PostPagination({
  totalPages,
  currentPage,
}: {
  totalPages: number;
  currentPage: number;
}) {
  return (
    totalPages > 1 && (
      <Pagination>
        <PaginationContent>
          <PaginationItem
            className={cn({
              hidden: currentPage === 1,
            })}
          >
            <PaginationPrevious href={`/blog/${currentPage - 1}`} />
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
                  href={`/blog/${item}`}
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
            <PaginationNext href={`/blog/${currentPage + 1}`} />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    )
  );
}
