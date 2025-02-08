import { UpdateApprovalLogRequest } from '@/app/_components/clearance/types';
import { serverUrl } from '@/app/_services/envService';
import axios from 'axios';
import { getAuthHeaders } from '../utils';
import { redirect } from 'next/navigation';

export const pushForApproval = async (
  clearanceAssignmentId: number,
): Promise<boolean> => {
  try {
    const headers = await getAuthHeaders('SubTaskAssignment-PushForApproval');

    const response = await axios.post(
      `${serverUrl}/api/v1/ClearanceAssignment/PushForApproval`,
      {
        clearanceAssignmentId: clearanceAssignmentId,
      },
      {
        headers,
      },
    );

    if (
      response.status === 200 ||
      response.status === 201 ||
      response.status === 204
    ) {
      return true;
    } else {
      return false;
    }
  } catch (error: any) {
    if (error?.response?.status === 401 || error?.response?.status === 403) {
      redirect('/dashboard/403');
    }
    if (error.response?.data.statusCode == 400) {
      throw new Error(error.response?.data.errors[0]);
    }

    if (error.response?.data?.errors?.length) {
      return error.response.data.errors[0] || 'An error occurred.';
    } else if (error.response?.data?.message) {
      return error.response.data.message || 'An error occurred.';
    } else if (error.message) {
      return error.message;
    } else {
      return false;
    }
  }
};

export const updateTeamLeaderApproval = async (
  updateForm: UpdateApprovalLogRequest,
): Promise<boolean> => {
  try {
    const headers = await getAuthHeaders(
      'ClearanceAssignment-UpdateTeamLeaderApproval',
    );

    const response = await axios.put(
      `${serverUrl}/api/v1/ClearanceAssignment/UpdateTeamLeaderApproval/${updateForm.clearanceAssignmentId}`,
      {
        action: updateForm.action,
        remark: updateForm.remark,
      },
      {
        headers,
      },
    );

    if (response.status === 200) {
      return true;
    } else {
      return false;
    }
  } catch (error: any) {
    if (error?.response?.status === 401 || error?.response?.status === 403) {
      redirect('/dashboard/403');
    }
    if (error.response?.data.statusCode == 400) {
      throw new Error(error.response?.data.errors);
    }

    // Improved error handling logic
    if (error.response?.data?.errors?.length) {
      return error.response.data.errors[0] || 'An error occurred.';
    } else if (error.response?.data?.message) {
      return error.response.data.message || 'An error occurred.';
    } else if (error.message) {
      return error.message;
    } else {
      return false;
    }
  }
};

// Update the approval log
export const updatePilotApproval = async (
  updateForm: UpdateApprovalLogRequest,
): Promise<boolean> => {
  try {
    const headers = await getAuthHeaders(
      'ClearanceAssignment-UpdatePilotApproval',
    );

    const response = await axios.put(
      `${serverUrl}/api/v1/ClearanceAssignment/UpdatePilotApproval/${updateForm.clearanceAssignmentId}`,
      {
        action: updateForm.action,
        remark: updateForm.remark,
      },
      {
        headers,
      },
    );

    if (response.status === 200) {
      return true;
    } else {
      return false;
    }
  } catch (error: any) {
    if (error?.response?.status === 401 || error?.response?.status === 403) {
      redirect('/dashboard/403');
    }
    if (error.response?.status == 400) {
      throw new Error(error.response.data.errors[0]);
    }

    if (error.response?.data?.errors?.length) {
      return error.response.data.errors[0] || 'An error occurred.';
    } else if (error.response?.data?.message) {
      return error.response.data.message || 'An error occurred.';
    } else if (error.message) {
      return error.message;
    } else {
      return false;
    }
  }
};
