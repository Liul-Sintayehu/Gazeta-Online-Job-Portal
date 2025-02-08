import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';

interface PageSizeDropdownProps {
  currentSize: number;
  onChange: (size: number) => void;
}

export const PageSizeDropdown: React.FC<PageSizeDropdownProps> = ({
  currentSize,
  onChange,
}) => (
  <DropdownMenu>
    <DropdownMenuTrigger asChild>
      <Button variant="outline">Page Size: {currentSize}</Button>
    </DropdownMenuTrigger>
    <DropdownMenuContent>
      <DropdownMenuLabel>Select Page Size</DropdownMenuLabel>
      <DropdownMenuSeparator />
      <DropdownMenuRadioGroup
        value={String(currentSize)}
        onValueChange={size => onChange(Number(size))}
      >
        {[5, 10, 15, 25, 50, 100].map(size => (
          <DropdownMenuRadioItem key={size} value={String(size)}>
            {size}
          </DropdownMenuRadioItem>
        ))}
      </DropdownMenuRadioGroup>
    </DropdownMenuContent>
  </DropdownMenu>
);
