import { Button } from '@/components/ui/button';
import { Pencil, SquarePen } from 'lucide-react';
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
import { Label } from '@/components/ui/label';
import { StatusComboBox } from '../../common/StatusComboBox';
import { HandlingStatusUpdateForm } from '../types';
import { TaskStatus, TaskStatusValueMap } from '../../common/constants';
import { updateHandleStatus } from '@/app/_lib/actions/weapon-alert';

export default function UpdateHandleStatus({
  status,
  reload,
}: {
  status: HandlingStatusUpdateForm;
  reload: () => void;
}) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [statusUpdate, setStatusUpdate] =
    useState<HandlingStatusUpdateForm | null>(null);

  const handleStatusChange = (newStatus: string) => {
    const statusNumber = TaskStatusValueMap[newStatus];

    setStatusUpdate({
      id: status.id,
      handleStatus: statusNumber,
    });
  };

  const handleUpdateSubmit = async () => {
    setIsLoading(true);
    try {
      if (statusUpdate) {
        const isUpdated = await updateHandleStatus(statusUpdate);
        if (isUpdated == true) {
          reload();
          setIsDialogOpen(true);
          toast.success('Handle status updated successfully!');
        } else {
          throw new Error();
        }
      } else {
        toast.error('Please update the status first!');
      }
    } catch (error: any) {
      setIsDialogOpen(true);
      toast.error(
        error.message ??
          'Failed to update the handle status, please try again!',
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <Button>
          <Pencil className="me-2 w-fit h-4" />
          Update Status
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] bg-slate-100 rounded-xl">
        <DialogHeader>
          <DialogTitle>Weapon Alert Handling Status</DialogTitle>
          <DialogDescription>
            Please update the status of the weapon alert handling on time!
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="status" className="text-right">
              Handle Status
            </Label>
            <StatusComboBox
              currentStatus={TaskStatus[status.handleStatus]}
              onStatusChange={handleStatusChange}
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
          <Button
            type="button"
            onClick={handleUpdateSubmit}
            disabled={isLoading}
          >
            {isLoading ? 'Saving...' : 'Save'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
