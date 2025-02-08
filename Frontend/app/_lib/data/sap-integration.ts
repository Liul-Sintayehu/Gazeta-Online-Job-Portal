import axios, { AxiosError } from 'axios';
import { ActionResponse } from '../definitions';
import { serverUrl } from '@/app/_services/envService';
import { getAuthHeaders } from '../utils';
import { redirect } from 'next/navigation';

// Leave detail interface
interface LeaveDetail {
  pernr: string; // Personnel number
  subtyp: string; // Subtype
  leavE_TXT: string; // Leave text description
  beG_DATE: string; // Beginning date in ISO format
  enD_DATE: string; // End date in ISO format
  status: string; // Leave status
}

// Fetch employee leave params
interface FetchEmployeeLeaveParams {
  employeeId: string;
  date: string;
}

export const fetchEmployeeLeave = async (
  params: FetchEmployeeLeaveParams,
): Promise<ActionResponse<LeaveDetail[]>> => {
  try {
    const headers = await getAuthHeaders('PostAssignment-Add');

    const response = await axios.get<LeaveDetail[]>(
      `${serverUrl}/api/v1/Sap/GetLeave`,
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
    if (error.response && error.response.data) {
      if (error.response.status === 401 || error.response.status === 403) {
        redirect('/dashboard/403');
      }
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

// Shift detail interface
interface ShiftDetail {
  datum: string; // Date in ISO format
  motpr: string; // Motivation or process code
  tprog: string; // Time program
  tagty: string; // Tag type
  ftkla: string; // Classification type
  varia: string; // Variation or remarks
  tpklA: string; // Specific key
  dzmodn: string; // Mode or designation
  stdaz: string; // Standard hours
  activ: string; // Activity indicator
  nat01: string; // Nature of time 01
  nat02: string; // Nature of time 02
  pamod: string; // Mode or designation
  empId: string; // Employee ID
  tptxt: string; // Time program text
  sobeg: string; // Start time
  soend: string; // End time
}

// Fetch employee shift params
interface FetchEmpoyeeShiftParams {
  employeeId: string;
  beginDate: string;
  endDate: string;
}

export const fetchEmpoyeeShift = async (
  params: FetchEmpoyeeShiftParams,
): Promise<ActionResponse<ShiftDetail[]>> => {
  try {
    const headers = await getAuthHeaders('PostAssignment-Add');

    const response = await axios.get<ShiftDetail[]>(
      `${serverUrl}/api/v1/Sap/GetShift`,
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
    if (error.response && error.response.data) {
      if (error.response.status === 401 || error.response.status === 403) {
        redirect('/dashboard/403');
      }
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
