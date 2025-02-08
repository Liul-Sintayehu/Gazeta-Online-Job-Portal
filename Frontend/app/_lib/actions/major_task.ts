import { serverUrl } from '@/app/_services/envService';
import axios, { AxiosError } from 'axios';
import { getAuthHeaders } from '../utils';
import { redirect } from 'next/navigation';

interface Data {
  dataToSend: any;
}
interface DataSearch {
  dataToSearch: {
    name: string;
    description: string;
  };
}
interface DataDeleted {
  dataToDelete: {
    id: number;
  };
}
interface DataUpdated {
  dataToUpdate: any;
  id: number;
}
interface StatusUpdate {
  status: number;
  id: number;
}
const handleApiRequest = async <T>(
  method: 'POST' | 'PUT' | 'DELETE' | 'GET',
  url: string,
  data?: Record<string, any>,
  headers?: Record<string, string>,
  params?: Record<string, any>,
): Promise<T | string> => {
  try {
    const response = await axios({
      method,
      url,
      data,
      headers,
      params,
    });

    if (response.status === 200 || response.status === 201) {
      return response.data;
    }

    throw new Error('An unknown error occurred.');
  } catch (error: AxiosError | any) {
    if (error.response?.status === 401 || error.response?.status === 403) {
      redirect('/dashboard/403');
    }
    const errorMessage =
      error.response?.data?.errors?.[0] ||
      error.message ||
      'An unknown error occurred.';
    return errorMessage;
  }
};

export const CreateMajorTask = async (params: Data) => {
  const headers = await getAuthHeaders('MajorTask-Create');
  return handleApiRequest(
    'POST',
    `${serverUrl}/api/v1/MajorTask/Create`,
    params.dataToSend,
    headers,
  );
};

export const UpdateMajorTask = async ({ dataToUpdate, id }: DataUpdated) => {
  const headers = await getAuthHeaders('MajorTask-Update');
  return handleApiRequest(
    'PUT',
    `${serverUrl}/api/v1/MajorTask/Update/${id}`,
    dataToUpdate,
    headers,
  );
};

export const DeleteMajorTask = async (params: DataDeleted) => {
  const { id } = params.dataToDelete;
  const headers = await getAuthHeaders('MajorTask-Delete');
  return handleApiRequest(
    'DELETE',
    `${serverUrl}/api/v1/MajorTask/Delete/${id}`,
    undefined,
    headers,
  );
};

export const SearchMajorTask = async (params: DataSearch) => {
  const headers = await getAuthHeaders('MajorTask-Search');
  return handleApiRequest(
    'GET',
    `${serverUrl}/api/v1/MajorTask/Search`,
    undefined,
    headers,
    params.dataToSearch,
  );
};

export const UpdateMajorTaskStatus = async ({ id, status }: StatusUpdate) => {
  const headers = await getAuthHeaders('MajorTask-UpdateStatus');
  return handleApiRequest(
    'PUT',
    `${serverUrl}/api/v1/MajorTask/UpdateStatus/${id}`,
    { status },
    headers,
  );
};
