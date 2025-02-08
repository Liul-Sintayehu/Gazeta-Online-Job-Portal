import { Button } from '@/components/ui/button';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationPrevious,
  PaginationNext,
  PaginationEllipsis,
} from '@/components/ui/pagination';
import { ChevronLeftIcon, ChevronRightIcon } from 'lucide-react';

interface PaginationControlsProps {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}
export const PaginationControls: React.FC<PaginationControlsProps> = ({
  page,
  totalPages,
  onPageChange,
}) => {
  const getVisiblePages = () => {
    const visiblePages = [];
    const range = 2;

    for (
      let i = Math.max(1, page - range);
      i <= Math.min(totalPages, page + range);
      i++
    ) {
      visiblePages.push(i);
    }

    return visiblePages;
  };

  const visiblePages = getVisiblePages();

  return (
    <Pagination>
      <PaginationContent>
        {page > 1 ? (
          <PaginationItem>
            <PaginationPrevious onClick={() => onPageChange(page - 1)} />
          </PaginationItem>
        ) : (
          <Button variant="ghost" disabled>
            <ChevronLeftIcon className="h-4 w-fit" />
            <span>Previous</span>
          </Button>
        )}

        {/* First Page and Ellipsis */}
        {visiblePages[0] > 1 && (
          <>
            <PaginationItem>
              <PaginationLink onClick={() => onPageChange(1)}>1</PaginationLink>
            </PaginationItem>
            {visiblePages[0] > 2 && <PaginationEllipsis />}
          </>
        )}

        {/* Visible Page Numbers */}
        {visiblePages.map(pageNumber => (
          <PaginationItem key={pageNumber}>
            <PaginationLink
              onClick={() => onPageChange(pageNumber)}
              isActive={pageNumber === page}
            >
              {pageNumber}
            </PaginationLink>
          </PaginationItem>
        ))}

        {/* Last Page and Ellipsis */}
        {visiblePages[visiblePages.length - 1] < totalPages && (
          <>
            {visiblePages[visiblePages.length - 1] < totalPages - 1 && (
              <PaginationEllipsis />
            )}
            <PaginationItem>
              <PaginationLink onClick={() => onPageChange(totalPages)}>
                {totalPages}
              </PaginationLink>
            </PaginationItem>
          </>
        )}

        {/* Next Button */}
        {page < totalPages ? (
          <PaginationItem>
            <PaginationNext onClick={() => onPageChange(page + 1)} />
          </PaginationItem>
        ) : (
          <Button variant="ghost" disabled>
            <span>Next</span>
            <ChevronRightIcon className="h-4 w-fit" />
          </Button>
        )}
      </PaginationContent>
    </Pagination>
  );
};
