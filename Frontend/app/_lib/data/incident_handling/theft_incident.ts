import { serverUrl } from '@/app/_services/envService';
import axios, { AxiosError } from 'axios';
import {
  TheftIncident,
  TheftIncidentPaginatedResponse,
  TheftIncidentsQueryDto,
} from '@/components/ui/incident Handling/theft_incident/types';
import { ActionResponse } from '../../definitions';
import { getAuthHeaders } from '../../utils';
import { redirect } from 'next/navigation';

export const fetchTheftIncidents = async (
  params: TheftIncidentsQueryDto,
): Promise<ActionResponse<TheftIncidentPaginatedResponse>> => {
  try {
    const headers = await getAuthHeaders('TheftIncident-GetAll');

    const response = await axios.get(`${serverUrl}/api/v1/TheftIncident`, {
      params,
      headers,
    });
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
        errors: ['Unauthorized to get the theft incidents.'],
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

export const detailTheftIncidentSA = async (
  id: number,
): Promise<ActionResponse<TheftIncident>> => {
  try {
    const headers = await getAuthHeaders('TheftIncident-GetById');

    const response = await axios.get(
      `${serverUrl}/api/v1/TheftIncident/${id}`,
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
        errors: ['Unauthorized to get the theft incident.'],
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

export const exportTheftIncidents = async (
  params: TheftIncidentsQueryDto,
): Promise<ActionResponse<boolean>> => {
  try {
    const headers = await getAuthHeaders('TheftIncident-Export');

    const response = await axios.get(
      `${serverUrl}/api/v1/TheftIncident/Export`,
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
        `Theft_Incidents_Report_${new Date().toISOString()}.xlsx`,
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
        errors: ['Unauthorized to get the theft incidents.'],
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
