'use client';
import { useEffect, useState } from 'react';
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
import { Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { FetchParameter, Weapon } from '../../types';
import { deleteWeapon } from '@/app/_lib/actions/weapon-alert';
import { toast } from 'sonner';
import Tooltip from '@/app/_components/helper/Tooltip';

export default function DeleteWeapon({
  weapon,
  reloadData,
}: {
  weapon: Weapon;
  reloadData: () => void;
}) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleDeleteWeapon = async () => {
    setIsLoading(true);

    try {
      const isSuccessful = await deleteWeapon({ id: weapon.id });
      if (isSuccessful == true) {
        setIsDialogOpen(false);
        toast.success('Weapon deleted successfully!');
        reloadData();
      } else {
        throw new Error('Failed to delete the weapon!');
      }
    } catch (error: any) {
      toast.error(error.message ?? 'Failed to delete the weapon!');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <Tooltip content="Delete Weapon" position="left" size="md">
          <Trash2
            className="mr-2 h-4 w-4"
            onClick={() => setIsDialogOpen(true)}
          />
        </Tooltip>
      </DialogTrigger>
      <DialogContent className="font-inter sm:max-w-[600px] bg-slate-100 rounded-xl">
        <DialogHeader>
          <DialogTitle>Weapon Delete Confirmation</DialogTitle>
          <DialogDescription className="text-md font-semibold">
            Are you sure you want to delete the weapon with the following
            properties?
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col justify-center items-center">
          <div className="grid gap-4 grid-cols-2 items-center">
            <span className="text-right">Tag Number: </span>
            <span className="text-lg font-semibold">{weapon.tagNumber}</span>
          </div>
          <div className="grid gap-4 grid-cols-2 items-center">
            <span className="text-right">Palate Number: </span>
            <span className="text-lg font-semibold">{weapon.palateNumber}</span>
          </div>
          <div className="grid gap-4 grid-cols-2 items-center">
            <span className="text-right">AKE Number: </span>
            <span className="text-lg font-semibold">{weapon.akeNumber}</span>
          </div>
        </div>
        <DialogFooter className="gap-3 flex items-center">
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
            className="text-white bg-red-500 hover:bg-red-600"
            onClick={handleDeleteWeapon}
          >
            {isLoading ? 'Deleting...' : 'Confirm'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
