import { WorkingShift } from '../common/types';

export type MasterDataDashboardResponseDto = {
  employeeCount: number;
  clearanceTaskCount: number;
  locationCount: number;
  postCount: number;
};

export type ClearanceDashboardResponseDto = {
  averageMinutes: number;
  approvedCount: number;
  assignedCount: number;
  unassignedCount: number;
};

export type WeaponAlertDashboardResponseDto = {
  onTime: number;
  late: number;
  notAssigned: number;
  totalWeapons: number;
};

export type IncidentDashboardResponseDto = {
  incident: string;
  count: number;
  investigation: number;
};

export type InvestigationDashboardResponseDto = {
  status: string;
  count: number;
};

export type OffloadBaggageDashboardResponseDto = {
  type: string;
  count: number;
};

export type EscortDashboardResponseDto = {
  type: string;
  count: number;
};

export type LostAndFoundDashboardResponseDto = {
  date: string;
  items: number;
  price: string;
  shift?: string;
  isConfirmed: boolean;
};
