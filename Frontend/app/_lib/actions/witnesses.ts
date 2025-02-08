import { WitnessRequestDto } from '@/app/_components/incident-handling/investigations/types';
import { serverUrl } from '@/app/_services/envService';
import axios from 'axios';
import { getAuthHeaders } from '../utils';
import { redirect } from 'next/navigation';

export const createWitness = async ({
  investigationId,
  witnessRequest,
}: {
  investigationId: number;
  witnessRequest: WitnessRequestDto;
}): Promise<boolean> => {
  try {
    const headers = await getAuthHeaders('Witness-Create');

    const formData = new FormData();
    formData.append('Name', witnessRequest.name ?? '');
    formData.append('IdCardType', witnessRequest.idCardType ?? '');
    formData.append('IdCardNumber', witnessRequest.idCardNumber ?? '');
    formData.append('PhoneNumber', witnessRequest.phoneNumber ?? '');
    formData.append('RoleInIncident', witnessRequest.roleInIncident ?? '');
    formData.append('Address', witnessRequest.address ?? '');
    formData.append('Statement', witnessRequest.statement ?? '');
    formData.append(
      'DateOfTestimony',
      witnessRequest.dateOfTestimony
        ? witnessRequest.dateOfTestimony?.toISOString()
        : '',
    );
    if (witnessRequest.signature)
      formData.append('Signature', witnessRequest.signature);

    const response = await axios.post(
      `${serverUrl}/api/v1/Witness/Create/${investigationId}`,
      formData,
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

export const updateWitness = async ({
  id,
  witnessRequest,
}: {
  id: number;
  witnessRequest: WitnessRequestDto;
}): Promise<boolean> => {
  try {
    const headers = await getAuthHeaders('Witness-Update');

    const formData = new FormData();
    formData.append('Name', witnessRequest.name ?? '');
    formData.append('IdCardType', witnessRequest.idCardType ?? '');
    formData.append('IdCardNumber', witnessRequest.idCardNumber ?? '');
    formData.append('PhoneNumber', witnessRequest.phoneNumber ?? '');
    formData.append('RoleInIncident', witnessRequest.roleInIncident ?? '');
    formData.append('Address', witnessRequest.address ?? '');
    formData.append('Statement', witnessRequest.statement ?? '');
    formData.append(
      'DateOfTestimony',
      witnessRequest.dateOfTestimony
        ? witnessRequest.dateOfTestimony?.toISOString()
        : '',
    );
    if (witnessRequest.signature)
      formData.append('Signature', witnessRequest.signature);

    const response = await axios.put(
      `${serverUrl}/api/v1/Witness/Update/${id}`,
      formData,
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

export const deleteWitness = async ({
  id,
}: {
  id: number;
}): Promise<boolean> => {
  try {
    const headers = await getAuthHeaders('Witness-Delete');

    const response = await axios.delete(
      `${serverUrl}/api/v1/Witness/Delete/${id}`,
      { headers },
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
