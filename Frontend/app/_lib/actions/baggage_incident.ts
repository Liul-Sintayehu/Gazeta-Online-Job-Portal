import { serverUrl } from '@/app/_services/envService';
import axios, { AxiosError } from 'axios';
import { ActionResponse } from '../definitions';
import {
  BaggageIncident,
  CreateBaggageIncidentRequestDto,
} from '../data/types/baggage_types';
import { getAuthHeaders } from '../utils';

interface CreateProps {
  data: CreateBaggageIncidentRequestDto;
}
interface UpdateProps {
  id: number;
  data: any;
}
const handleApiRequest = async <T>(
  method: 'POST' | 'PUT' | 'DELETE',
  url: string,
  data?: any,
  headers?: Record<string, string>,
): Promise<ActionResponse<T>> => {
  try {
    const response = await axios({
      method,
      url,
      data,
      headers,
    });

    if (response.status === 200 || response.status === 201) {
      return {
        isSuccess: true,
        payload: response.data,
        errors: [],
      };
    }
    return {
      isSuccess: false,
      payload: null,
      errors: ['An unknown error occurred.'],
    };
  } catch (error: AxiosError | any) {
    if (error?.response?.status === 401 || error?.response?.status === 403) {
      return {
        isSuccess: false,
        payload: null,
        errors: ['Unauthorized to perform the action.'],
      };
    }

    const errors = error.response?.data?.errors || [
      error.message || 'An unknown error occurred.',
    ];
    return {
      isSuccess: false,
      payload: null,
      errors,
    };
  }
};

export const createBaggageIncident = async ({
  data,
}: CreateProps): Promise<ActionResponse<BaggageIncident>> => {
  const claim: string = 'BaggageIncident-Create';
  const headers = await getAuthHeaders(claim);
  return handleApiRequest<BaggageIncident>(
    'POST',
    `${serverUrl}/api/v1/BaggageIncident/Create`,
    data,
    headers,
  );
};

export const updateBaggageIncident = async ({
  id,
  data,
}: UpdateProps): Promise<ActionResponse<BaggageIncident>> => {
  const claim: string = 'BaggageIncident-Update';
  const headers = await getAuthHeaders(claim);
  return handleApiRequest<BaggageIncident>(
    'PUT',
    `${serverUrl}/api/v1/BaggageIncident/Update/${id}`,
    data,
    headers,
  );
};

export const deleteBaggageIncident = async (
  id: number,
): Promise<ActionResponse<BaggageIncident>> => {
  const claim: string = 'BaggageIncident-Delete';
  const headers = await getAuthHeaders(claim);
  return handleApiRequest<BaggageIncident>(
    'DELETE',
    `${serverUrl}/api/v1/BaggageIncident/Delete/${id}`,
    undefined,
    headers,
  );
};
