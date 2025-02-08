import { getAuthHeaders } from '../utils';
import { FlightScheduleDetailDto } from '@/app/_components/clearance/types';
import {
  FlightDataSearch,
  FlightScheduleResponseDto,
} from '@/app/_components/common/types';
import { serverUrl } from '@/app/_services/envService';
import axios, { AxiosError } from 'axios';
import { redirect } from 'next/navigation';
import { ActionResponse } from '../definitions';

interface DataById {
  dataToFetch: {
    id: number;
  };
}

interface DataDate {
  dataToSearch: {
    scheduledDepartureDate: Date;
  };
}

export const fetchFlightSchedule = async () => {
  try {
    const headers = await getAuthHeaders('FlightSchedule-GetAll');

    const response = await axios.get(`${serverUrl}/api/v1/FlightSchedule`, {
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

export const fetchFlightScheduleByDate = async (params: DataDate) => {
  const year = params.dataToSearch.scheduledDepartureDate.getFullYear();
  const month = params.dataToSearch.scheduledDepartureDate.getMonth();
  const day = params.dataToSearch.scheduledDepartureDate.getDate();
  const scheduledDepartureDate = `${year}-${month + 1}-${day}`;

  try {
    const headers = await getAuthHeaders('FlightSchedule-Search');

    const response = await axios.get(
      `${serverUrl}/api/v1/FlightTask/GetAllByDepartureDate`,
      {
        params: { scheduledDepartureDate: scheduledDepartureDate },
        headers,
      },
    );
    const data = response.data;
    return data;
  } catch (error: any) {
    if (error?.response?.status === 401 || error?.response?.status === 403) {
      redirect('/dashboard/403');
    }
    return [];
  }
};

export const fetchFlightScheduleById = async (params: DataById) => {
  try {
    const { id } = params.dataToFetch;
    const headers = await getAuthHeaders('FlightSchedule-Get');

    const response = await axios.get(
      `${serverUrl}/api/v1/FlightSchedule/${id}`,
      {
        headers,
      },
    );

    if (response.status === 200 || response.status === 201) {
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

export const fetchFlightScheduleByAssignmentId = async ({
  majorTaskAssignmentId,
}: {
  majorTaskAssignmentId: number;
}): Promise<FlightScheduleDetailDto> => {
  try {
    const headers = await getAuthHeaders('FlightSchedule-GetByAssignmentId');

    const response = await axios.get(
      `${serverUrl}/api/v1/FlightSchedule/GetByAssignmentId/${majorTaskAssignmentId}`,
      {
        headers,
      },
    );

    if (response.status === 200) {
      return response.data;
    } else {
      throw new Error(
        `Failed to fetch flight Schedule. Status code:  ${response.status}`,
      );
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

export const SearchFlight = async (
  params: FlightDataSearch,
): Promise<ActionResponse<FlightScheduleResponseDto>> => {
  try {
    const headers = await getAuthHeaders('FlightSchedule-Search');

    const response = await axios.get<FlightScheduleResponseDto>(
      `${serverUrl}/api/v1/FlightSchedule/Search`,
      {
        headers,
        params,
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
