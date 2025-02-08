import { serverUrl } from '@/app/_services/envService';
import axios, { AxiosError } from 'axios';
import { getAuthHeaders } from '../utils';
import { redirect } from 'next/navigation';

interface MajorTask {
  id: number;
  name: string;
  description: string;
  recordStatus: number;
}
interface DataById {
  dataToFetch: {
    id: number; // Replace with the actual type if different
  };
}

// Define the interfaces for the employee, position, and assignment
interface Position {
  id: number | null;
  name: string | null;
  description: string | null;
  recordStatus: number | null;
}

interface AssignedEmployee {
  id: number | null;
  employeeId: string | null;
  firstName: string | null;
  middleName: string | null;
  lastName: string | null;
  email: string | null;
  shift: number | null;
  shiftName: string | null;
  firstSupId: string | null;
  positionId: number | null;
  position: Position | null;
  recordStatus: number | null;
}

interface AssignmentDto {
  assignmentId: number | null;
  assignedOn: string | null;
  status: number | null;
  priority: number | null;
  assignedEmployee: AssignedEmployee | null;
}

// Define the interfaces for major tasks and their assignments
interface MajorTaskDto {
  id: number | null;
  name: string | null;
  description: string | null;
  recordStatus: number | null;
}

interface MajorTasksWithAssignmentDtos {
  majorTaskDto: MajorTaskDto | null;
  assignmentDto: AssignmentDto | null;
}

// Define the interface for the flight schedule detail
interface FlightScheduleDetailDto {
  id: number | null;
  flightLegReferenceNumber: string | null;
  scheduledDepartureTime: string | null;
  carrier: string | null;
  flightNumber: string | null;
  suffix: string | null;
  latestDeparture: string | null;
  estimatedBlockOff: string | null;
  actualBlockOff: string | null;
  latestArrival: string | null;
  scheduledArrivalTime: string | null;
  estimatedBlockOn: string | null;
  actualBlockOn: string | null;
  aircraftType: string | null;
  aircraftRegistration: string | null;
  previousTail: string | null;
  departureGate: string | null;
  status: string | null;
  departureParkingStand: string | null;
  arrivalGate: string | null;
  arrivalParkingStand: string | null;
  recordStatus: number | null;
}

interface FlightScheduleResponse {
  flightScheduleDetailDto: FlightScheduleDetailDto | null;
  majorTasksWithAssignmentDtos: MajorTasksWithAssignmentDtos[] | null;
}

export const fetchMajorTask = async (): Promise<MajorTask[]> => {
  try {
    const headers = await getAuthHeaders('MajorTask-GetAll');

    const response = await axios.get<MajorTask[]>(
      `${serverUrl}/api/v1/MajorTask`,
      {
        headers,
      },
    );
    const data = response.data;

    return data;
  } catch (error: AxiosError | any) {
    if (error?.response?.status === 401 || error?.response?.status === 403) {
      redirect('/dashboard/403');
    }

    return [];
  }
};

export const fetchMajorTaskByFlightId = async (params: {
  dataToFetch: { id: number };
}): Promise<FlightScheduleResponse[]> => {
  try {
    const headers = await getAuthHeaders('MajorTask-GetById');

    const response = await axios.get<FlightScheduleResponse[]>(
      `${serverUrl}/api/v1/FlightTask/GetByFlightSceduleId`,
      {
        params: params.dataToFetch,
        headers,
      },
    );
    const data = response.data;

    return data;
  } catch (error: AxiosError | any) {
    if (error?.response?.status === 401 || error?.response?.status === 403) {
      redirect('/dashboard/403');
    }

    return [];
  }
};
