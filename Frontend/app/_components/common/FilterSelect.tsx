import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface CategoryProps {
  title: string;
  data: string[] | { label: string; value: number | string }[]; // Accepts strings or objects
  selectedItem: string;
  name: string;
  onSelectChange: (value: string) => void;
}

export function FilterSelect({
  data,
  selectedItem,
  title,
  name,
  onSelectChange,
}: CategoryProps) {
  const isObjectData = typeof data[0] === 'object';

  return (
    <div className="flex flex-col gap-2">
      <Select value={selectedItem} onValueChange={onSelectChange} name={name}>
        <SelectTrigger>
          <SelectValue
            placeholder={`Select ${title
              .toLocaleLowerCase()
              .replace(title.charAt(title.length - 1), '')}`}
          />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup key="">
            <SelectLabel>{title}</SelectLabel>
            {(data as any[]).map(item =>
              isObjectData ? (
                <SelectItem key={item.value} value={item.value.toString()}>
                  {item.label}
                </SelectItem>
              ) : (
                <SelectItem key={item} value={item}>
                  {item}
                </SelectItem>
              ),
            )}
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
}
