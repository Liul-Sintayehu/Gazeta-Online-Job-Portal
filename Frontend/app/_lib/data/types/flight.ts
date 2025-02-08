import { Employee } from '@/app/_components/clearance/types';

interface Position {
  id: number;
  name: string;
  description: string;
  recordStatus: number;
}

interface TeamLeader {
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

interface FlightScheduleDetailDto {
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
  previousTail: string | null;
  departureGate: string;
  status: string;
  departureParkingStand: string;
  arrivalGate: string;
  arrivalParkingStand: string;
  recordStatus: number;
}

interface MajorTaskDetailDto {
  id: number;
  name: string;
  description: string;
  recordStatus: number;
}

interface MajorFlightTaskAssignment {}

interface Approval {
  id: number;
  majorFlightTaskAssignmentId: number;
  majorFlightTaskAssignment: MajorFlightTaskAssignment | null;
  employeeId: number;
  employee: Employee | null;
  positionId: number | null;
  position: Position | null;
  action: number;
  remark: string;

  registeredDate: string;
  lastUpdateDate: string;
  recordStatus: number;
}

interface FlightClearanceApproval {
  id: number;
  flightScheduleDetailDto: FlightScheduleDetailDto;
  majorTaskDetailDto: MajorTaskDetailDto;
  teamLeader: TeamLeader;
  teamLeaderApproval: Approval | null;
  pilotApproval: Approval | null;
  lastUpdate: string;
}

export interface FlightClearanceApprovalPaginatedResponse {
  flightApprovals: FlightClearanceApproval[];
  totalCount: number;
}

export default FlightClearanceApproval;
