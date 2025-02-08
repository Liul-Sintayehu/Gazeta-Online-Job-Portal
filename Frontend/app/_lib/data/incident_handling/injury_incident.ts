import { serverUrl } from '@/app/_services/envService';
import { InjuryIncident } from '@/components/ui/incident Handling/injury_incident/types';
import axios, { AxiosError } from 'axios';
import { getAuthHeaders } from '../../utils';
import { ActionResponse } from '../../definitions';

export const detailInjuryIncidentSA = async (
  id: number,
): Promise<ActionResponse<InjuryIncident>> => {
  try {
    const headers = await getAuthHeaders('InjuryIncident-GetAll');

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
        errors: ['Unauthorized to get the injury incident.'],
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
