import { serverUrl } from '@/app/_services/envService';
import axios from 'axios';
import { getAuthHeaders } from '../utils';
import { redirect } from 'next/navigation';

export const fetchReportPdf = async (clearanceAssignmentId: number) => {
  try {
    const headers = await getAuthHeaders('Report-GeneratePdf');

    const response = await axios.get(
      `${serverUrl}/api/v1/Report/GeneratePdf/${clearanceAssignmentId}`,
      {
        responseType: 'blob',
        headers,
      },
    );

    const fileBlob = response.data;
    const file = new Blob([fileBlob], { type: 'application/pdf' });
    const fileUrl = URL.createObjectURL(file);

    return fileUrl;
  } catch (err: any) {
    if (err?.response?.status === 401 || err?.response?.status === 403) {
      redirect('/dashboard/403');
    }
    throw err;
  }
};
