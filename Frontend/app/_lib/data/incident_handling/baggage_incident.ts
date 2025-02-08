import { serverUrl } from '@/app/_services/envService';
import axios, { AxiosError } from 'axios';

import {
  BaggageIncident,
  BaggageIncidentPaginatedResponse,
} from '../types/baggage_types';
import { BaggageIncidentsQueryDto } from '@/components/ui/incident Handling/baggage_Incident/types';
import { ActionResponse } from '../../definitions';
import { getAuthHeaders } from '../../utils';
import { redirect } from 'next/navigation';

export const fetchBaggageIncidents = async (
  params: BaggageIncidentsQueryDto,
): Promise<ActionResponse<BaggageIncidentPaginatedResponse>> => {
  try {
    const headers = await getAuthHeaders('BaggageIncident-GetAll');

    const response = await axios.get<BaggageIncidentPaginatedResponse>(
      `${serverUrl}/api/v1/BaggageIncident`,
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
        errors: ['Unauthorized to get the baggage incidents.'],
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

export const DetailBaggageIncident = async (
  id: number,
): Promise<ActionResponse<BaggageIncident>> => {
  try {
    const headers = await getAuthHeaders('BaggageIncident-GetById');

    const response = await axios.get(
      `${serverUrl}/api/v1/BaggageIncident/${id}`,
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
        errors: ['Unauthorized to get the baggage incident.'],
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

export const exportBaggageIncidents = async (
  params: BaggageIncidentsQueryDto,
): Promise<ActionResponse<boolean>> => {
  try {
    const headers = await getAuthHeaders('BaggageIncident-Export');

    const response = await axios.get(
      `${serverUrl}/api/v1/BaggageIncident/Export`,
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
        `Baggage_Incidents_Report_${new Date().toISOString()}.xlsx`,
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
        errors: ['Unauthorized to get the baggage incidents.'],
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
