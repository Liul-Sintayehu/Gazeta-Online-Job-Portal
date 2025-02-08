// FlightScheduleDetailDto.ts
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
  previousTail: string | null;
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

export interface FlightDataSearch {
  flightNumber?: string | null;
  departure?: string | null;
  arrival?: string | null;
  aircraftType?: string | null;
  airCraftRegistration?: string | null;
  pageSize: number; // Page size for pagination
  pageNumber: number; // Page number for pagination
  scheduledDepartureTime?: Date | null;
}
