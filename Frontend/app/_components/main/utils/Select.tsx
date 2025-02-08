import { Card } from "@nextui-org/card";

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
  } from '@/components/ui/select';

export default function SelectComponent(){
    return      <Select 
        >
         <SelectTrigger id="date" className="w-fit h-7 text-xs">
           <SelectValue placeholder="Report Date" />
         </SelectTrigger>
         <SelectContent position="popper">
           <SelectItem value={'1'}>Today</SelectItem>
           <SelectItem value={'2'}>
             This Week
           </SelectItem>
           <SelectItem value={'3'}>
             This Month
           </SelectItem>
           <SelectItem value={'4'}>
             This Year
           </SelectItem>
           <SelectItem value={'5'}>
             Last Year
           </SelectItem>
         </SelectContent>
       </Select> 
}