import { Employee } from '../../../_components/common/types';

export interface InjuryIncident {
  id: number;

  incidentDate: string;
  incidentCategory: number;
  description?: string;
  location?: string;
  severity: number;
  incidentStatus: number;

  name: string;
  phoneNumber: string;
  department: string;

  injuredBodyPart: string;
  injuryDescription: string;
  injuryCause: string;
  specificLocation: string;
  specificTime: string;

  isReported: boolean;
  resolvedAt?: string;
  resolution?: string;
  comment?: string;
  recordedByOfficer: Employee | null;
  registeredDate: string;
  lastUpdateDate: string;
}
export interface CreateInjuryIncident {
  id: number;

  incidentDate: string;
  incidentCategory: number;
  description?: string;
  location?: string;
  severity: number;
  incidentStatus: number;

  name: string;
  phoneNumber: string;
  department: string;

  injuredBodyPart: string;
  injuryDescription: string;
  injuryCause: string;
  specificLocation: string;
  specificTime: string;

  isReported: boolean;
  resolvedAt?: string;
  resolution?: string;
  comment?: string;
  recordedByOfficerId: string;
  registeredDate: string;
  lastUpdateDate: string;
}

export interface InjuryIncidentResponse {
  injuryIncidentResponseDtos: InjuryIncident[];
  totalCount: number;
}
