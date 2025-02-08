import { serverUrl } from '@/app/_services/envService';
import axios from 'axios';
import { getAuthHeaders } from '../utils';
import { redirect } from 'next/navigation';

interface Position {
  id: number;
  name: string;
  description: string;
  recordStatus: number;
}

interface Employee {
  id: number;
  employeeId: string;
  firstName: string;
  middleName: string;
  lastName: string;
  email: string;
  shift: number;
  shiftName: string;
  firstSupId: string;
  positionId: number;
  position: Position;
  recordStatus: number;
}

interface DataSearch {
  dataToSearch: {
    employeeId: string;
    firstName: string;
    middleName: string;
    lastName: string;
    firstSupId: string;
    positionId?: number;
  };
}
interface Data {
  dataToSend: any;
}
interface DataUpdated {
  dataToUpdate: any;
}
interface StatusUpdate {
  status: number;
  id: number;
}
interface DataDeleted {
  dataToDelete: {
    id: number;
  };
}

export const CreateEmployee = async (params: Data) => {
  try {
    const headers = await getAuthHeaders('Employee-Create');

    const response = await axios.post(
      `${serverUrl}/api/v1/Employee/Create`,
      params.dataToSend,
      {
        headers,
      },
    );

    const data = response.data;
    return data;
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

export const UpdateEmployee = async (params: DataUpdated) => {
  try {
    const headers = await getAuthHeaders('Employee-Update');

    const response = await axios.put(
      `${serverUrl}/api/v1/Employee/Update/${params.dataToUpdate.id}`,
      params.dataToUpdate,
      {
        headers,
      },
    );

    if (response.status == 200) {
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

export const UpdateEmployeeStatus = async ({ id, status }: StatusUpdate) => {
  try {
    const headers = await getAuthHeaders('Employee-UpdateStatus');

    const response = await axios.put(
      `${serverUrl}/api/v1/Employee/UpdateStatus/${id}`,
      { status },
      {
        headers,
      },
    );

    if (response.status == 200) {
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
export const DeleteEmployee = async (
  params: DataDeleted,
): Promise<boolean | any> => {
  try {
    const { id } = params.dataToDelete;
    const headers = await getAuthHeaders('Employee-Delete');

    const response = await axios.delete(
      `${serverUrl}/api/v1/Employee/Delete/${id}`,
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
    if (error.response && error.response.data) {
      return error.response.data.errors[0] || 'An error occurred.';
    } else if (error.message) {
      return error.message;
    } else {
      return 'An unknown error occurred.';
    }
  }
};

export const searchEmployees = async (
  params: DataSearch,
): Promise<Employee[] | any> => {
  const { dataToSearch } = params;

  const queryParams: any = { ...dataToSearch };

  if (queryParams.positionId === 0) {
    delete queryParams.positionId;
  }

  try {
    const headers = await getAuthHeaders('Employee-Search');

    const response = await axios.get(`${serverUrl}/api/v1/Employee/Search`, {
      params: queryParams,
      headers,
    });

    const data: Employee[] = response.data;

    return data;
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

export const UploadExcel = async (file: File) => {
  try {
    const formData = new FormData();
    formData.append('excelFile', file);

    const headers = await getAuthHeaders('Employee-Upload');
    const response = await axios.post(
      `${serverUrl}/api/v1/Employee/ImportBulkEmployee`,
      formData,
      {
        headers,
      },
    );

    return true;
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
