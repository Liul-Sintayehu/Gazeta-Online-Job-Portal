import { serverUrl } from '@/app/_services/envService';
import axios, { AxiosError } from 'axios';
import { InjuryIncident, InjuryIncidentResponse } from '../types/injury';
import { InjuryIncidentsQueryDto } from '@/components/ui/incident Handling/injury_incident/types';
import { ActionResponse } from '../../definitions';
import { getAuthHeaders } from '../../utils';
import { redirect } from 'next/navigation';

export const fetchInjuryIncidents = async (
  params: InjuryIncidentsQueryDto,
): Promise<ActionResponse<InjuryIncidentResponse>> => {
  try {
    const headers = await getAuthHeaders('InjuryIncident-GetById');

    const response = await axios.get<InjuryIncidentResponse>(
      `${serverUrl}/api/v1/InjuryIncident`,
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
        errors: ['Unauthorized to get the injury incidents.'],
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

export const DetailInjuryIncidentSA = async (
  id: number,
): Promise<ActionResponse<InjuryIncident>> => {
  try {
    const headers = await getAuthHeaders('InjuryIncident-GetById');

    const response = await axios.get(
      `${serverUrl}/api/v1/InjuryIncident/${id}`,
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
        errors: ['Unauthorized to get the injury incidents.'],
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

export const exportInjuryIncidents = async (
  params: InjuryIncidentsQueryDto,
): Promise<ActionResponse<boolean>> => {
  try {
    const response = await axios.get(
      `${serverUrl}/api/v1/InjuryIncident/Export`,
      {
        params: params,
        responseType: 'blob',
      },
    );

    if (response.status == 200 || response.status == 200) {
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute(
        'download',
        `Injury_Incidents_Report_${new Date().toISOString()}.xlsx`,
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
        errors: ['Unauthorized to get the injury incidents.'],
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
