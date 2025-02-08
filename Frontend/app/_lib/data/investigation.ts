import { getAuthHeaders } from '../utils';
import { serverUrl } from '@/app/_services/envService';
import axios, { AxiosError } from 'axios';
import {
  Investigation,
  InvestigationPaginatedResponses,
} from './types/baggage_types';
import { InvestigationQuery } from '@/app/_components/incident-handling/investigations/types';
import { ActionResponse } from '../definitions';
import { redirect } from 'next/navigation';

export const fetchInvestigations = async (
  params: InvestigationQuery,
): Promise<InvestigationPaginatedResponses | any> => {
  try {
    const headers = await getAuthHeaders('Investigation-GetAll');

    const response = await axios.get(`${serverUrl}/api/v1/Investigation`, {
      params,
      headers,
    });

    if (response.status === 200) {
      return response.data;
    } else {
      return null;
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

export const detailInvestigation = async (
  id: number,
): Promise<ActionResponse<Investigation>> => {
  try {
    const headers = await getAuthHeaders('Investigation-GetById');

    const response = await axios.get<Investigation>(
      `${serverUrl}/api/v1/Investigation/${id}`,
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

export const exportInvestigations = async (
  params: InvestigationQuery,
): Promise<ActionResponse<boolean>> => {
  try {
    const headers = await getAuthHeaders('Investigation-Export');

    const response = await axios.get(
      `${serverUrl}/api/v1/Investigation/Export`,
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
        `Investigations_Report_${new Date().toISOString()}.xlsx`,
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
      errors: ['Failed to export investigations!'],
    };
  } catch (error: any) {
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
        errors: ['Something went wrong, please try again!'],
      };
    }
  }
};
