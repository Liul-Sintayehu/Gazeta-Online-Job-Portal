export type User = {
  id: string;
  name: string;
  email: string;
  password: string;
  username: string;
  idToken: string;
  accessToken: string;
  roles: string;
  fingerprint?: string;
};

export type BreadCrumbs = {
  label: string;
  to: string;
  active?: boolean;
};

export type TokenProps = {
  accessToken: string;
  idToken: string;
};

export type ActionResponse<T = any> = {
  isSuccess: boolean;
  payload: T | null;
  errors: string[];
};

import { z } from 'zod';
import { ACCEPTED_IMAGE_TYPES, MAX_FILE_SIZE, phoneRegex } from './utils';

export const taskSchema = z.object({
  uid: z.string(),
  title: z.string(),
  status: z.string(),
  label: z.string(),
  priority: z.string(),
});

export type Task = z.infer<typeof taskSchema>;

export const AttroneyFormSchema = z.object({
  id: z.string(),
  firstname: z.string().min(1, { message: 'First Name is required' }), // Ensures the string is not empty
  lastname: z.string().min(1, { message: 'Last Name is required' }), // Ensures the string is not empty
  middlename: z.string().min(1, { message: 'Middle Name is required' }), // Ensures the string is not empty
  phonenumber: z.string().regex(phoneRegex, 'Invalid Phone Number!'), // Ensures the string is phone numeber
  email: z
    .string()
    .min(1, { message: 'This field has to be filled.' }) // Ensures the string is not empty
    .email('This is not a valid email.'), //Ensures whether it is a valid email
  userId: z.string().regex(phoneRegex, 'Invalid User ID!'), // Ensures the string is)

  //optional fields validate here
  areaofexpertise: z.string().nullable(),
  education: z.string().nullable(),
  experience: z.string().nullable(),
  barassociationinfo: z.string().nullable(),
  licenseinfo: z.string().nullable(),
  languages: z.string().nullable(),
  biography: z.string().nullable(),
  profilepicture: z
    .any()
    .refine(file => file.size === 0 || file.size <= MAX_FILE_SIZE, {
      message: 'Max image size is 5MB.',
    })
    .refine(
      file =>
        file.name === 'undefined' || ACCEPTED_IMAGE_TYPES.includes(file.type),
      {
        message: 'Only .jpg, .jpeg, .png and .webp formats are supported.',
      },
    ),
});

export type AttorneyState = {
  errors?: {
    firstname?: string[];
    middlename?: string[];
    lastname?: string[];
    userId?: string[];
    phonenumber?: string[];
    email?: string[];
    areaofexpertise?: string[];
    education?: string[];
    experience?: string[];
    barassociationinfo?: string[];
    licenseinfo?: string[];
    languages?: string[];
    biography?: string[];
    profilepicture?: string[];
  };
  submitError?: string | null;
  success?: string | null;
};

export const ContractDocFormSchema = z.object({
  id: z.string(),
  Title: z.string().min(1, { message: 'Title is required' }),
  DocumentStatus: z.string(),
  IsRecurring: z.boolean({
    invalid_type_error: 'IsRecurring should be boolean',
  }),
  RecurrenceInterval: z.number().nullable(),
  LocationId: z.number({
    invalid_type_error: 'contractTypes field is required',
  }),
  ContractingParty: z
    .string()
    .min(1, { message: 'Contracting Party is required' }),
  AttorneyId: z.any().refine((attorneys: string) => attorneys.length > 0, {
    message: 'At least one attorney is required to be selected',
  }),
  EffectiveFromDate: z.string().refine(date => new Date(date), {
    message: 'EffectiveFromDate should be a valid date',
  }),
  EffectiveToDate: z.string().refine(date => new Date(date), {
    message: 'EffectiveFromDate should be a valid date',
  }),
  NoticeDate: z.string().refine(date => new Date(date), {
    message: 'EffectiveFromDate should be a valid date',
  }),
  //optionals
  Description: z.string().nullable(),
  Remark: z.string().nullable(),
  SharePointLinkAddress: z.string().nullable(),
  //requireds
  ContractTypeId: z.number({
    invalid_type_error: 'contract Type field is required',
  }),
  Documents: z
    .any()
    .refine(
      (files?: any) =>
        files === null ||
        files.map((file: any) => file.size === 0 || file.size <= MAX_FILE_SIZE),
      {
        message: 'Each file size should be Max file size of 5MB.',
      },
    ),
});

export type ContractDocState = {
  errors?: {
    LocationId?: string[];
    ContractingParty?: string[];
    AttorneyId?: string[];
    Title?: string[];
    DocumentStatus?: string[];
    EffectiveFromDate?: string[];
    EffectiveToDate?: string[];
    Description?: string[];
    Remark?: string[];
    Documents?: string[];
    SharePointLinkAddress?: string[];
    ContractTypeId?: string[];
    IsRecurring?: string[];
    RecurrenceInterval?: string[];
    NoticeDate?: string[];
  };
  submitError?: string | null;
  success?: string | null;
};

export const dropZoneConfig = {
  maxFiles: 20,
  maxSize: 1024 * 1024 * 100,
  multiple: true,
};

export const ContractStatus = [
  { name: 'Draft', value: 0 },
  { name: 'Published', value: 1 },
  { name: 'Pending', value: 2 },
  { name: 'Terminated', value: 3 },
  { name: 'Archived', value: 4 },
  { name: 'In_Negotation', value: 5 },
  { name: 'Expired', value: 6 },
  { name: 'Reversed', value: 7 },
  { name: 'Superseded', value: 8 },
];
