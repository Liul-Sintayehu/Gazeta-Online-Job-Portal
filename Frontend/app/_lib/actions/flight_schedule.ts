import { serverUrl } from '@/app/_services/envService';
import axios from 'axios';
import { getAuthHeaders } from '../utils';
import { redirect } from 'next/navigation';

interface ClearanceAssignmentRequest {
  flightScheduleId: number;
  employeeId: number;
}

export const createClearanceAssignment = async (
  params: ClearanceAssignmentRequest,
) => {
  try {
    const headers = await getAuthHeaders('ClearanceAssignment-Create');

    const response = await axios.post(
      `${serverUrl}/api/v1/ClearanceAssignment/Create`,
      {
        flightScheduleId: params.flightScheduleId,
        employeeId: params.employeeId,
      },
      {
        headers,
      },
    );

    if (response.status === 200 || response.status === 204) {
      return { success: true, message: response.data };
    } else {
      return { success: false, message: 'Failed to assign the assignment.' };
    }
  } catch (error: any) {
    if (error?.response?.status === 401 || error?.response?.status === 403) {
      redirect('/dashboard/403');
    }
    if (error.response && error.response.data) {
      return {
        success: false,
        message: error.response.data.errors[0] || 'An error occurred.',
      };
    } else if (error.message) {
      return { success: false, message: error.message };
    } else {
      return { success: false, message: 'An unknown error occurred.' };
    }
  }
};

export const deleteClearanceAssignment = async (id: number) => {
  try {
    const headers = await getAuthHeaders('ClearanceAssignment-Delete');
    const response = await axios.delete(
      `${serverUrl}/api/v1/ClearanceAssignment/Delete/${id}`,
      {
        headers,
      },
    );

    if (response.status === 200 || response.status === 204) {
      return { success: true, message: response.data };
    } else {
      return { success: false, message: 'Failed to delete the assignment.' };
    }
  } catch (error: any) {
    if (error?.response?.status === 401 || error?.response?.status === 403) {
      redirect('/dashboard/403');
    }
    if (error.response && error.response.data) {
      return {
        success: false,
        message: error.response.data.errors[0] || 'An error occurred.',
      };
    } else if (error.message) {
      return { success: false, message: error.message };
    } else {
      return { success: false, message: 'An unknown error occurred.' };
    }
  }
};
