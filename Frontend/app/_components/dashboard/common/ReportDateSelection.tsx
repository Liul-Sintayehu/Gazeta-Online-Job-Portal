import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { DateRange } from '../constants';

interface DateSelectorProps {
  value?: DateRange;
  onChange: (value: DateRange) => void;
  defaultValue?: DateRange;
}

export const DateSelector: React.FC<DateSelectorProps> = ({
  value,
  onChange,
  defaultValue = DateRange.TODAY,
}) => {
  return (
    <Select
      value={(value ?? defaultValue).toString()} // Use value if provided, fallback to defaultValue
      onValueChange={val => onChange(parseInt(val) as DateRange)} // Parse string back to numeric enum
    >
      <SelectTrigger id="date" className="w-fit h-7 text-xs">
        <SelectValue placeholder="Report Date" />
      </SelectTrigger>
      <SelectContent position="popper">
        <SelectItem value={DateRange.TODAY.toString()}>Today</SelectItem>
        <SelectItem value={DateRange.THIS_WEEK.toString()}>
          This Week
        </SelectItem>
        <SelectItem value={DateRange.THIS_MONTH.toString()}>
          This Month
        </SelectItem>
        <SelectItem value={DateRange.THIS_YEAR.toString()}>
          This Year
        </SelectItem>
        <SelectItem value={DateRange.LAST_YEAR.toString()}>
          Last Year
        </SelectItem>
      </SelectContent>
    </Select>
  );
};
