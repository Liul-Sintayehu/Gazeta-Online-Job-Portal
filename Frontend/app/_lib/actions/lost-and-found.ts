import { serverUrl } from '@/app/_services/envService';
import {
  LostAndFoundItemRequest,
  LostAndFoundItemResponse,
} from '@/components/ui/lost-and-found/type';
import axios, { AxiosError } from 'axios';
import { ActionResponse } from '../definitions';
import { redirect } from 'next/navigation';
import { getAuthHeaders } from '../utils';

interface CreateProps {
  data: LostAndFoundItemRequest;
}
interface UpdateProps {
  id: number;
  data: LostAndFoundItemRequest;
}
interface SignAgentProps {
  id: number;
  signature: File;
}

const handleApiRequest = async <T>(
  method: 'POST' | 'PUT' | 'DELETE',
  url: string,
  data?: LostAndFoundItemRequest,
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
    if (error.response?.status === 401 || error.response?.status === 403) {
      redirect('/dashboard/403');
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

export const createLostAndFound = async ({
  data,
}: CreateProps): Promise<ActionResponse<LostAndFoundItemResponse>> => {
  const headers = await getAuthHeaders('LostAndFoundItems-Create');
  return handleApiRequest<LostAndFoundItemResponse>(
    'POST',
    `${serverUrl}/api/v1/LostAndFoundItems/Create`,
    data,
    headers,
  );
};

export const updateLostAndFound = async ({
  id,
  data,
}: UpdateProps): Promise<ActionResponse<LostAndFoundItemResponse>> => {
  const headers = await getAuthHeaders('LostAndFoundItems-Update');
  return handleApiRequest<LostAndFoundItemResponse>(
    'PUT',
    `${serverUrl}/api/v1/LostAndFoundItems/Update/${id}`,
    data,
    headers,
  );
};

export const deleteLostAndFound = async (
  id: number,
): Promise<ActionResponse<LostAndFoundItemResponse>> => {
  const headers = await getAuthHeaders('LostAndFoundItems-Delete');
  return handleApiRequest<LostAndFoundItemResponse>(
    'DELETE',
    `${serverUrl}/api/v1/LostAndFoundItems/Delete/${id}`,
    undefined,
    headers,
  );
};

export const signAgent = async ({
  id,
  signature,
}: SignAgentProps): Promise<ActionResponse<LostAndFoundItemResponse>> => {
  try {
    const headers = await getAuthHeaders('LostAndFoundItems-SignAgent');
    const formData = new FormData();
    formData.append('Signature', signature);

    const response = await axios.post(
      `${serverUrl}/api/v1/LostAndFoundItems/SignAgent/${id}`,
      formData,
      {
        headers: {
          ...headers,
          'Content-Type': 'multipart/form-data',
        },
      },
    );

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
