import { serverUrl } from '@/app/_services/envService';
import axios from 'axios';
import { getAuthHeaders } from '../utils';
import { redirect } from 'next/navigation';

interface StatusUpdate {
  id: number;
  status: number;
}
interface Data {
  dataToSend: any;
}
interface DataDeleted {
  dataToDelete: {
    id: number;
  };
}
interface DataUpdated {
  dataToUpdate: any;
  id: number;
}

export const CreateTask = async (params: Data) => {
  try {
    const headers = await getAuthHeaders('Suspect-Create');

    const response = await axios.post(
      `${serverUrl}/api/v1/SubTask/Create`,
      params.dataToSend,
      {
        headers,
      },
    );

    if (response.status == 200) {
      return true;
    } else {
      return false;
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
      return 'An unknown error occurred.';
    }
  }
};

export const UpdateTask = async ({ dataToUpdate, id }: DataUpdated) => {
  try {
    const headers = await getAuthHeaders('Suspect-Update');

    const response = await axios.put(
      `${serverUrl}/api/v1/SubTask/Update/${id}`,
      dataToUpdate,
      {
        headers,
      },
    );

    if (response.status == 200) {
      return true;
    } else {
      return false;
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
      return 'An unknown error occurred.';
    }
  }
};

export const UpdateTaskStatus = async ({ id, status }: StatusUpdate) => {
  try {
    const headers = await getAuthHeaders('Suspect-Update');

    const response = await axios.put(
      `${serverUrl}/api/v1/SubTask/UpdateStatus/${id}`,
      { status },
      {
        headers,
      },
    );

    if (response.status == 200) {
      return true;
    } else {
      return false;
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
      return 'An unknown error occurred.';
    }
  }
};

export const DeleteTask = async (
  params: DataDeleted,
): Promise<boolean | any> => {
  try {
    const { id } = params.dataToDelete;
    const headers = await getAuthHeaders('Suspect-Delete');

    const response = await axios.delete(
      `${serverUrl}/api/v1/SubTask/Delete/${id}`,
      {
        headers,
      },
    );

    if (response.status === 200) {
      return true;
    } else {
      return false;
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
      return 'An unknown error occurred.';
    }
  }
};
