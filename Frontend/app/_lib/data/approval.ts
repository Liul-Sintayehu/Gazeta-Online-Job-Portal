import {
  ApprovalsWithStatus,
  LatestApprovalLog,
} from '@/app/_components/clearance/types';
import { serverUrl } from '@/app/_services/envService';
import { ClearanceAssignmentApprovalResponseDto } from '@/components/ui/flightschedule/types';
import axios from 'axios';
import { redirect } from 'next/navigation';
import { getAuthHeaders } from '../utils';

export const fetchLatestApprovals = async (
  clearanceAssignmentId: number,
): Promise<ClearanceAssignmentApprovalResponseDto> => {
  try {
    const headers = await getAuthHeaders('ClearanceAssignment-GetApprovals');

    const response = await axios.get<ClearanceAssignmentApprovalResponseDto>(
      `${serverUrl}/api/v1/ClearanceAssignment/GetApprovals/${clearanceAssignmentId}`,
      {
        headers,
      },
    );

    return response.data;
  } catch (error: any) {
    if (axios.isAxiosError(error)) {
      if (error.response) {
        if (error.response.status == 401 || error.response.status === 403) {
          redirect('/dashboard/403');
        }
        throw new Error(
          `Error: ${error.response.status} - ${error.response.data}`,
        );
      } else if (error.request) {
        throw new Error('No response from server.');
      } else {
        throw new Error('Request setup error.');
      }
    } else {
      throw new Error('An unexpected error occurred.');
    }
  }
};

export const fetchLatestApprovalLog = async (
  majorFlightTaskAssignmentId: number,
): Promise<LatestApprovalLog[]> => {
  try {
    const headers = await getAuthHeaders('ClearanceTask-GetAll');

    const response = await axios.get<LatestApprovalLog[]>(
      `${serverUrl}/api/v1/ClearanceTask/GetLatestApprovalLog/${majorFlightTaskAssignmentId}`,
      {
        headers,
      },
    );

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response) {
        throw new Error(
          `Error: ${error.response.status} - ${error.response.data}`,
        );
      } else if (error.request) {
        throw new Error('No response from server.');
      } else {
        throw new Error('Request setup error.');
      }
    } else {
      throw new Error('An unexpected error occurred.');
    }
  }
};

export const fetchLatestApprovalWithStatus = async (
  majorFlightTaskAssignmentId: number,
): Promise<ApprovalsWithStatus> => {
  try {
    const response = await axios.get<ApprovalsWithStatus>(
      `${serverUrl}/api/v1/ClearanceTask/GetLatestApprovalWithStatus/${majorFlightTaskAssignmentId}`,
    );

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response) {
        throw new Error(
          `Error: ${error.response.status} - ${error.response.data}`,
        );
      } else if (error.request) {
        throw new Error('No response from server.');
      } else {
        throw new Error('Request setup error.');
      }
    } else {
      throw new Error('An unexpected error occurred.');
    }
  }
};
