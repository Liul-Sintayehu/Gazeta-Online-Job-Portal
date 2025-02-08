import axios from 'axios';
import { serverUrl } from '@/app/_services/envService';
import {
  FlightMajorTaskAssignmentDto,
  FetchParameter,
  SubTaskAssignment,
  Employee,
} from '@/app/_components/clearance/types';
import {
  FlightClearanceApprovalReportPaginatedResponseDto,
  FlightClearanceAssignmentQuery,
  FlightClearanceAssignmentResponseDto,
} from '@/components/ui/flightschedule/types';
import { getAuthHeaders } from '../utils';
import { redirect } from 'next/navigation';

export const fetchClearanceAssignmentList = async (
  params: FlightClearanceAssignmentQuery,
): Promise<FlightClearanceApprovalReportPaginatedResponseDto> => {
  try {
    const headers = await getAuthHeaders('ClearanceAssignment-GetAll');

    const response =
      await axios.get<FlightClearanceApprovalReportPaginatedResponseDto>(
        `${serverUrl}/api/v1/ClearanceAssignment/GetAll`,
        {
          params,
          headers,
        },
      );

    if (response.status === 200) {
      return response.data;
    } else {
      throw new Error('Failed to fetch flights with their assignments.');
    }
  } catch (error: any) {
    // Handle 401 or 403 status codes for redirection
    if (error?.response?.status === 401 || error?.response?.status === 403) {
      redirect('/dashboard/403');
    }

    if (error?.response?.status === 404) {
      throw new Error('404 | Not Found');
    } else if (error.response && error.response.data) {
      return error.response.data.errors[0] || 'An error occurred.';
    } else if (error.message) {
      return error.message;
    } else {
      throw new Error('An unknown error occurred.');
    }
  }
};

export const fetchClearanceAssignment = async (
  id: number,
): Promise<FlightClearanceAssignmentResponseDto | undefined> => {
  try {
    const headers = await getAuthHeaders('ClearanceAssignment-GetById');

    const response = await axios.get<FlightClearanceAssignmentResponseDto>(
      `${serverUrl}/api/v1/ClearanceAssignment/GetById/${id}`,
      {
        headers,
      },
    );
    return response.data;
  } catch (error: any) {
    if (error?.response?.status === 401 || error?.response?.status === 403) {
      redirect('/dashboard/403');
    }
    return undefined;
  }
};

export const fetchAllSubTaskWithAssignment = async (
  clearanceAssignmentId: number,
): Promise<SubTaskAssignment[]> => {
  try {
    const headers = await getAuthHeaders('SubTaskAssignment-GetAll');

    const response = await axios.get<SubTaskAssignment[]>(
      `${serverUrl}/api/v1/SubTaskAssignment/GetAll/${clearanceAssignmentId}`,
      {
        headers,
      },
    );

    return response.data;
  } catch (error: any) {
    if (error?.response?.status === 401 || error?.response?.status === 403) {
      redirect('/dashboard/403');
    }
    throw new Error('Failed to fetch sub-task assignments.');
  }
};

export const fetchPilot = async (
  clearanceAssignmentId: number,
): Promise<Employee> => {
  try {
    const headers = await getAuthHeaders('ClearanceAssignment-GetPilot');

    const response = await axios.get<Employee>(
      `${serverUrl}/api/v1/ClearanceAssignment/GetPilot/${clearanceAssignmentId}`,
      {
        headers,
      },
    );

    return response.data;
  } catch (error: any) {
    if (error?.response?.status === 401 || error?.response?.status === 403) {
      redirect('/dashboard/403');
    }
    throw new Error('Failed to fetch pilot in command.');
  }
};

export const fetchPilotInCommand = async ({
  majorFlightTaskAssignmentId,
}: {
  majorFlightTaskAssignmentId: number;
}): Promise<Employee> => {
  try {
    const response = await axios.get<Employee>(
      `${serverUrl}/api/v1/FlightTask/GetPilotInCommand/${majorFlightTaskAssignmentId}`,
    );

    return response.data;
  } catch (error) {
    throw new Error('Failed to fetch sub-task assignments.');
  }
};

export const fetchClearanceAssignmentDetail = async (
  params: FetchParameter,
): Promise<FlightMajorTaskAssignmentDto | undefined> => {
  try {
    const response = await axios.get<FlightMajorTaskAssignmentDto>(
      `${serverUrl}/api/v1/ClearanceTask/GetAllClearanceTasks/${params.clearanceAssignmentId}`,
    );

    return response.data;
  } catch (error) {
    return undefined;
  }
};
