import { serverUrl } from '@/app/_services/envService';
import axios, { AxiosError } from 'axios';
import { ActionResponse } from '../definitions';
import { GetPostAssignmentResponseDto } from '@/components/ui/officer-assignment/posts/types';
import { getAuthHeaders } from '../utils';
import { redirect } from 'next/navigation';

interface FetchPostAssignmentsProps {
  date: Date;
}

export const fetchPostAssignments = async (
  params: FetchPostAssignmentsProps,
): Promise<ActionResponse<GetPostAssignmentResponseDto[]>> => {
  try {
    const headers = await getAuthHeaders('PostAssignment-GetAll');

    const response = await axios.get<GetPostAssignmentResponseDto[]>(
      `${serverUrl}/api/v1/PostAssignment`,
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
    } else if (response.status === 201) {
      return {
        isSuccess: false,
        payload: null,
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
    if (error?.response?.status === 401 || error?.response?.status === 403) {
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
