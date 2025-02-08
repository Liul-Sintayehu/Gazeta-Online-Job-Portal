'use client';

import * as React from 'react';
import { Check, ChevronsUpDown, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Employee } from '../clearance/types';
import { capitalizeEachWord, cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';
import Spinner from './Spinner';

export function EmployeeCombobox({
  selectedEmployee,
  allEmployees,
  isLoading,
  setSelectedEmployee,
}: {
  selectedEmployee: Employee | null;
  allEmployees: Employee[] | null;
  isLoading?: boolean;
  setSelectedEmployee: React.Dispatch<React.SetStateAction<Employee | null>>;
}) {
  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState<Employee | null>(
    selectedEmployee || null,
  );
  const [searchQuery, setSearchQuery] = React.useState('');
  const [employees, setEmployees] = React.useState<Employee[]>([]);

  const comboboxRef = React.useRef<HTMLDivElement | null>(null);

  React.useEffect(() => {
    if (allEmployees) {
      const sortedEmployees = [...allEmployees].sort((a, b) =>
        a.firstName.localeCompare(b.firstName),
      );
      setEmployees(sortedEmployees);
    }
    if (selectedEmployee) setValue(selectedEmployee);

    const handleClickOutside = (event: MouseEvent) => {
      if (
        comboboxRef.current &&
        !comboboxRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [allEmployees, selectedEmployee]);

  const filteredEmployees = React.useMemo(() => {
    if (!searchQuery.trim()) return employees;
    const query = searchQuery.toLowerCase();
    return employees.filter(employee => {
      // Concatenate fields into a single string for searching
      const combinedString =
        `${employee.employeeId} ${employee.firstName} ${employee.middleName} ${employee.lastName}`.toLowerCase();
      return combinedString.includes(query);
    });
  }, [employees, searchQuery]);

  const handleEmployeeSelect = (employee: Employee) => {
    setSearchQuery('');
    setValue(employee);
    setSelectedEmployee(employee);
    setOpen(false);
  };

  return (
    <div className="relative min-w-[300px]" ref={comboboxRef}>
      {/* Button or input for selection */}
      <Button
        variant="outline"
        role="combobox"
        aria-expanded={open ? 'true' : 'false'}
        onClick={() => setOpen(!open)}
        className="w-full justify-between"
      >
        {value
          ? capitalizeEachWord(
              `${value.firstName} ${value.middleName} ${value.lastName}`,
            )
          : 'Assign employee...'}
        <ChevronsUpDown className="ml-2 h-4 w-fit shrink-0 opacity-50" />
      </Button>

      {/* Dropdown content */}
      {open && (
        <div className="absolute left-0 right-0 mt-2 bg-white border rounded-md shadow-lg z-10">
          {isLoading ? (
            <div className="flex justify-center my-5">
              <Spinner />
            </div>
          ) : (
            <>
              <div className="flex items-center px-2 border-b">
                <Search className="mr-2 h-4 w-4 opacity-50" />
                <Input
                  className="w-full h-10 rounded-md bg-transparent py-3 text-sm shadow-none border-none focus:border-green-500 outline-none"
                  placeholder="Search Employee..."
                  onChange={e => setSearchQuery(e.target.value)}
                />
              </div>
              <div className="max-h-60 min-w-full flex flex-col gap-1 py-2 space-y-1 overflow-y-auto">
                {filteredEmployees.length > 0 ? (
                  filteredEmployees.map(employee => (
                    <div
                      key={employee.id}
                      className={`py-1 cursor-pointer hover:bg-gray-100 w-full ${
                        value === employee ? 'bg-gray-100' : ''
                      }`}
                      onClick={() => handleEmployeeSelect(employee)}
                    >
                      <div className="w-full flex items-center gap-2 text-sm">
                        <Check
                          className={cn(
                            'mx-2 h-5 w-5 opacity-0 transition-opacity duration-300',
                            value === employee ? 'opacity-100' : 'opacity-0',
                          )}
                        />
                        <div className="flex flex-col gap-1">
                          <span className="block text-nowrap">
                            {capitalizeEachWord(
                              `${employee.firstName} ${employee.middleName} ${employee.lastName}`,
                            )}
                          </span>
                          <div className="flex gap-4 text-xs text-gray-600">
                            <span>
                              {employee?.position?.name || 'Un-Specified'}
                            </span>
                            <span>{employee.employeeId}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-3 w-full text-gray-500 text-center text-sm">
                    No employee found.
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
