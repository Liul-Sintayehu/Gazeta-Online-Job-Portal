import { getAuthHeaders } from '../utils';
import {
  Incident,
  IncidentsQueryRequest,
} from '@/app/_components/incident-handling/incidents/types';
import { serverUrl } from '@/app/_services/envService';
import axios from 'axios';

export const fetchAllIncidents = async (
  params: IncidentsQueryRequest,
): Promise<Incident[]> => {
  try {
    const headers = await getAuthHeaders('Incident-Get');

    const response = await axios.get(`${serverUrl}/api/v1/Incident`, {
      params: params,
      headers,
    });

    if (response.status === 200) {
      return response.data;
    } else {
      throw new Error('Failed to fetch incidents.');
    }
  } catch (error: any) {
    if (error?.response?.status === 404) {
      throw Error('404 | Not Found');
    } else if (error?.response && error?.response.data) {
      return error.response.data.errors[0] || 'An error occurred.';
    } else if (error?.message) {
      return error.message;
    } else {
      throw new Error('An unknown error occurred.');
    }
  }
};
