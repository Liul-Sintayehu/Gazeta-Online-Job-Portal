'use client';
import { Button } from '@/components/ui/button';
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
import { Eye } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import AttachmentList from '@/app/_components/attachments/AttachmentLists';
import { EntityType } from '@/app/_components/attachments/constant';
import { Weapon } from '../../types';
import Tooltip from '@/app/_components/helper/Tooltip';

export default function ViewWeaponDetail({
  weapon,
  reloadData,
}: {
  reloadData: () => void;
  weapon: Weapon;
}) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [weaponData, setWeaponData] = useState<Weapon | null>(null);

  useEffect(() => {
    if (weapon) {
      setWeaponData(weapon);
    }
  }, []);

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <Tooltip content="View Details" position="left" size="md">
          <Eye className="mr-2 h-4 w-4" onClick={() => setIsDialogOpen(true)} />
        </Tooltip>
      </DialogTrigger>
      <DialogContent className="font-inter mx-auto my-auto sm:max-w-[650px] max-h-[80%] overflow-y-scroll scrollbar-hide lg:max-w-screen-lg bg-white rounded-xl">
        <DialogHeader>
          <DialogTitle className="">Weapon Detail View</DialogTitle>
          <DialogDescription></DialogDescription>
        </DialogHeader>
        {weaponData == null ? (
          <h4>No weapon data found!</h4>
        ) : (
          <>
            <div className="mt-2 grid grid-cols-2 md:grid-cols-3 gap-4">
              <div className="flex gap-1 flex-col items-start">
                <span className="font-medium text-sm text-gray-500">
                  Tag Number
                </span>
                <span>{weaponData.tagNumber}</span>
              </div>
              <div className="flex gap-1 flex-col items-start">
                <span className="font-medium text-sm text-gray-500">
                  Palate Number
                </span>
                <span>{weaponData.palateNumber}</span>
              </div>
              <div className="flex gap-1 flex-col items-start">
                <span className="font-medium text-sm text-gray-500">
                  AKE Number
                </span>
                <span>{weaponData.akeNumber}</span>
              </div>
              <div className="flex gap-1 md:col-span-2 flex-col items-start">
                <span className="font-medium text-sm text-gray-500">
                  Remark
                </span>
                <span>{weaponData.remark ?? '---'}</span>
              </div>

              <div className="flex gap-1 flex-col items-start">
                <span className="font-medium text-sm text-gray-500">
                  Last Update
                </span>
                <span>
                  {new Date(weaponData.lastUpdateDate).toLocaleString()}
                </span>
              </div>
            </div>

            <div className="grid gap-1 grid-cols-1 mt-4">
              <AttachmentList
                attachments={weaponData.attachments}
                relatedEntityId={weaponData.id}
                relatedEntityType={EntityType.WeaponAlert}
                reload={reloadData}
              />
            </div>
          </>
        )}
        <DialogFooter className="gap-3 flex items-center">
          <DialogClose asChild>
            <Button
              type="button"
              className="text-white bg-slate-500 hover:bg-slate-600"
            >
              Close
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
