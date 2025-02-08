'use client';

import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { UserRoundPlusIcon } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { EmployeeCombobox } from '../../common/EmployeeComboBox';
import { Employee, UpdateEmployeeAssignment } from '../../common/types';
import { fetchEmployees } from '@/app/_lib/data/employees';
import { assignOfficer } from '@/app/_lib/actions/weapon-alert';

export default function AssignOfficer({
  id,
  assignedEmployeeId,
  reloadData,
}: {
  id: number;
  assignedEmployeeId: string | null;
  reloadData: () => void;
}) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isEdit, setIsEdit] = useState<boolean>(false);

  const [employees, setEmployees] = useState<Employee[]>([]);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(
    null,
  );

  const handleAssign = async () => {
    try {
      setIsLoading(true);
      if (selectedEmployee) {
        const updateEmployeeAssignment: UpdateEmployeeAssignment = {
          id,
          assignedToEmployeeId: selectedEmployee.id,
        };

        const editResult: boolean = await assignOfficer(
          updateEmployeeAssignment,
        );

        if (editResult == true) {
          reloadData();
          toast.success('Officer assigned successfully!');
          setIsDialogOpen(false);
        } else {
          throw new Error();
        }
      }
    } catch (error: any) {
      toast.error(
        error.message ?? 'Failed to assigning officer, Please try again!',
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const fetchAllEmployees = async () => {
      const allEmployees: Employee[] = await fetchEmployees();
      const officers = allEmployees.filter(employee =>
        employee?.position?.name.includes('Officer'),
      );
      setEmployees(officers);
    };

    fetchAllEmployees();
  }, []);

  useEffect(() => {
    if (assignedEmployeeId && employees.length > 0) {
      setIsEdit(true);

      const employee = employees.find(
        employee =>
          employee.employeeId.replace(/^0+/, '') ===
          assignedEmployeeId.replace(/^0+/, ''),
      );
      if (employee) {
        setSelectedEmployee(employee);
      }
    }
  }, [assignedEmployeeId, employees]);

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <Button onClick={() => setIsDialogOpen(true)}>
          {isEdit ? (
            <>
              <UserRoundPlusIcon className="mr-2 h-4 w-fit" />
              Edit Officer
            </>
          ) : (
            <>
              <UserRoundPlusIcon className="mr-2 h-4 w-fit" />
              Assign Officer
            </>
          )}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] bg-slate-100 rounded-xl">
        <DialogHeader>
          <DialogTitle>
            {' '}
            {isEdit ? `Edit Assignment` : `Assigning`} Officer{' '}
          </DialogTitle>
          <DialogDescription>
            Assign officer to handle the weapon alert.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="employee" className="text-right">
              Employee List
            </Label>
            <EmployeeCombobox
              allEmployees={employees}
              selectedEmployee={selectedEmployee}
              setSelectedEmployee={setSelectedEmployee}
            />
          </div>
        </div>

        <DialogFooter className="gap-3 mt-6 flex items-center">
          <DialogClose asChild>
            <Button
              type="button"
              className="text-white bg-slate-500 hover:bg-slate-600"
            >
              Close
            </Button>
          </DialogClose>
          <Button type="button" onClick={handleAssign}>
            {`Assign${isLoading ? 'ing..' : ''}`}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
