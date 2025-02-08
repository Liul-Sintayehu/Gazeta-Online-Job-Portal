import {
  CreateOffloadBaggageRequestDto,
  OffloadBaggageResponseDto,
  UpdateOffloadBaggageRequestDto,
} from '@/app/_components/offload-baggage/types';
import { serverUrl } from '@/app/_services/envService';
import axios from 'axios';
import { getAuthHeaders } from '../utils';
import { redirect } from 'next/navigation';

export const createOffloadBaggage = async (
  params: CreateOffloadBaggageRequestDto,
): Promise<OffloadBaggageResponseDto> => {
  try {
    const headers = await getAuthHeaders('OffloadBaggage-Create');

    const response = await axios.post(
      `${serverUrl}/api/v1/OffloadBaggage/Create`,
      params,
      {
        headers,
      },
    );
    if (response.status === 200) {
      return response.data;
    } else {
      throw new Error('Failed to create offload baggage!');
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

export const updateOffloadBaggage = async (
  params: UpdateOffloadBaggageRequestDto,
): Promise<OffloadBaggageResponseDto> => {
  try {
    const headers = await getAuthHeaders('OffloadBaggage-Update');

    const response = await axios.put(
      `${serverUrl}/api/v1/OffloadBaggage/Update/${params.id}`,
      params,
      {
        headers,
      },
    );
    if (response.status === 200) {
      return response.data;
    } else {
      throw new Error('Failed to create offload baggage!');
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

export const deleteOffloadBaggage = async (id: number): Promise<boolean> => {
  try {
    const headers = await getAuthHeaders('OffloadBaggage-Delete');

    const response = await axios.delete(
      `${serverUrl}/api/v1/OffloadBaggage/Delete/${id}`,
    );

    // Check if the response status indicates success
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
      throw new Error('An unknown error occurred.');
    }
  }
};
