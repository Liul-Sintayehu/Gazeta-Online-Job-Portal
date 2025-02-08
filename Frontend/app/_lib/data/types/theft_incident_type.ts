import { Employee } from '@/app/_components/common/types';
import { Investigation } from './investigation_type';
import { Attachment } from '@/app/_components/attachments/types';

export interface Exhibit {
  itemType: string;
  model: string;
  identificationNumber: string;
}

export type TheftIncident = {
  id: number;
  incidentDate: string;
  incidentCategory: number;
  description: string;
  location: string;
  severity: number;
  incidentStatus: number;

  specificLocation: string;
  theftExplanation: string;
  discoveredDuringInspection: boolean;
  caughtInTheAct: boolean;
  onDuty: boolean;
  stolenItemCategory: number;
  tagNumber: string | null;
  airWaybillNumber: string | null;
  labelNumber: string | null;
  exhibits: Exhibit[];

  resolvedAt: string | null;
  resolution: string;
  comment: string | null;

  attachments: Attachment[];
  recordedByOfficer: Employee | null;
  investigations: Investigation[];
  registeredDate: Date;
  lastUpdateDate: Date;
};

export type CreateTheftIncident = {
  incidentDate: string;
  incidentCategory: number;
  description: string;
  location: string;
  severity: number;
  incidentStatus: number;

  specificLocation: string;
  theftExplanation: string;
  discoveredDuringInspection: boolean;
  caughtInTheAct: boolean;
  onDuty: boolean;

  stolenItemCategory: number;
  tagNumber: string | null;
  airWaybillNumber: string | null;
  labelNumber: string | null;
  exhibits: Exhibit[];

  isSuspectIdentified: boolean;
  suspectname: string | null;
  suspectDepartment: string | null;
  suspectSupervisorName: string | null;
};

export type TheftIncidentPaginatedResponse = {
  theftIncidentResponseDtos: TheftIncident[];
  totalCount: number;
};
