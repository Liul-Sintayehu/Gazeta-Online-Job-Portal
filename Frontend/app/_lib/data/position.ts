import { serverUrl } from '@/app/_services/envService';
import axios from 'axios';
import { getAuthHeaders } from '../utils';
import { redirect } from 'next/navigation';

interface Position {
  id: number;
  name: string;
  description: string;
  recordStatus: number;
}

export const fetchPositoin = async (): Promise<Position[]> => {
  try {
    const headers = await getAuthHeaders('Position-GetAll');

    const response = await axios.get<Position[]>(
      `${serverUrl}/api/v1/Position`,
      {
        headers,
      },
    );

    return response.data;
  } catch (error: any) {
    if (error?.response?.status === 401 || error?.response?.status === 403) {
      redirect('/dashboard/403');
    }
    return [];
  }
};
