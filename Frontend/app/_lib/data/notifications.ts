import { getAuthHeaders } from '../utils';
import { serverUrl } from '@/app/_services/envService';
import {
  NotificationPaginatedResponse,
  NotificationsListQuery,
  UnreadNotificationsResponseDto,
} from '@/app/_components/notifications/types';
import axios, { AxiosError } from 'axios';
import { redirect } from 'next/navigation';
import { tokenProvider } from '@/app/_services/tokenServices';

export async function fetchNotifications(
  params: NotificationsListQuery,
): Promise<NotificationPaginatedResponse> {
  try {
    const headers = await getAuthHeaders('Notification-GetNotifications');

    const { username } = await tokenProvider();

    if (!username) {
      throw new Error('User is not authenticated!');
    }

    const response = await axios.get<NotificationPaginatedResponse>(
      `${serverUrl}/api/v1/Notification/${username}`,
      {
        params,
        headers,
      },
    );
    return response.data;
  } catch (error: AxiosError | any) {
    if (error?.response?.status === 401 || error?.response?.status === 403) {
      redirect('/dashboard/403');
    }
    throw new Error('Failed to fetch new notifications!');
  }
}

export async function fetchNotificationDetails(id: number) {
  try {
    const headers = await getAuthHeaders('Notification-Detail');

    const response = await axios.get(
      `${serverUrl}/api/v1/Notification/Detail/${id}`,
      {
        headers,
      },
    );
    return response.data;
  } catch (error: AxiosError | any) {
    if (error?.response?.status === 401 || error?.response?.status === 403) {
      redirect('/dashboard/403');
    }
    throw new Error('Failed to fetch notification detail!');
  }
}

export async function fetchUnreadNotificationCount(): Promise<UnreadNotificationsResponseDto> {
  try {
    const headers = await getAuthHeaders('Notification-GetUnreadCount');

    const { username } = await tokenProvider();

    if (!username) {
      throw new Error('User is not authenticated!');
    }

    const response = await axios.get<UnreadNotificationsResponseDto>(
      `${serverUrl}/api/v1/Notification/GetUnreadCount/${username}`,
      {
        headers,
      },
    );
    return response.data;
  } catch (error: AxiosError | any) {
    if (error?.response?.status === 401 || error?.response?.status === 403) {
      redirect('/dashboard/403');
    }
    throw new Error('Failed to fetch unread notification count!');
  }
}
