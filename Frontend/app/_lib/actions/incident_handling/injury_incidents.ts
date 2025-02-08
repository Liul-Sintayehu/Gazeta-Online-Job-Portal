import { serverUrl } from '@/app/_services/envService';
import axios from 'axios';
import { getAuthHeaders } from '../../utils';
import { redirect } from 'next/navigation';

export const deleteInjuryIncidentSA = async (id: number): Promise<boolean> => {
  try {
    const headers = await getAuthHeaders('InjuryIncident-Delete');

    const response = await axios.delete(
      `${serverUrl}/api/v1/InjuryIncident/Delete/${id}`,
      {
        headers,
      },
    );

    if (response.status === 200) {
      return true;
    } else {
      throw new Error('Failed to delete the incident.');
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
