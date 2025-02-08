import axios from 'axios';
import { serverUrl } from '@/app/_services/envService';
import {
  AllWeaponAlertHandlingResponse,
  FetchParameter,
  FlightQueryParams,
  Weapon,
  WeaponHandlingResponse,
} from '@/app/_components/weapon-alert/types';
import { getAuthHeaders } from '../utils';
import { redirect } from 'next/navigation';

export const fetchWeapons = async (
  params: FetchParameter,
): Promise<Weapon[] | undefined> => {
  try {
    const headers = await getAuthHeaders('Weapon-GetAll');

    const response = await axios.get<Weapon[]>(
      `${serverUrl}/api/v1/Weapon/${params.flightScheduleId}`,
      { headers },
    );

    return response.data;
  } catch (error) {
    throw error;
  }
};

export const exportWeaponsList = async (
  params: FetchParameter,
): Promise<boolean> => {
  try {
    const headers = await getAuthHeaders('Weapon-Export');

    const response = await axios.get(
      `${serverUrl}/api/v1/Weapon/Export/${params.flightScheduleId}`,
      {
        headers,
        responseType: 'blob',
      },
    );

    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute(
      'download',
      `Weapons_List_${new Date().toLocaleTimeString()}.xlsx`,
    );
    document.body.appendChild(link);
    link.click();
    link.remove();
    return true;
  } catch (error) {
    throw error;
  }
};

export const isAlertAlreadySent = async (params: FetchParameter) => {
  try {
    const headers = await getAuthHeaders('WeaponAlert-GetAll');

    const response = await axios.get(
      `${serverUrl}/api/v1/WeaponAlert/IsAlertSent/${params.flightScheduleId}`,
      { headers },
    );

    if (response.status === 200) {
      return response.data;
    } else {
      throw new Error('Failed to get weapon alert status for the flight!');
    }
  } catch (error) {
    throw error;
  }
};

export const fetchWeaponAlertById = async (
  params: FetchParameter,
): Promise<WeaponHandlingResponse> => {
  try {
    const headers = await getAuthHeaders('WeaponAlert-GetById');

    const response = await axios.get(
      `${serverUrl}/api/v1/WeaponAlert/${params.flightScheduleId}`,
      { headers },
    );

    if (response.status === 200 || response.status === 204) {
      return response.data;
    } else {
      throw new Error('Failed to get weapon alert for the flight!');
    }
  } catch (error: any) {
    if (error?.response?.status === 404) {
      throw Error('404 | Not Found');
    } else {
      throw error;
    }
  }
};

export const fetchAllWeaponAlert = async (
  params: FlightQueryParams,
): Promise<AllWeaponAlertHandlingResponse> => {
  try {
    const headers = await getAuthHeaders('WeaponAlert-GetAll');

    const response = await axios.get(`${serverUrl}/api/v1/WeaponAlert`, {
      params,
      headers,
    });

    if (response.status === 200 || response.status === 204) {
      return response.data;
    } else {
      throw new Error('Failed to get weapon alert for the flight!');
    }
  } catch (error) {
    throw error;
  }
};
