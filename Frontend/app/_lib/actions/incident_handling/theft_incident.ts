import { serverUrl } from '@/app/_services/envService';
import axios from 'axios';
import { CreateTheftIncident } from '../../data/types/theft_incident_type';
import { TheftIncident as TheftIncidentCreate } from '@/components/ui/incident Handling/theft_incident/types';
import { getAuthHeaders } from '../../utils';
import { redirect } from 'next/navigation';

export const createTheftIncidentSA = async (params: CreateTheftIncident) => {
  try {
    const headers = await getAuthHeaders('TheftIncident-Create');

    const response = await axios.post(
      `${serverUrl}/api/v1/TheftIncident/Create`,
      params,
      {
        headers,
      },
    );
    const data = response.data;
    return data;
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

export const updateTheftIncidentSA = async ({
  data,
  id,
}: {
  data: TheftIncidentCreate;
  id: number;
}) => {
  try {
    const headers = await getAuthHeaders('TheftIncident-Update');

    const response = await axios.put(
      `${serverUrl}/api/v1/TheftIncident/Update/${id}`,
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

export const deleteTheftIncidentSA = async (
  id: number | undefined,
): Promise<any> => {
  try {
    const headers = await getAuthHeaders('TheftIncident-Delete');

    const response = await axios.delete(
      `${serverUrl}/api/v1/TheftIncident/Delete/${id}`,
    );

    if (response.status === 200) {
      return true;
    } else {
      return 'Failed to delete the Theft Incident.';
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
