import { Employee } from '../../../_components/common/types';

import { Attachment } from '@/app/_components/attachments/types';
import {
  SuspectResponseDto,
  WitnessResponseDto,
} from '@/app/_components/incident-handling/investigations/types';

export interface BaggageIncident {
  id: number;
  incidentDate: string;
  incidentCategory: number;
  description: string;
  location: string;
  severity: number;
  incidentStatus: number;

  baggageIncidentType: number;
  baggageOrigin: string;
  hasTag: boolean;
  numberOfBags: number;
  bags: Bag[];

  isFoundOnAircraft: boolean;
  flightArrivalTime: string;
  flightBoardingCountry: string;
  flightArrivalCountry: string;
  flightArrivalAirport: string;
  aircraftTail: string;
  flightNumber?: string;

  passengerName: string;
  passengerPhoneNo: string;
  passengerEmail: string;

  handleStatus: number;

  resolvedAt: string | null;
  resolution: string;
  comment: string | null;
  recordedByOfficer: Employee | null;
  investigations: Investigation[];
  attachments: Attachment[];

  registeredDate: string;
  lastUpdateDate: string;
}

export interface Bag {
  palateNumber: string;
  tagNumber: string;
  akeNumber: string;
}

export const BaggageIncidentType = {
  None: 0,
  Damaged: 1,
  Tagless: 2,
  Pilfered: 4,
  Lost: 8,
} as const;

export type BaggageIncidentTypeKey = keyof typeof BaggageIncidentType;

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
  investigatorSignedOn: string | null;
  investigatorComment: string | null;

  teamLeaderId: number;
  teamLeader: Employee | null;
  teamLeaderSignaturePath: string | null;
  teamLeaderSignedOn: string | null;
  teamLeaderComment: string | null;

  witnesses: WitnessResponseDto[];
  suspects: SuspectResponseDto[];
  attachments: Attachment[];

  startDate: string;
  endDate: string;
  registrationDate: string;
  lastUpdateDate: string;
}

export interface IncidentDetails {
  id: number;
  incidentDate: string;
  incidentCategory: number;
  description: string;
  location: string;
  severity: number;
  incidentStatus: number;
  resolution: string;
  resolvedAt: string | null;
  remarks: string;
  recordedByOfficerId: number;
  recordedByOfficer: Employee;
}

export interface BaggageIncidentPaginatedResponse {
  baggageIncidents: BaggageIncident[];
  totalCount: number;
}
export interface InvestigationPaginatedResponses {
  investigationResponses: Investigation[];
  totalCount: number;
}

export interface FormErrors {
  id?: string;
  passengerName?: string;
  contact?: string;
  ticketNumber?: string;
  tagNumber?: string;
  flightNumber?: string;
  flightDate?: string;
  damageType?: string;
  incidentDate?: string;
}

export interface CreateBaggageIncidentRequestDto {
  incidentDate: string;
  description: string;
  location: string;
  severity: number;
  incidentStatus: number;

  baggageIncidentType: number;
  baggageOrigin: string;
  hasTag: boolean;
  numberOfBags: number;
  bags: Bag[];

  isFoundOnAircraft: boolean;
  flightArrivalTime?: string | null;
  flightBoardingCountry?: string | null;
  flightArrivalCountry?: string | null;
  flightArrivalAirport?: string | null;
  aircraftTail?: string | null;
  flightNumber?: string;

  passengerName?: string | null;
  passengerPhoneNo?: string | null;
  passengerEmail?: string | null;
}

export interface UpdateBaggageIncidentRequestDto {
  incidentDate: string;
  description: string;
  location: string;
  severity: number;
  incidentStatus: number;

  baggageIncidentType: number;
  baggageOrigin: string;
  hasTag: boolean;
  numberOfBags: number;
  bags: Bag[];

  isFoundOnAircraft: boolean;
  flightArrivalTime?: string | null;
  flightBoardingCountry?: string | null;
  flightArrivalCountry?: string | null;
  flightArrivalAirport?: string | null;
  aircraftTail?: string | null;
  flightNumber?: string;

  passengerName?: string | null;
  passengerPhoneNo?: string | null;
  passengerEmail?: string | null;

  handleStatus: number;

  resolvedAt?: string | null;
  resolution?: string;
  comment?: string | null;
}
