import { ActionResponse } from '../../definitions';
import axios, { AxiosError } from 'axios';
import { serverUrl } from '@/app/_services/envService';

export const createLocation = async (
  data: any,
): Promise<ActionResponse<any>> => {
  try {
    const response = await axios.post<any>(
      `${serverUrl}/api/v1/Location/Create`,
      {
        data,
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
interface LocationUpdateProps {
  id: number;
  data: any;
}
export const updateLocation = async ({
  id,
  data,
}: LocationUpdateProps): Promise<ActionResponse<any>> => {
  try {
    const response = await axios.put<any>(
      `${serverUrl}/api/v1/Location/Update/${id}`,
      {
        data,
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

export const deleteLocation = async (
  id: number,
): Promise<ActionResponse<any>> => {
  try {
    const response = await axios.delete<any>(
      `${serverUrl}/api/v1/Location/Delete/${id}`,
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
interface StatusUpdate {
  status: number;
  id: number;
}
export const updateLocationStatus = async ({ status, id }: StatusUpdate) => {
  try {
    const response = await axios.put(
      `${serverUrl}/api/v1/Locatoin/UpdateStatus/${id}`,
      { status },
      {
        headers: {
          'Content-Type': 'application/json',
        },
      },
    );
    if (response.status == 200) {
      return true;
    } else {
      return false;
    }
  } catch (error: any) {
    if (error.response && error.response.data) {
      return error.response.data.errors[0] || 'An error occurred.';
    } else if (error.message) {
      return error.message;
    } else {
      return 'An unknown error occurred.';
    }
  }
};
