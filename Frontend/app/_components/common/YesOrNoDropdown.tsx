import React from 'react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from '@/components/ui/dropdown-menu';
import { YesOrNo, YesOrNoType } from '@/app/_lib/data/types/constants';

interface YesOrNoDropdownProps {
  selectedOption: YesOrNoType;
  onChange: (option: YesOrNoType) => void;
}

const YesOrNoDropdown: React.FC<YesOrNoDropdownProps> = ({
  selectedOption,
  onChange,
}) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="w-fit" asChild>
        <Button variant="outline">
          {selectedOption === YesOrNo.Yes ? 'Yes' : 'No'}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-48 rounded p-2 m-3">
        {Object.values(YesOrNo).map((option, index) => (
          <DropdownMenuItem
            key={index}
            onClick={() => onChange(option)}
            className="p-2 hover:bg-blue-100 flex items-center text-sm space-x-2 justify-start"
          >
            <span>{option === YesOrNo.Yes ? 'Yes' : 'No'}</span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default YesOrNoDropdown;
