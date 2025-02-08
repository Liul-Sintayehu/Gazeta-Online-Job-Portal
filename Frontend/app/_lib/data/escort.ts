import { serverUrl } from '@/app/_services/envService';
import axios, { AxiosError } from 'axios';
import { ActionResponse } from '../definitions';
import {
  EscortPaginatedResponseDto,
  EscortQueryDto,
} from '@/components/ui/officer-assignment/escorts/types';
import { redirect } from 'next/navigation';
import { getAuthHeaders } from '../utils';

export const fetchEscorts = async (
  params: EscortQueryDto,
): Promise<ActionResponse<EscortPaginatedResponseDto>> => {
  try {
    const headers = await getAuthHeaders('Escort-GetAll');

    const response = await axios.get<EscortPaginatedResponseDto>(
      `${serverUrl}/api/v1/Escort`,
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
    } else {
      return {
        isSuccess: false,
        payload: null,
        errors: ['An unknown error occurred.'],
      };
    }
  } catch (error: AxiosError | any) {
    if (error.response?.status === 401 || error.response?.status === 403) {
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

export const exportEscort = async (
  params: EscortQueryDto,
): Promise<ActionResponse<boolean>> => {
  try {
    const headers = await getAuthHeaders('Escort-Export');

    const response = await axios.get(`${serverUrl}/api/v1/Escort/Export`, {
      params: params,
      responseType: 'blob',
      headers,
    });

    if (response.status === 200) {
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute(
        'download',
        `Escort_Tasks_Report_${new Date().toISOString()}.xlsx`,
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
  } catch (error: AxiosError | any) {
    if (error.response?.status === 401 || error.response?.status === 403) {
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
        errors: ['Something went wrong, please try again!'],
      };
    }
  }
};
