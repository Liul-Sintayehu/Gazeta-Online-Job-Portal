import { serverUrl } from '@/app/_services/envService';
import axios, { AxiosError } from 'axios';
import {
  FlightApprovalReportPaginatedResponseDto,
  GetFlightClearanceApprovalReportQueryDto,
} from '@/components/ui/flightschedule/types';
import { ActionResponse } from '../definitions';
import { redirect } from 'next/navigation';
import { getAuthHeaders } from '../utils';

export const flightLevelApproval = async (
  params: GetFlightClearanceApprovalReportQueryDto,
): Promise<ActionResponse<FlightApprovalReportPaginatedResponseDto>> => {
  try {
    const headers = await getAuthHeaders(
      'ClearanceAssignment-GetApprovalReport',
    );
    const response = await axios.get<FlightApprovalReportPaginatedResponseDto>(
      `${serverUrl}/api/v1/ClearanceAssignment/GetApprovalReports`,
      {
        params,
        headers,
      },
    );

    if (response.status === 200) {
      return {
        isSuccess: true,
        payload: response.data,
        errors: [],
      };
    } else {
      return {
        isSuccess: false,
        payload: null,
        errors: ['An unknown error occurred.'],
      };
    }
  } catch (error: AxiosError | any) {
    if (error.response?.status === 401 || error.response?.status === 403) {
      redirect('/dashboard/403');
    }

    if (error.response && error.response.data) {
      return {
        isSuccess: false,
        payload: null,
        errors: error.response.data.errors,
      };
    } else if (error.message) {
      return {
        isSuccess: false,
        payload: null,
        errors: [error.message],
      };
    } else {
      return {
        isSuccess: false,
        payload: null,
        errors: ['An unknown error occurred.'],
      };
    }
  }
};
