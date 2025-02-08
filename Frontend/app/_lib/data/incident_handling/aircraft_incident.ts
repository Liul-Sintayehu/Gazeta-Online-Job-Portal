import { serverUrl } from '@/app/_services/envService';
import {
  AirCraftIncident,
  AirCraftIncidentsQueryDto,
} from '@/components/ui/incident Handling/aircart_incident/types';
import axios, { AxiosError } from 'axios';
import { AirCraftIncidentPaginatedResponse } from '../types/aircraft_types';
import { ActionResponse } from '../../definitions';
import { getAuthHeaders } from '../../utils';
import { redirect } from 'next/navigation';

export const fetchAircraftIncidents = async (
  params: AirCraftIncidentsQueryDto,
): Promise<ActionResponse<AirCraftIncidentPaginatedResponse>> => {
  try {
    const headers = await getAuthHeaders('AirCraftIncident-GetAll');

    const response = await axios.get<AirCraftIncidentPaginatedResponse>(
      `${serverUrl}/api/v1/AirCraftIncident`,
      {
        params,
        headers,
      },
    );

    if (response.status === 200) {
      return {
        isSuccess: true,
        payload: response.data,
        errors: [],
      };
    } else if (response.status === 201) {
      return {
        isSuccess: false,
        payload: null,
        errors: [],
      };
    } else
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
        errors: ['Unauthorized to get the aircraft incidents.'],
      };
    }
    if (error.response && error.response.data) {
      return {
        isSuccess: false,
        payload: null,
        errors: error.response.data.errors,
      };
    } else if (error.message) {
      return {
        isSuccess: false,
        payload: null,
        errors: [error.message],
      };
    } else {
      return {
        isSuccess: false,
        payload: null,
        errors: ['An unknown error occurred.'],
      };
    }
  }
};

export const DetailAircraftIncidentSA = async (
  id: number,
): Promise<ActionResponse<AirCraftIncident>> => {
  try {
    const headers = await getAuthHeaders('AirCraftIncident-GetById');

    const response = await axios.get(
      `${serverUrl}/api/v1/AircraftIncident/${id}`,
      {
        headers,
      },
    );

    if (response.status === 200) {
      return {
        isSuccess: true,
        payload: response.data,
        errors: [],
      };
    } else if (response.status === 201) {
      return {
        isSuccess: false,
        payload: null,
        errors: [],
      };
    } else
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
        errors: ['Unauthorized to get the aircraft incident.'],
      };
    }
    if (error.response && error.response.data) {
      return {
        isSuccess: false,
        payload: null,
        errors: error.response.data.errors,
      };
    } else if (error.message) {
      return {
        isSuccess: false,
        payload: null,
        errors: [error.message],
      };
    } else {
      return {
        isSuccess: false,
        payload: null,
        errors: ['An unknown error occurred.'],
      };
    }
  }
};

export const exportAircraftIncidents = async (
  params: AirCraftIncidentsQueryDto,
): Promise<ActionResponse<boolean>> => {
  try {
    const headers = await getAuthHeaders('AirCraftIncident-Export');

    const response = await axios.get(
      `${serverUrl}/api/v1/AircraftIncident/Export`,
      {
        params: params,
        responseType: 'blob',
        headers,
      },
    );

    if (response.status == 200 || response.status == 200) {
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute(
        'download',
        `Aircraft_Incidents_Report_${new Date().toISOString()}.xlsx`,
      );
      document.body.appendChild(link);
      link.click();
      link.remove();

      return {
        isSuccess: true,
        payload: true,
        errors: [],
      };
    }

    return {
      isSuccess: false,
      payload: false,
      errors: ['Failed to export escort tasks!'],
    };
  } catch (error: any) {
    if (error?.response?.status === 401 || error?.response?.status === 403) {
      return {
        isSuccess: false,
        payload: null,
        errors: ['Unauthorized to get the aircraft incidents.'],
      };
    }
    if (error.response && error.response.data) {
      return {
        isSuccess: false,
        payload: null,
        errors: error.response.data.errors,
      };
    } else if (error.message) {
      return {
        isSuccess: false,
        payload: null,
        errors: [error.message],
      };
    } else {
      return {
        isSuccess: false,
        payload: null,
        errors: ['Something went wrong, please try again!'],
      };
    }
  }
};
