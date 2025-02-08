import { z } from 'zod';

export const weaponSchema = z.object({
  tagNumber: z
    .string()
    .min(1, 'Tag number is required')
    .min(4, 'Please provide a valid tag number!'),
  palateNumber: z
    .string()
    .min(1, 'Palate number is required')
    .min(4, 'Please provide a valid palate number!'),
  akeNumber: z
    .string()
    .min(1, 'AKE number is required')
    .min(2, 'Please provide a valid ake number!'),
  remark: z.string().optional(),
  isTransit: z.boolean(),
  transitPassengerName: z.string().optional(),
  ticketNumber: z.string().optional(),
  contact: z.string().optional(),
  attachment: z.instanceof(File).optional(),
});

export type WeaponRequestDto = z.infer<typeof weaponSchema>;
