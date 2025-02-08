import { serverUrl } from '@/app/_services/envService';
import axios from 'axios';
import { getAuthHeaders } from '../utils';
import { redirect } from 'next/navigation';

interface AircraftType {
  id: number;
  aircraftTypeCode: string;
  aircraftTypeName: string;
  recordStatus: number;
}

interface MajorTask {
  id: number;
  name: string;
  description: string;
  recordStatus: number;
}

interface ParentTask {
  id: number;
  name: string;
  description: string;
  majorTaskId: number;
  parentTaskId: number;
  aircraftTypeId: number;
  parentTask: ParentTask | null;
  majorTask: MajorTask;
  aircraftType: AircraftType;
  recordStatus: number;
}

interface Task {
  id: number;
  name: string;
  description: string;
  majorTaskId: number;
  parentTaskId: number;
  aircraftTypeId: number;
  parentTask: ParentTask;
  majorTask: MajorTask;
  aircraftType: AircraftType;
  recordStatus: number;
}
interface DataSearch {
  dataToSearch: {
    name: string;
    description: string;
  };
}

// Define the function to fetch data
export const fetchTask = async (): Promise<Task[]> => {
  try {
    const headers = await getAuthHeaders('SubTask-GetAll');

    const response = await axios.get<Task[]>(`${serverUrl}/api/v1/SubTask`, {
      headers,
    });
    const data = response.data;

    return data;
  } catch (error: any) {
    if (error?.response?.status === 401 || error?.response?.status === 403) {
      redirect('/dashboard/403');
    }
    return [];
  }
};

export const searchTask = async (params: DataSearch): Promise<Task[] | any> => {
  try {
    const headers = await getAuthHeaders('SubTask-Search');

    const response = await axios.get(`${serverUrl}/api/v1/Subtask/Search`, {
      params: params.dataToSearch,
      headers,
    });

    const data: Task[] = response.data;

    return data;
  } catch (error: any) {
    if (error?.response?.status === 401 || error?.response?.status === 403) {
      redirect('/dashboard/403');
    }
    // Return error message based on the format of the error object
    if (error.response && error.response.data) {
      return error.response.data.errors[0] || 'An error occurred.';
    } else if (error.message) {
      return error.message;
    } else {
      return 'An unknown error occurred.';
    }
  }
};
