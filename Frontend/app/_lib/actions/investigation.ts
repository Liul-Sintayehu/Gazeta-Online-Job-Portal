import { serverUrl } from '@/app/_services/envService';
import {
  CreateInvestigationRequestDto,
  Investigation,
  UpdateInvestigationRequestDto,
} from '@/app/_components/incident-handling/investigations/types';
import axios from 'axios';
import { getAuthHeaders } from '../utils';
import { redirect } from 'next/navigation';

export const createInvestigation = async (
  params: CreateInvestigationRequestDto,
): Promise<Investigation> => {
  try {
    const headers = await getAuthHeaders('Investigation-Create');

    const response = await axios.post(
      `${serverUrl}/api/v1/Investigation/Create`,
      params,
      { headers },
    );
    if (response.status === 200) {
      return response.data;
    } else {
      throw new Error('Failed to create investigations');
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

export const updateInvestigation = async (params: {
  id: number;
  investigationUpdateRequest: UpdateInvestigationRequestDto;
}): Promise<boolean> => {
  try {
    const headers = await getAuthHeaders('Investigation-Update');

    const response = await axios.put(
      `${serverUrl}/api/v1/Investigation/Update/${params.id}`,
      params.investigationUpdateRequest,
      { headers },
    );

    return response.status === 200;
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

export const deleteInvestigation = async (
  id: number,
): Promise<boolean | any> => {
  try {
    const headers = await getAuthHeaders('Investigation-Delete');

    const response = await axios.delete(
      `${serverUrl}/api/v1/Investigation/Delete/${id}`,
      { headers },
    );

    return response.status === 200;
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

export const signTeamLeader = async (params: {
  id: number;
  signature: File;
  comment: string | null;
}): Promise<boolean> => {
  try {
    const headers = await getAuthHeaders('Investigation-SignTeamLeader');
    const formData = new FormData();
    formData.append('Signature', params.signature);
    formData.append('Comment', params.comment ?? '');

    const response = await axios.post<boolean>(
      `${serverUrl}/api/v1/Investigation/SignTeamLeader/${params.id}`,
      formData,
      {
        headers: {
          ...headers,
          'Content-Type': 'multipart/form-data',
        },
      },
    );

    return response.status === 200;
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

export const signInvestigator = async (params: {
  id: number;
  signature: File;
  comment: string | null;
}): Promise<boolean> => {
  try {
    const headers = await getAuthHeaders('Investigation-SignInvestigator');

    const formData = new FormData();
    formData.append('Signature', params.signature);
    formData.append('Comment', params.comment ?? '');

    const response = await axios.post<boolean>(
      `${serverUrl}/api/v1/Investigation/SignInvestigator/${params.id}`,
      formData,
      {
        headers: {
          ...headers,
          'Content-Type': 'multipart/form-data',
        },
      },
    );

    return response.status === 200;
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

export const selectTeamLeader = async (params: {
  id: number;
  teamLeaderId: number;
}): Promise<boolean> => {
  try {
    const headers = await getAuthHeaders('Investigation-SelectTeamLeader');
    const response = await axios.post<boolean>(
      `${serverUrl}/api/v1/Investigation/SelectTeamLeader/${params.id}`,
      { teamLeaderId: params.teamLeaderId },
      { headers },
    );

    return response.status === 200;
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

export const removeInvestigatorSignature = async (
  id: number,
): Promise<boolean> => {
  try {
    const headers = await getAuthHeaders(
      'Investigation-RemoveInvestigatorSignature',
    );
    const response = await axios.delete(
      `${serverUrl}/api/v1/Investigation/RemoveInvestigatorSignature/${id}`,
      { headers },
    );

    return response.status === 200;
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

export const removeTeamLeaderSignature = async (
  id: number,
): Promise<boolean> => {
  try {
    const headers = await getAuthHeaders(
      'Investigation-RemoveTeamLeaderSignature',
    );
    const response = await axios.delete(
      `${serverUrl}/api/v1/Investigation/RemoveTeamLeaderSignature/${id}`,
      { headers },
    );

    return response.status === 200;
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
