import { serverUrl } from '@/app/_services/envService';
import axios, { AxiosError } from 'axios';
import { ActionResponse } from '../definitions';
import {
  CreateEscortAssignmentRequestDto,
  EscortAssignmentResponseDto,
  UpdateEscortAssignmentRequestDto,
} from '@/components/ui/officer-assignment/escorts/types';
import { getAuthHeaders } from '../utils';

interface CreateEscortAssignmentProps {
  data: CreateEscortAssignmentRequestDto;
}

interface UpdateEscortAssignmentProps {
  id: number;
  data: UpdateEscortAssignmentRequestDto;
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

export const createEscortAssignment = async ({
  data,
}: CreateEscortAssignmentProps): Promise<
  ActionResponse<EscortAssignmentResponseDto>
> => {
  const claim: string = 'EscortAssignment-Add';
  const headers = await getAuthHeaders(claim);
  return handleApiRequest<EscortAssignmentResponseDto>(
    'POST',
    `${serverUrl}/api/v1/EscortAssignment/Create`,
    data,
    headers,
  );
};

export const updateEscortAssignment = async ({
  id,
  data,
}: UpdateEscortAssignmentProps): Promise<
  ActionResponse<EscortAssignmentResponseDto>
> => {
  const claim: string = 'EscortAssignment-Update';
  const headers = await getAuthHeaders(claim);
  return handleApiRequest<EscortAssignmentResponseDto>(
    'PUT',
    `${serverUrl}/api/v1/EscortAssignment/Update/${id}`,
    data,
    headers,
  );
};

export const deleteEscortAssignment = async (
  id: number,
): Promise<ActionResponse<boolean>> => {
  const claim: string = 'EscortAssignment-Remove';
  const headers = await getAuthHeaders(claim);
  return handleApiRequest<boolean>(
    'DELETE',
    `${serverUrl}/api/v1/EscortAssignment/Delete/${id}`,
    undefined,
    headers,
  );
};
