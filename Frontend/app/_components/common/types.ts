export interface FlightDataSearch {
  flightNumber: string | null;
  departure: string | null;
  arrival: string | null;
  aircraftType: string | null;
  airCraftRegistration: string | null;
  pageSize: number;
  pageNumber: number;
  scheduledDepartureTime: Date | null;
}

export interface FlightScheduleDetailDto {
  id: number;
  flightLegReferenceNumber: string;
  scheduledDepartureTime: string;
  carrier: string;
  flightNumber: string;
  suffix: string;
  latestDeparture: string;
  estimatedBlockOff: string;
  actualBlockOff: string;
  latestArrival: string;
  scheduledArrivalTime: string;
  estimatedBlockOn: string;
  actualBlockOn: string;
  aircraftType: string;
  aircraftRegistration: string;
  tail: string;
  previousTail: string;
  departureGate: string;
  status: string;
  departureParkingStand: string;
  arrivalGate: string;
  arrivalParkingStand: string;
  recordStatus: number;
  registeredDate: string;
  lastUpdateDate: string;
}

export interface FlightScheduleResponseDto {
  flights: FlightScheduleDetailDto[]; // Adjust to match your actual flight schedule DTO
  totalCount: number; // Add total count
}

// PositionDto
export interface Position {
  id: number;
  name: string;
  description: string;
  recordStatus: number;
}

// EmployeeDto
export interface Employee {
  id: number;
  employeeId: string;
  firstName: string;
  middleName: string;
  lastName: string;
  email: string;
  shift: number;
  shiftName: string;
  firstSupId: string;
  positionId: number;
  position: Position;
  recordStatus: number;
}

export type EmployeeAssignment = {
  id: number;
  assignedToEmployeeId: number;
};

export type UpdateEmployeeAssignment = {
  id: number;
  assignedToEmployeeId: number;
};

export enum YesOrNo {
  Yes = 'Yes',
  No = 'No',
}

export type YesOrNoType = YesOrNo;

export const YesOrNoToBoolean = (value: YesOrNoType): boolean =>
  value === YesOrNo.Yes;

export enum WorkingShift {
  Day = 1,
  Evening = 2,
  Night = 3,
}

// Define shift ranges as objects
export const SHIFTS = [
  {
    shift: WorkingShift.Day,
    start: { hour: 8, minute: 0 },
    end: { hour: 16, minute: 0 },
  }, // 8:00 AM - 4:00 PM
  {
    shift: WorkingShift.Evening,
    start: { hour: 16, minute: 0 },
    end: { hour: 0, minute: 0 },
  }, // 4:00 PM - Midnight
  {
    shift: WorkingShift.Night,
    start: { hour: 0, minute: 0 },
    end: { hour: 8, minute: 0 },
  }, // Midnight - 8:00 AM
];
