'use client';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Send } from 'lucide-react';
import { useEffect, useState } from 'react';
import Tooltip from '../../helper/Tooltip';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/text-area';
import { toast } from 'sonner';
import { sendAlert } from '@/app/_lib/actions/weapon-alert';

export default function SendAlert({
  flightScheduleId,
  isError,
  hasData,
  isReadyToSend,
  oldRemark,
  reloadData,
}: {
  flightScheduleId: number;
  isReadyToSend: boolean;
  isError: boolean;
  hasData: boolean;
  oldRemark?: string;
  reloadData: () => void;
}) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [remark, setRemark] = useState<string | null>(oldRemark || null);

  const handleAlertSend = async () => {
    setIsLoading(true);
    try {
      const response = await sendAlert({
        flightScheduleId,
        remark: remark,
      });

      if (response == true) {
        setIsDialogOpen(false);
        toast.success('Weapon alert sent successfully!');
        reloadData();
      } else {
        throw Error('Failed to send alert!');
      }
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setIsLoading(false);
    setIsDialogOpen(false);
    setRemark('');
  };

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <Tooltip
        content={
          !hasData
            ? 'No weapon list to send!'
            : !isReadyToSend
            ? 'No updated change to resend the alert!'
            : 'Click here to send the alert.'
        }
        position="top"
        size="lg"
      >
        <Button
          onClick={() =>
            hasData && isReadyToSend && !isError && setIsDialogOpen(true)
          }
          disabled={!hasData || isError || !isReadyToSend}
        >
          <Send className="mr-2 h-4 w-fit" />
          Send Alert
        </Button>
      </Tooltip>
      <DialogContent className="sm:max-w-[600px] bg-slate-100 rounded-xl">
        <DialogHeader>
          <DialogTitle className="">Weapon Alert Confirmation</DialogTitle>
          <DialogDescription>
            <span className="text-md text-center">
              Are you sure you want to send the alert for the weapons?
            </span>
            <span className="mt-4 px-4 py-2 block w-full text-yellow-600 bg-yellow-100 border-l-2 border-l-yellow-500 rounded-e-small shadow-sm">
              You can not revert the action once confirmed!
            </span>
          </DialogDescription>
        </DialogHeader>
        {/* Form Fields */}
        <div className="grid gap-4 py-4 px-2">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="remark" className="text-right">
              Remark
            </Label>
            <Textarea
              name="remark"
              value={remark ?? ''}
              onChange={e => {
                setRemark(e.target.value);
              }}
              className={`col-span-3 focus:border-green-600 border`}
            />
          </div>
        </div>
        <DialogFooter className="gap-3 flex items-center">
          <Button
            type="button"
            className="text-white bg-slate-500 hover:bg-slate-600"
            onClick={handleClose}
          >
            Cancel
          </Button>
          <Button disabled={isLoading} onClick={handleAlertSend}>
            {isLoading ? 'Submitting...' : 'Confirm'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
