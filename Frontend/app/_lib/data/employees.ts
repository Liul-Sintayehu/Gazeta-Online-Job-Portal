import { Employee } from '@/app/_components/common/types';
import { serverUrl } from '@/app/_services/envService';
import axios from 'axios';
import { redirect } from 'next/navigation';
import { getAuthHeaders } from '../utils';

export const fetchEmployees = async ({
  position,
}: { position?: string } = {}): Promise<Employee[]> => {
  try {
    const headers = await getAuthHeaders('Employee-GetAll'); // Get headers dynamically

    const response = await axios.get<Employee[]>(
      `${serverUrl}/api/v1/Employee${position ? `?position=${position}` : ''}`,
      {
        headers,
      },
    );

    return response.data;
  } catch (error: any) {
    if (error?.response?.status == 401 || error?.response?.status == 403) {
      redirect('/dashboard/403');
    }
    return [];
  }
};

interface LoadingProps {
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
}

export const DownloadTemplate = async ({ setLoading }: LoadingProps) => {
  setLoading(true);

  try {
    const headers = await getAuthHeaders('Employee-Upload'); // Get headers dynamically

    const response = await axios.get(
      `${serverUrl}/api/v1/Employee/DownloadExcelTemplate`,
      {
        responseType: 'blob',
        headers,
      },
    );

    const url = window.URL.createObjectURL(new Blob([response.data]));

    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'Employee_Mass_Upload_Template.xlsx');

    document.body.appendChild(link);
    link.click();
    link.remove();

    window.URL.revokeObjectURL(url);
  } catch (error) {
    // Handle error
  } finally {
    setLoading(false);
  }
};
