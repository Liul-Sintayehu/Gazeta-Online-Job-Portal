import { Employee } from '@/app/_components/common/types';
import { BaggageIncident } from './baggage_types';
export interface IncidentDetails {
    id: number;
    incidentDate: string; // ISO Date String
    incidentCategory: number;
    description: string;
    location: string;
    severity: number;
    incidentStatus: number;
    resolution: string;
    resolvedAt: string | null; // ISO Date String or null
    remarks: string;
    recordedByOfficerId: number;
    recordedByOfficer: Employee;
  }
export interface Investigation {
  id: number;
  incident: IncidentDetails;
  investigationMethod: string;
  mainIssue: string;
  findings: string;
  rootCause: string;
  recommendations: string;
  correctiveActions: string;
  isLegalInvolved: boolean;
  legalFindings: string | null;
  regulatoryViolations: string | null;
  outcome: string | null;
  finalResolution: string;
  status: number;
  investigatorId: number;
  investigator: Employee;
  investigatorSignaturePath: string | null;
  investigatorSignedOn: string | null; // ISO Date String or null
  investigatorComment: string | null;
  teamLeaderId: number;
  teamLeader: Employee | null;
  teamLeaderSignaturePath: string | null;
  teamLeaderSignedOn: string | null; // ISO Date String or null
  teamLeaderComment: string | null;
  witnesses: any[]; // Array of witness details if available
  suspects: any[]; // Array of suspect details if available
}