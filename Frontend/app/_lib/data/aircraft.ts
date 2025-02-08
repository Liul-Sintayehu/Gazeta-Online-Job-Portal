import { serverUrl } from '@/app/_services/envService';
import axios, { AxiosError } from 'axios';
import { getAuthHeaders } from '../utils';
import { redirect } from 'next/navigation';

interface Aircraft {
  id: number;
  aircraftTypeCode: string;
  aircraftTypeName: string;
  recordStatus: number;
}

export const fetchAircraft = async (): Promise<Aircraft[]> => {
  try {
    const headers = await getAuthHeaders('AircraftType-GetAll');

    const response = await axios.get<Aircraft[]>(
      `${serverUrl}/api/v1/AircraftType`,
      {
        headers,
      },
    );
    const data = response.data;

    return data;
  } catch (error: AxiosError | any) {
    if (error?.response?.status == 401 || error?.response?.status == 403) {
      redirect('/dashboard/403');
    }
    return [];
  }
};
