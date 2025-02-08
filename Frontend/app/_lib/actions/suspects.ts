import { SuspectRequestDto } from '@/app/_components/incident-handling/investigations/types';
import { serverUrl } from '@/app/_services/envService';
import axios from 'axios';
import { getAuthHeaders } from '../utils';
import { redirect } from 'next/navigation';

export const createSuspect = async ({
  investigationId,
  suspectRequest,
}: {
  investigationId: number;
  suspectRequest: SuspectRequestDto;
}): Promise<boolean> => {
  try {
    const headers = await getAuthHeaders('Suspect-Create');
    const formData = new FormData();

    formData.append('Name', suspectRequest.name ?? '');
    formData.append('Department', suspectRequest.department ?? '');
    formData.append('EmployeeId', suspectRequest.employeeId ?? '');
    formData.append(
      'PersonalPhoneNumber',
      suspectRequest.personalPhoneNumber ?? '',
    );
    formData.append('WorkPhoneNumber', suspectRequest.workPhoneNumber ?? '');
    formData.append('SupervisorName', suspectRequest.supervisorName ?? '');
    formData.append(
      'IsPrimarySuspect',
      suspectRequest.isPrimarySuspect as unknown as string,
    );
    formData.append(
      'DateIdentified',
      suspectRequest.dateIdentified
        ? suspectRequest.dateIdentified?.toISOString()
        : '',
    );

    if (suspectRequest.signature)
      formData.append('Signature', suspectRequest.signature);
    const response = await axios.post(
      `${serverUrl}/api/v1/Suspect/Create/${investigationId}`,
      formData,
      {
        headers: {
          ...headers,
          'Content-Type': 'multipart/form-data',
        },
      },
    );

    return response.status === 200 || response.status === 204;
  } catch (error: any) {
    if (error?.response?.status === 401 || error?.response?.status === 403) {
      redirect('/dashboard/403');
    }
    if (error.response && error.response.data) {
      return error.response.data.errors[0] || 'An error occurred.';
    } else if (error.message) {
      return error.message;
    } else {
      throw new Error('An unknown error occurred.');
    }
  }
};

export const updateSuspect = async ({
  id,
  suspectRequest,
}: {
  id: number;
  suspectRequest: SuspectRequestDto;
}): Promise<boolean> => {
  try {
    const headers = await getAuthHeaders('Suspect-Update');

    const response = await axios.put(
      `${serverUrl}/api/v1/Suspect/Update/${id}`,
      suspectRequest,
      {
        headers: {
          ...headers,
          'Content-Type': 'multipart/form-data',
        },
      },
    );

    if (response.status === 200) {
      return true;
    } else {
      throw new Error();
    }
  } catch (error: any) {
    if (error?.response?.status === 401 || error?.response?.status === 403) {
      redirect('/dashboard/403');
    }
    if (error.response && error.response.data) {
      return error.response.data.errors[0] || 'An error occurred.';
    } else if (error.message) {
      return error.message;
    } else {
      throw new Error('An unknown error occurred.');
    }
  }
};

export const deleteSuspect = async ({
  id,
}: {
  id: number;
}): Promise<boolean> => {
  try {
    const headers = await getAuthHeaders('Suspect-Delete');

    const response = await axios.delete(
      `${serverUrl}/api/v1/Suspect/Delete/${id}`,
      {
        headers,
      },
    );

    if (response.status === 200) {
      return true;
    } else {
      throw new Error();
    }
  } catch (error: any) {
    if (error?.response?.status === 401 || error?.response?.status === 403) {
      redirect('/dashboard/403');
    }

    if (error.response && error.response.data) {
      return error.response.data.errors[0] || 'An error occurred.';
    } else if (error.message) {
      return error.message;
    } else {
      throw new Error('An unknown error occurred.');
    }
  }
};
