import { serverUrl } from '@/app/_services/envService';
import axios, { AxiosError } from 'axios';
import {
  AllSubTasksAssignmentRequest,
  ClearanceFillAllFormRequest,
  ClearanceFormRequest,
  EmployeeAssignment,
  SelectApprovingEmployeeRequest,
  UpdateEmployeeAssignment,
} from '@/app/_components/clearance/types';
import { getAuthHeaders } from '../utils';
import { redirect } from 'next/navigation';
import { ActionResponse } from '../definitions';

// Assign all tasks for one employee
export const assignAllSubTasks = async (
  params: AllSubTasksAssignmentRequest,
) => {
  try {
    const headers = await getAuthHeaders('SubTaskAssignment-Create');

    const response = await axios.post(
      `${serverUrl}/api/v1/SubTaskAssignment/AssignAll`,
      params,
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
      throw Error(response.data.errors[0] || 'Failed to assign all tasks.');
    }
  } catch (error: any) {
    if (error?.response?.status === 401 || error?.response?.status === 403) {
      redirect('/dashboard/403');
    }
    throw Error(error.message ?? 'Failed to assign all tasks.');
  }
};

// Assign one task
export const assignSubTask = async (
  params: EmployeeAssignment,
): Promise<boolean> => {
  try {
    const headers = await getAuthHeaders('SubTaskAssignment-Create');

    const response = await axios.post(
      `${serverUrl}/api/v1/SubTaskAssignment/Assign`,
      params,
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
      throw Error(response.data.errors[0] || 'An error occurred.');
    }
  } catch (error: any) {
    if (error?.response?.status === 401 || error?.response?.status === 403) {
      redirect('/dashboard/403');
    }
    throw Error(error.message);
  }
};

export const updateAssignSubTask = async (
  params: UpdateEmployeeAssignment,
): Promise<boolean> => {
  const { assignmentId } = params;
  try {
    const headers = await getAuthHeaders('SubTaskAssignment-Create');

    const response = await axios.put(
      `${serverUrl}/api/v1/SubTaskAssignment/Update/${assignmentId}`,
      params,
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
      throw Error(response.data.response[0] || 'An error occurred.');
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
      throw Error('An unknown error occurred.');
    }
  }
};

export const deleteAssignSubTask = async (
  id: number,
): Promise<boolean | any> => {
  try {
    const headers = await getAuthHeaders('SubTaskAssignment-Delete');

    const response = await axios.delete(
      `${serverUrl}/api/v1/SubTaskAssignment/Delete/${id}`,
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
    if (error.response && error.response.data) {
      return error.response.data.errors[0] || 'An error occurred.';
    } else if (error.message) {
      return error.message;
    } else {
      return 'An unknown error occurred.';
    }
  }
};

// Fill all clearance form function
export const fillAllClearanceForm = async (
  clearanceForm: ClearanceFillAllFormRequest,
): Promise<ActionResponse<boolean>> => {
  try {
    const headers = await getAuthHeaders('SubTaskAssignment-FillForm');

    const response = await axios.post(
      `${serverUrl}/api/v1/SubTaskAssignment/FillAllForm`,
      clearanceForm,
      {
        headers,
      },
    );

    if (
      response.status === 200 ||
      response.status === 201 ||
      response.status === 204
    ) {
      return {
        isSuccess: true,
        payload: true,
        errors: [],
      };
    }

    return {
      isSuccess: false,
      payload: null,
      errors: ['An unknown error occurred.'],
    };
  } catch (error: AxiosError | any) {
    if (error?.response?.status === 401 || error?.response?.status === 403) {
      return {
        isSuccess: false,
        payload: null,
        errors: ['Unauthorized to perform the action.'],
      };
    }
    const errors = error.response?.data?.errors || [
      error.message || 'An unknown error occurred.',
    ];
    return {
      isSuccess: false,
      payload: null,
      errors,
    };
  }
};

// Fill clearance form function
export const fillClearanceForm = async (
  clearanceForm: ClearanceFormRequest,
) => {
  try {
    const headers = await getAuthHeaders('SubTaskAssignment-FillForm');

    const response = await axios.post(
      `${serverUrl}/api/v1/SubTaskAssignment/FillForm`,
      clearanceForm,
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
    if (error.response.status === 400) {
      throw new Error(
        error.response.data.errors[0] || 'Failed to submit the form!',
      );
    }
    if (error.response && error.response.data) {
      return error.response.data.errors[0] || 'An error occurred.';
    } else if (error.message) {
      return error.message;
    } else {
      throw new Error(error.message);
    }
  }
};

export const selectApprovingPilot = async (
  request: SelectApprovingEmployeeRequest,
): Promise<boolean> => {
  try {
    const headers = await getAuthHeaders('ClearanceAssignment-SelectPilot');

    const response = await axios.put(
      `${serverUrl}/api/v1/ClearanceAssignment/AddPilot`,
      {
        clearanceAssignmentId: request.clearanceAssignmentId,
        responsiblePilotId: request.responsiblePilotId,
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
