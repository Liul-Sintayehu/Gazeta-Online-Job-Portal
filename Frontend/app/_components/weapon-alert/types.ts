import {
  Employee,
  FlightScheduleDetailDto,
} from '@/app/_components/common/types';
import { Attachment } from '../attachments/types';

/**
 * REQUEST
 */
export interface FetchParameter {
  flightScheduleId: number;
}

export type WeaponFormData = {
  id: number;
  tagNumber: string;
  palateNumber: string;
  akeNumber: string;
  remark?: string;
};

export type AddWeaponRequestForm = {
  flightScheduleId: number;

  tagNumber: string;
  palateNumber: string;
  akeNumber: string;
  remark?: string;

  isTransit: boolean;
  transitPassengerName?: string;
  ticketNumber?: string;
  contact?: string;

  attachment: File[];
};

export type EditWeaponRequestForm = {
  id: number;
  tagNumber: string;
  palateNumber: string;
  akeNumber: string;
  remark?: string;
  attachment: File[];
};

export type DeleteWeaponRequestForm = {
  id: number;
};

export type SendAlertRequestForm = {
  flightScheduleId: number;
  remark: string | null;
};

export type HandlingStatusUpdateForm = {
  id: number;
  handleStatus: number;
};

// Response
export type Weapon = {
  id: number;
  tagNumber: string;
  palateNumber: string;
  akeNumber: string;
  isAlertSent?: boolean;
  remark?: string;

  isTransit: boolean;
  transitPassengerName?: string;
  ticketNumber?: string;
  contact?: string;

  attachmentFilePath?: string;
  attachments: Attachment[];
  lastUpdateDate: string;
};

export type WeaponHandlingResponse = {
  id: number;
  remark: string | null;
  isSent: boolean;
  alertSentOn: string;
  isReadyToResend?: boolean;
  alertResentOn?: string;

  assignedOn?: string;
  assignedBy: Employee | null;
  responsibleOfficer: Employee | null;
  assignUpdateOn: string;

  handleStatus: number;
  handleStatusLastUpdate: string;
  completedOn: string;

  escalationCount: number;
  reminderSentOn: string;
  firstEscalationSentOn: string;
  secondEscalationSentOn: string;

  flightSchedule: FlightScheduleDetailDto;

  registeredDate: string;
  lastUpdateDate: string;
};

export type AllWeaponAlertHandlingResponse = {
  weaponAlertHandling: WeaponHandlingResponse[];
  totalCount: number;
};

export type FlightQueryParams = {
  departureDateTime: Date | null;
  flightNumber: string | null;
  departureStation: string | null;
  arrivalStation: string | null;
  isSent: boolean | null;
  assignedStatus: AlertStatusType | number | null;
  handleStatus: number | null;
  airCraftRegistration: string | null;
  tagNumber: string | null;
  pageSize: number;
  pageNumber: number;
};

export enum AlertStatusType {
  NotAssigned = 1,
  Late,
  OnTime,
}

export const AlertStatusTypeMapping: Record<AlertStatusType, string> = {
  [AlertStatusType.NotAssigned]: 'Not Assigned',
  [AlertStatusType.Late]: 'Late',
  [AlertStatusType.OnTime]: 'On Time',
};

export const AlertStatusTypeReverseMapping: Record<string, AlertStatusType> = {
  'Not Arrived Yet': AlertStatusType.NotAssigned,
  'On Time': AlertStatusType.OnTime,
  Late: AlertStatusType.Late,
};
