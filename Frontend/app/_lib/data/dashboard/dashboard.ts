import axios, { AxiosError, AxiosResponse } from 'axios';
import { redirect } from 'next/navigation';
import { ActionResponse } from '../../definitions';
import { serverUrl } from '@/app/_services/envService';
import { getAuthHeaders } from '../../utils';
import {
  ClearanceDashboardResponseDto,
  EscortDashboardResponseDto,
  IncidentDashboardResponseDto,
  InvestigationDashboardResponseDto,
  LostAndFoundDashboardResponseDto,
  MasterDataDashboardResponseDto,
  OffloadBaggageDashboardResponseDto,
  WeaponAlertDashboardResponseDto,
} from '@/app/_components/dashboard/types';

// Generic GET request function
export const getRequest = async <T>(
  endpoint: string,
  queryParams: Record<string, any> = {},
  headerProvider: () => Promise<Record<string, string>>,
): Promise<ActionResponse<T>> => {
  try {
    const headers = await headerProvider();

    const response: AxiosResponse<T> = await axios.get(endpoint, {
      params: queryParams,
      headers,
    });

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
    // if (error?.response?.status === 401 || error?.response?.status === 403) {
    //   redirect('/dashboard/403');
    // }

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

export const fetchMasterDataDashboard = async (
  params: Record<string, any>,
): Promise<ActionResponse<MasterDataDashboardResponseDto>> => {
  return getRequest(
    `${serverUrl}/api/v1/Dashboard/MasterData`,
    params,
    async () => await getAuthHeaders('Dashboard-MasterData'),
  );
};

export const fetchClearanceDashboard = async (
  params: Record<string, any>,
): Promise<ActionResponse<ClearanceDashboardResponseDto>> => {
  return getRequest(
    `${serverUrl}/api/v1/Dashboard/Clearance`,
    params,
    async () => await getAuthHeaders('Dashboard-Clearance'),
  );
};

export const fetchWeaponAlertDashboard = async (
  params: Record<string, any>,
): Promise<ActionResponse<WeaponAlertDashboardResponseDto>> => {
  return getRequest(
    `${serverUrl}/api/v1/Dashboard/WeaponAlert`,
    params,
    async () => await getAuthHeaders('Dashboard-WeaponAlert'),
  );
};

export const fetchIncidentDashboard = async (
  params: Record<string, any>,
): Promise<ActionResponse<IncidentDashboardResponseDto[]>> => {
  return getRequest(
    `${serverUrl}/api/v1/Dashboard/Incident`,
    params,
    async () => await getAuthHeaders('Dashboard-Incident'),
  );
};

export const fetchInvestigationDashboard = async (
  params: Record<string, any>,
): Promise<ActionResponse<InvestigationDashboardResponseDto[]>> => {
  return getRequest(
    `${serverUrl}/api/v1/Dashboard/Investigation`,
    params,
    async () => await getAuthHeaders('Dashboard-Investigation'),
  );
};

export const fetchOffloadBaggageDashboard = async (
  params: Record<string, any>,
): Promise<ActionResponse<OffloadBaggageDashboardResponseDto[]>> => {
  return getRequest(
    `${serverUrl}/api/v1/Dashboard/OffloadBaggage`,
    params,
    async () => await getAuthHeaders('Dashboard-OffloadBaggage'),
  );
};

export const fetchEscortDashboard = async (
  params: Record<string, any>,
): Promise<ActionResponse<EscortDashboardResponseDto[]>> => {
  return getRequest(
    `${serverUrl}/api/v1/Dashboard/Escort`,
    params,
    async () => await getAuthHeaders('Dashboard-Escort'),
  );
};

export const fetchLostAndFoundDashboard = async (
  params: Record<string, any>,
): Promise<ActionResponse<LostAndFoundDashboardResponseDto[]>> => {
  return getRequest(
    `${serverUrl}/api/v1/Dashboard/LostAndFound`,
    params,
    async () => await getAuthHeaders('Dashboard-LostAndFound'),
  );
};
