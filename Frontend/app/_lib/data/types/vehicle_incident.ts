import { Employee } from '../../../_components/common/types';
import { Investigation } from './investigation_type';

export interface VehicleIncident {
  id: number;

  incidentDate: string;
  incidentCategory: number;
  description?: string;
  location?: string;
  severity: number;
  incidentStatus: number;

  licensePlate: string;
  damagedPart: string;
  collisionObject: string;
  collidedVehicleLicensePlate?: string;
  alcoholTestConducted: boolean;
  alcoholTestResult?: boolean;
  alcoholAmount?: string;

  resolvedAt?: string;
  resolution?: string;
  comment?: string;

  recordedByOfficer: Employee | null;

  investigations: Investigation[];

  registeredDate: string;
  lastUpdateDate: string;
}
export interface VehicleIncidentResponse {
  vehicleIncidentResponse: VehicleIncident[];
  totalCount: number;
}
