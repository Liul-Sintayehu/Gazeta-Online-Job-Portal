import axios from 'axios';
import { serverUrl } from '@/app/_services/envService';
import {
  DeleteWeaponRequestForm,
  HandlingStatusUpdateForm,
  SendAlertRequestForm,
} from '@/app/_components/weapon-alert/types';
import { UpdateEmployeeAssignment } from '@/app/_components/common/types';
import { getAuthHeaders } from '../utils';
import { redirect } from 'next/navigation';

export const createWeapon = async ({
  flightScheduleId,
  formData,
}: {
  flightScheduleId: number;
  formData: FormData;
}): Promise<boolean> => {
  try {
    const headers = await getAuthHeaders('Weapon-Create');

    const response = await axios.post(
      `${serverUrl}/api/v1/Weapon/Create/${flightScheduleId}`,
      formData,
      {
        headers: {
          ...headers,
          'Content-Type': 'multipart/form-data',
        },
      },
    );

    return (
      response.status === 200 ||
      response.status === 201 ||
      response.status === 204
    );
  } catch (error: any) {
    if (error?.response?.status === 401 || error?.response?.status === 403) {
      redirect('/dashboard/403');
    }
    if (error.response && error.response.data) {
      return error.response.data.errors[0] || 'An error occurred.';
    } else if (error.message) {
      return error.message;
    } else {
      throw Error(error.message);
    }
  }
};

export const updateWeapon = async ({
  id,
  formData,
}: {
  id: number;
  formData: FormData;
}): Promise<boolean> => {
  try {
    const headers = await getAuthHeaders('Weapon-Update');

    const response = await axios.put(
      `${serverUrl}/api/v1/Weapon/Update/${id}`,
      formData,
      {
        headers: {
          ...headers,
          'Content-Type': 'multipart/form-data',
        },
      },
    );

    return (
      response.status === 200 ||
      response.status === 201 ||
      response.status === 204
    );
  } catch (error: any) {
    if (error?.response?.status === 401 || error?.response?.status === 403) {
      redirect('/dashboard/403');
    }
    if (error.response && error.response.data) {
      return error.response.data.errors[0] || 'An error occurred.';
    } else if (error.message) {
      return error.message;
    } else {
      throw Error(error.message);
    }
  }
};

export const deleteWeapon = async (
  params: DeleteWeaponRequestForm,
): Promise<boolean> => {
  try {
    const headers = await getAuthHeaders('Weapon-Delete');

    const response = await axios.delete(
      `${serverUrl}/api/v1/Weapon/Delete/${params.id}`,
      { headers },
    );

    return (
      response.status === 200 ||
      response.status === 201 ||
      response.status === 204
    );
  } catch (error: any) {
    if (error.response && error.response.data) {
      return error.response.data.errors[0] || 'An error occurred.';
    } else if (error.message) {
      return error.message;
    } else {
      throw Error(error.message);
    }
  }
};

export const sendAlert = async (
  params: SendAlertRequestForm,
): Promise<boolean> => {
  try {
    const headers = await getAuthHeaders('WeaponAlert-SendAlert');

    const response = await axios.post(
      `${serverUrl}/api/v1/WeaponAlert/SendAlert/${params.flightScheduleId}`,
      {
        remark: params.remark,
      },
      {
        headers,
      },
    );

    if (
      response.status === 401 ||
      response.status === 404 ||
      response.status === 400
    ) {
      throw Error(response.data.errors[0]);
    }

    return response.status === 200;
  } catch (error: any) {
    if (error?.response?.status === 401 || error?.response?.status === 403) {
      redirect('/dashboard/403');
    }
    if (error.response && error.response.data) {
      throw Error(
        error.response.data.errors[0] ||
          'Failed to send weapon alert, Please try again!',
      );
    } else if (error.message) {
      throw Error(error.message);
    } else {
      throw Error(error.message);
    }
  }
};

export const assignOfficer = async (
  params: UpdateEmployeeAssignment,
): Promise<boolean> => {
  try {
    const headers = await getAuthHeaders('WeaponAlert-AssignOfficer');

    const response = await axios.post(
      `${serverUrl}/api/v1/WeaponAlert/AssignOfficer/${params.id}`,
      {
        officerId: params.assignedToEmployeeId,
      },
      {
        headers,
      },
    );

    if (
      response.status === 401 ||
      response.status === 404 ||
      response.status === 400
    ) {
      throw Error(response.data.errors[0]);
    }

    return (
      response.status === 200 ||
      response.status === 201 ||
      response.status === 204
    );
  } catch (error: any) {
    if (error?.response?.status === 401 || error?.response?.status === 403) {
      redirect('/dashboard/403');
    }
    if (error.response && error.response.data) {
      throw Error(
        error.response.data.errors[0] ||
          'Failed to assigning officer, Please try again!',
      );
    } else if (error.message) {
      throw Error(error.message);
    } else {
      throw Error(error.message);
    }
  }
};

export const updateHandleStatus = async (
  params: HandlingStatusUpdateForm,
): Promise<boolean> => {
  try {
    const headers = await getAuthHeaders('WeaponAlert-UpdateHandle');

    const response = await axios.put(
      `${serverUrl}/api/v1/WeaponAlert/UpdateHandle/${params.id}`,
      {
        handleStatus: params.handleStatus,
      },
      {
        headers,
      },
    );

    if (
      response.status === 401 ||
      response.status === 404 ||
      response.status === 400
    ) {
      throw Error(response.data.errors[0]);
    }

    return response.status === 200;
  } catch (error: any) {
    if (error?.response?.status === 401 || error?.response?.status === 403) {
      redirect('/dashboard/403');
    }
    if (error.response && error.response.data) {
      throw Error(
        error.response.data.errors[0] ||
          'Failed to send weapon alert, Please try again!',
      );
    } else if (error.message) {
      throw Error(error.message);
    } else {
      throw Error(error.message);
    }
  }
};
