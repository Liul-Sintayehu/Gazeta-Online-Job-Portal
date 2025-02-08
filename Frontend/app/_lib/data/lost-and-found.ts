import { getAuthHeaders } from '../utils';
import { serverUrl } from '@/app/_services/envService';
import {
  LostAndFoundItemPaginatedResponse,
  LostAndFoundItemResponse,
  LostAndFoundQuery,
} from '@/components/ui/lost-and-found/type';
import axios, { AxiosError, AxiosResponse } from 'axios';
import { ActionResponse } from '../definitions';
import { redirect } from 'next/navigation';

export const fetchLostAndFound = async (
  params: LostAndFoundQuery,
): Promise<ActionResponse<LostAndFoundItemPaginatedResponse>> => {
  try {
    const headers = await getAuthHeaders('LostAndFoundItems-GetAll');

    const response = await axios.get<LostAndFoundItemPaginatedResponse>(
      `${serverUrl}/api/v1/LostAndFoundItems`,
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
    } else {
      return {
        isSuccess: false,
        payload: null,
        errors: ['An unknown error occurred.'],
      };
    }
  } catch (error: AxiosError | any) {
    if (error?.response?.status === 401 || error?.response?.status === 403) {
      redirect('/dashboard/403');
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

export const fetchLostAndFoundById = async (
  id: number,
): Promise<ActionResponse<LostAndFoundItemResponse>> => {
  try {
    const headers = await getAuthHeaders('LostAndFoundItems-GetById');

    const response = await axios.get<LostAndFoundItemResponse>(
      `${serverUrl}/api/v1/LostAndFoundItems/${id}`,
      {
        headers,
      },
    );

    if (response.status === 200 || response.status === 201) {
      return {
        isSuccess: true,
        payload: response.data,
        errors: [],
      };
    } else {
      return {
        isSuccess: false,
        payload: null,
        errors: ['An unknown error occurred.'],
      };
    }
  } catch (error: AxiosError | any) {
    if (error?.response?.status === 401 || error?.response?.status === 403) {
      redirect('/dashboard/403');
    }

    if (error?.response?.status === 404) {
      throw Error('404 | Not Found');
    } else if (error.response && error.response.data) {
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

export const exportLostAndFound = async (
  params: LostAndFoundQuery,
): Promise<ActionResponse<boolean>> => {
  try {
    const headers = await getAuthHeaders('LostAndFoundItems-Export');

    const response = await axios.get(
      `${serverUrl}/api/v1/LostAndFoundItems/Export`,
      {
        params: params,
        responseType: 'blob',
        headers,
      },
    );

    if (response.status === 200) {
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute(
        'download',
        `Lost_and_Found_Items_${new Date().toISOString()}.xlsx`,
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
      errors: ['Failed to export Lost and Found items!'],
    };
  } catch (error: any) {
    if (error?.response?.status === 401 || error?.response?.status === 403) {
      redirect('/dashboard/403');
    }

    const errors = error.response?.data?.errors || [
      error.message || 'An unknown error occurred.',
    ];
    return {
      isSuccess: false,
      payload: null,
      errors,
    };
  }
};
