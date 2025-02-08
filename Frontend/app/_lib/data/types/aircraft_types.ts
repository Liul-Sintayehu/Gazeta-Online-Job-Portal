import { Attachment } from '@/app/_components/attachments/types';
import { Employee } from '@/app/_components/common/types';
import { Investigation } from '@/app/_components/incident-handling/investigations/types';

export interface AircraftIncident {
  incidentDate: Date; // Date type for datetime
  description?: string; // Optional string
  location?: string; // Optional string
  severity: number; // Enum type
  flightParkingPosition: string; // Required string
  departureCountry: string; // Required string
  arrivalCountry: string; // Required string
  flightNumber: string; // Required string
  flightRegistration: string; // Required string
  damageDirection: string; // Required string
  damagedPart: string; // Required string
  aircraftCondition: string; // Required string
  maintenanceDuration: string; // Represent TimeSpan as string (e.g., 'PT2H30M')
  recordedByOfficerId: number; // Long (number in TypeScript)
}

export interface AirCraftIncidentResponseDto {
  id: number;

  incidentDate: string;
  incidentCategory: number;
  description?: string;
  location?: string;
  severity: number;
  incidentStatus: number;

  flightParkingPosition: string;
  departureCountry: string;
  arrivalCountry: string;
  flightNumber: string;
  flightRegistration: string;
  damageDirection: string;
  damagedPart: string;
  aircraftCondition: string;
  maintenanceStartDate?: string;
  maintenanceEndDate?: string;

  resolvedAt?: string;
  resolution?: string;
  comment?: string;

  attachments: Attachment[];

  recordedByOfficer: Employee;

  investigations: Investigation[];

  registeredDate: string;
  lastUpdateDate: string;
}

export interface CreateAirCraftIncidentRequest {
  incidentDate: string;
  description?: string;
  location?: string;
  severity: number;

  flightParkingPosition: string;
  departureCountry: string;
  arrivalCountry: string;
  flightNumber: string;
  flightRegistration: string;
  damageDirection: string;
  damagedPart: string;
  aircraftCondition: string;

  maintenanceStartDate?: string;
  maintenanceEndDate?: string;
}

export interface UpdateAirCraftIncidentRequest {
  incidentDate: string;
  description?: string;
  location?: string;
  severity: number;

  flightParkingPosition: string;
  departureCountry: string;
  arrivalCountry: string;
  flightNumber: string;
  flightRegistration: string;
  damageDirection: string;
  damagedPart: string;
  aircraftCondition: string;

  maintenanceStartDate?: string | null;
  maintenanceEndDate?: string | null;

  incidentStatus: number;
  resolution?: string;
  remark?: string;
}

export interface AirCraftIncidentPaginatedResponse {
  airCraftIncidentResponse: AirCraftIncidentResponseDto[];
  totalCount: number;
}
