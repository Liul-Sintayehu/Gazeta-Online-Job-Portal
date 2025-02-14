import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/text-area';
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
import { PlusIcon } from 'lucide-react';
import AttachmentComponent from '@/app/_components/attachments/AttachmentComponent';
import YesOrNoDropdown from '@/app/_components/common/YesOrNoDropdown';
import { YesOrNo } from '@/app/_components/common/types';
import { toast } from 'sonner';
import { createWeapon } from '@/app/_lib/actions/weapon-alert';
import { WeaponRequestDto, weaponSchema } from '../../definitions';

interface AddWeaponProps {
  flightScheduleId: number;
  reloadData: () => void;
}

const AddWeapon = ({ flightScheduleId, reloadData }: AddWeaponProps) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [files, setFiles] = useState<File[]>([]);

  const form = useForm<WeaponRequestDto>({
    resolver: zodResolver(weaponSchema),
    defaultValues: {
      tagNumber: '',
      palateNumber: '',
      akeNumber: '',
      remark: undefined,
      isTransit: false,
      transitPassengerName: undefined,
      ticketNumber: undefined,
      contact: undefined,
    },
  });

  const isTransit = form.watch('isTransit');

  const onSubmit = async (data: WeaponRequestDto) => {
    setLoading(true);
    try {
      const requestform = new FormData();

      requestform.append('tagNumber', data.tagNumber);
      requestform.append('palateNumber', data.palateNumber);
      requestform.append('akeNumber', data.akeNumber);
      requestform.append('remark', data.remark ?? '');
      requestform.append('isTransit', String(data.isTransit));
      requestform.append(
        'transitPassengerName',
        data.transitPassengerName ?? '',
      );
      requestform.append('ticketNumber', data.ticketNumber ?? '');
      requestform.append('contact', data.contact ?? '');

      if (files?.length > 0) {
        requestform.append('attachment', files[0]);
      }

      const isSuccessful = await createWeapon({
        flightScheduleId,
        formData: requestform,
      });
      if (isSuccessful == true) {
        reloadData();
        reset();
        setIsDialogOpen(false);
        toast.success('Weapon added successfully!');
      } else {
        throw new Error('Failed to add the weapon!');
      }
    } catch (error: any) {
      toast.error(error.message ?? 'Failed to add the weapon!');
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    form.reset();
    setFiles([]);
  };

  return (
    <Dialog
      open={isDialogOpen}
      onOpenChange={isOpen => {
        setIsDialogOpen(isOpen);
        if (!isOpen) reset();
      }}
    >
      <DialogTrigger asChild>
        <Button
          className="hover:bg-green-600"
          onClick={() => setIsDialogOpen(true)}
        >
          <PlusIcon className="mr-2 h-4 w-fit" />
          Add
        </Button>
      </DialogTrigger>
      <DialogContent className="my-auto sm:max-w-[650px] bg-slate-50 rounded-xl font-inter">
        <DialogHeader>
          <DialogTitle>Add Weapon</DialogTitle>
          <DialogDescription>
            Adding new weapon to the list of registered weapons.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="grid grid-cols-2 gap-4"
          >
            {/* Tag Number */}
            <FormField
              name="tagNumber"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Tag Number{' '}
                    <span className="ml-1 text-xs text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      className="placeholder:text-gray-400"
                      placeholder="Enter tag number"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="text-red-500 text-xs" />
                </FormItem>
              )}
            />

            {/* Palate Number */}
            <FormField
              name="palateNumber"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Palate Number{' '}
                    <span className="ml-1 text-xs text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      className="placeholder:text-gray-400"
                      placeholder="Enter palate number"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="text-red-500 text-xs" />
                </FormItem>
              )}
            />

            {/* AKE Number */}
            <FormField
              name="akeNumber"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    AKE Number{' '}
                    <span className="ml-1 text-xs text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      className="placeholder:text-gray-400"
                      placeholder="Enter AKE number"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="text-red-500 text-xs" />
                </FormItem>
              )}
            />

            {/* Remark */}
            <FormField
              name="remark"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Remark</FormLabel>
                  <FormControl>
                    <Textarea
                      className="placeholder:text-gray-400"
                      placeholder="Enter any remarks"
                      rows={1}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="text-red-500 text-xs" />
                </FormItem>
              )}
            />

            {/* Is Transit */}
            <FormField
              name="isTransit"
              control={form.control}
              render={({ field }) => (
                <FormItem className="flex items-center space-x-3">
                  <FormLabel>Is Transit</FormLabel>
                  <FormControl>
                    <YesOrNoDropdown
                      selectedOption={field.value ? YesOrNo.Yes : YesOrNo.No}
                      onChange={option => {
                        field.onChange(option == YesOrNo.Yes);
                      }}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            {/* Conditional Transit Fields */}
            {isTransit && (
              <>
                {/* Transit Passenger Name */}
                <FormField
                  name="transitPassengerName"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Transit Passenger Name</FormLabel>
                      <FormControl>
                        <Input
                          className="placeholder:text-gray-400"
                          placeholder="Enter passenger name"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage className="text-red-500 text-xs" />
                    </FormItem>
                  )}
                />

                {/* Ticket Number */}
                <FormField
                  name="ticketNumber"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Ticket Number</FormLabel>
                      <FormControl>
                        <Input
                          className="placeholder:text-gray-400"
                          placeholder="Enter ticket number"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage className="text-red-500 text-xs" />
                    </FormItem>
                  )}
                />

                {/* Contact */}
                <FormField
                  name="contact"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Contact</FormLabel>
                      <FormControl>
                        <Input
                          className="placeholder:text-gray-400"
                          placeholder="Enter contact details"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage className="text-red-500 text-xs" />
                    </FormItem>
                  )}
                />
              </>
            )}

            <div className="col-span-2">
              {/* Attachment */}
              <FormField
                name="attachment"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Attachment</FormLabel>
                    <FormControl>
                      <AttachmentComponent onFileSelection={setFiles} />
                    </FormControl>
                    <FormMessage className="text-red-500 text-xs" />
                  </FormItem>
                )}
              />
            </div>

            <DialogFooter className="col-span-2">
              <DialogClose asChild>
                <Button
                  type="button"
                  className="text-white bg-slate-500 hover:bg-slate-600"
                >
                  Cancel
                </Button>
              </DialogClose>

              <Button type="submit" className="w-fit" disabled={loading}>
                {loading ? 'Submitting..' : 'Submit'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default AddWeapon;
