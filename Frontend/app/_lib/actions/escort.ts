import { serverUrl } from '@/app/_services/envService';
import axios, { AxiosError } from 'axios';
import { ActionResponse } from '../definitions';
import {
  CreateEscortRequestDto,
  EscortResponseDto,
  UpdateEscortRequestDto,
} from '@/components/ui/officer-assignment/escorts/types';
import { getAuthHeaders } from '../utils';

interface CreateProps {
  data: CreateEscortRequestDto;
}

interface UpdateProps {
  id: number;
  data: UpdateEscortRequestDto;
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

export const createEscort = async ({
  data,
}: CreateProps): Promise<ActionResponse<EscortResponseDto>> => {
  const claim: string = 'Escort-Create';
  const headers = await getAuthHeaders(claim);
  return handleApiRequest<EscortResponseDto>(
    'POST',
    `${serverUrl}/api/v1/Escort/Create`,
    data,
    headers,
  );
};

export const updateEscort = async ({
  id,
  data,
}: UpdateProps): Promise<ActionResponse<EscortResponseDto>> => {
  const claim: string = 'Escort-Update';
  const headers = await getAuthHeaders(claim);
  return handleApiRequest<EscortResponseDto>(
    'PUT',
    `${serverUrl}/api/v1/Escort/Update/${id}`,
    data,
    headers,
  );
};

export const deleteEscort = async (
  id: number,
): Promise<ActionResponse<boolean>> => {
  const claim: string = 'Escort-Delete';
  const headers = await getAuthHeaders(claim);
  return handleApiRequest<boolean>(
    'DELETE',
    `${serverUrl}/api/v1/Escort/Delete/${id}`,
    undefined,
    headers,
  );
};
