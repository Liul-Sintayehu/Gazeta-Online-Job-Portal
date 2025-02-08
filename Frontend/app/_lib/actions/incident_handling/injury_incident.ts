import { serverUrl } from '@/app/_services/envService';
import axios from 'axios';
import { CreateInjuryIncident, InjuryIncident } from '../../data/types/injury';
import { getAuthHeaders } from '../../utils';
import { redirect } from 'next/navigation';

export const CreateInjuryIncidentSA = async (params: CreateInjuryIncident) => {
  try {
    const headers = await getAuthHeaders('InjuryIncident-Create');

    const response = await axios.post<InjuryIncident>(
      `${serverUrl}/api/v1/InjuryIncident/Create`,
      params,
      {
        headers,
      },
    );
    if (response.status == 200 || response.status == 201) {
      return response.data;
    } else {
      throw Error(
        'Something went wrong while creating the incident, please try again!',
      );
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
      return 'An unknown error occurred.';
    }
  }
};

export const UpdateInjuryIncidentSA = async ({
  data,
  id,
}: {
  data: InjuryIncident;
  id: number;
}) => {
  try {
    const headers = await getAuthHeaders('AircraftIncident-Update');

    const response = await axios.put(
      `${serverUrl}/api/v1/InjuryIncident/Update/${id}`,
      data,
      {
        headers,
      },
    );

    if (response.status == 200) {
      return true;
    } else {
      return false;
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
      return 'An unknown error occurred.';
    }
  }
};

export const DeleteInjuryIncidentSA = async (id: number): Promise<boolean> => {
  try {
    const headers = await getAuthHeaders('AircraftIncident-Delete');

    const response = await axios.delete(
      `${serverUrl}/api/v1/InjuryIncident/Delete/${id}`,
    );

    if (response.status === 200) {
      return true;
    } else {
      throw new Error('Failed to delete the aircraft Incident.');
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
