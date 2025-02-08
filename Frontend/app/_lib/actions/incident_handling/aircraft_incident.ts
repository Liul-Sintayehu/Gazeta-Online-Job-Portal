import { serverUrl } from '@/app/_services/envService';
import axios from 'axios';
import {
  CreateAirCraftIncidentRequest,
  UpdateAirCraftIncidentRequest,
} from '../../data/types/aircraft_types';
import { getAuthHeaders } from '../../utils';
import { redirect } from 'next/navigation';

export const createAircraftIncidentSA = async (
  params: CreateAirCraftIncidentRequest,
) => {
  try {
    const headers = await getAuthHeaders('AircraftIncident-Create');

    const response = await axios.post(
      `${serverUrl}/api/v1/AircraftIncident/Create`,
      params,
      {
        headers,
      },
    );

    return response.data;
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

export const updateAircraftIncidentSA = async ({
  data,
  id,
}: {
  data: UpdateAirCraftIncidentRequest;
  id: number;
}) => {
  try {
    const headers = await getAuthHeaders('AircraftIncident-Update');

    const response = await axios.put(
      `${serverUrl}/api/v1/AircraftIncident/Update/${id}`,
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

export const deleteAircraftIncidentSA = async (
  id: number,
): Promise<boolean> => {
  try {
    const headers = await getAuthHeaders('AircraftIncident-Delete');

    const response = await axios.delete(
      `${serverUrl}/api/v1/AircraftIncident/Delete/${id}`,
      {
        headers,
      },
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
