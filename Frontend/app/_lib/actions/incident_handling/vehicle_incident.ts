import { serverUrl } from '@/app/_services/envService';
import { VehicleIncident as VehicleUpdate } from '@/components/ui/incident Handling/vehicle_incident/types';
import { VehicleIncident } from '../../data/types/vehicle_incident';

import axios from 'axios';
import { getAuthHeaders } from '../../utils';
import { redirect } from 'next/navigation';

export const createVehicleIncidentSA = async (params: VehicleIncident) => {
  try {
    const headers = await getAuthHeaders('VehicleIncident-Create');

    const response = await axios.post(
      `${serverUrl}/api/v1/VehicleIncident/Create`,
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

export const deleteVehicleIncidentSA = async (id: number): Promise<boolean> => {
  try {
    const headers = await getAuthHeaders('VehicleIncident-Delete');

    const response = await axios.delete(
      `${serverUrl}/api/v1/VehicleIncident/Delete/${id}`,
      {
        headers,
      },
    );

    if (response.status === 200) {
      return true;
    } else {
      throw new Error('Failed to delete the Vehicle Incident.');
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
export const updateVehicleIncidentSA = async ({
  data,
  id,
}: {
  data: VehicleUpdate;
  id: number;
}) => {
  try {
    const headers = await getAuthHeaders('VehicleIncident-Update');

    const response = await axios.put(
      `${serverUrl}/api/v1/VehicleIncident/Update/${id}`,
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
