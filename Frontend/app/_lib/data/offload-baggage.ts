import axios from 'axios';
import { getAuthHeaders } from '../utils';
import { serverUrl } from '@/app/_services/envService';
import {
  OffloadBaggageFilterParams,
  OffloadBaggagePaginatedResponseDto,
  OffloadBaggageResponseDto,
} from '@/app/_components/offload-baggage/types';
import { redirect } from 'next/navigation';

export const fetchAllOffloadBaggages = async (
  params: OffloadBaggageFilterParams,
): Promise<OffloadBaggagePaginatedResponseDto> => {
  try {
    const headers = await getAuthHeaders('OffloadBaggage-GetReports');

    const response = await axios.get<OffloadBaggagePaginatedResponseDto>(
      `${serverUrl}/api/v1/OffloadBaggage`,
      {
        params,
        headers,
      },
    );

    if (response.status == 200) return response.data;
    else {
      throw Error('Failed to fetch offload baggages, please try again!');
    }
  } catch (error: any) {
    if (error?.response?.status === 401 || error?.response?.status === 403) {
      redirect('/dashboard/403');
    }
    if (error?.response?.status == 404) {
      throw Error('404 | Not Found');
    } else if (error.response && error.response.data) {
      return error.response.data.errors[0] || 'An error occurred.';
    } else if (error.message) {
      return error.message;
    } else {
      throw new Error('An unknown error occurred.');
    }
  }
};

export const fetchOffloadBaggagesByFlightScheduleId = async ({
  flightScheduleId,
}: {
  flightScheduleId: number;
}): Promise<OffloadBaggageResponseDto[]> => {
  try {
    const headers = await getAuthHeaders('OffloadBaggage-GetByFlightSchedule');

    const response = await axios.get<OffloadBaggageResponseDto[]>(
      `${serverUrl}/api/v1/OffloadBaggage/GetByFlightSchedule/${flightScheduleId}`,
      {
        headers,
      },
    );

    if (response.status == 200) return response.data;
    else {
      throw Error(
        'Failed to fetch offload baggages from flight schedule, please try again!',
      );
    }
  } catch (error: any) {
    if (error?.response?.status === 401 || error?.response?.status === 403) {
      redirect('/dashboard/403');
    }
    if (error?.response?.status == 404) {
      throw Error('404 | Not Found');
    } else if (error.response && error.response.data) {
      return error.response.data.errors[0] || 'An error occurred.';
    } else if (error.message) {
      return error.message;
    } else {
      throw new Error('An unknown error occurred.');
    }
  }
};

export const fetchOffloadBaggagesById = async ({
  offloadBaggageId,
}: {
  offloadBaggageId: number;
}): Promise<OffloadBaggageResponseDto> => {
  try {
    const headers = await getAuthHeaders('OffloadBaggage-GetById');

    const response = await axios.get<OffloadBaggageResponseDto>(
      `${serverUrl}/api/v1/OffloadBaggage/GetById/${offloadBaggageId}`,
      {
        headers,
      },
    );

    if (response.status == 200) return response.data;
    else {
      throw Error('Failed to fetch offload baggage, please try again!');
    }
  } catch (error: any) {
    if (error?.response?.status === 401 || error?.response?.status === 403) {
      redirect('/dashboard/403');
    }
    if (error?.response?.status == 404) {
      throw Error('404 | Not Found');
    } else if (error.response && error.response.data) {
      return error.response.data.errors[0] || 'An error occurred.';
    } else if (error.message) {
      return error.message;
    } else {
      throw new Error('An unknown error occurred.');
    }
  }
};

export const exportOffloadBaggagesByFilterParams = async (
  params: OffloadBaggageFilterParams,
): Promise<boolean> => {
  try {
    const headers = await getAuthHeaders('OffloadBaggage-Export');

    const response = await axios.get(
      `${serverUrl}/api/v1/OffloadBaggage/Export`,
      {
        params: params,
        responseType: 'blob',
        headers,
      },
    );

    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute(
      'download',
      `Offload_Baggages_${new Date().toString()}.xlsx`,
    );
    document.body.appendChild(link);
    link.click();
    link.remove();
    return true;
  } catch (error: any) {
    if (error?.response?.status === 401 || error?.response?.status === 403) {
      redirect('/dashboard/403');
    }
    throw error;
  }
};

export const exportOffloadBaggagesByFlightScheduleId = async (
  flightScheduleId: number,
): Promise<boolean> => {
  try {
    const headers = await getAuthHeaders('OffloadBaggage-Export');

    const response = await axios.get(
      `${serverUrl}/api/v1/OffloadBaggage/Export/${flightScheduleId}`,
      {
        responseType: 'blob',
        headers,
      },
    );

    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute(
      'download',
      `Offload_Baggages_${new Date().toString()}.xlsx`,
    );
    document.body.appendChild(link);
    link.click();
    link.remove();
    return true;
  } catch (error: any) {
    if (error?.response?.status === 401 || error?.response?.status === 403) {
      redirect('/dashboard/403');
    }
    throw error;
  }
};
