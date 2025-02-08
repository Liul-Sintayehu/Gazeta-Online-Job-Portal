import axios from 'axios';
import { serverUrl } from '@/app/_services/envService';
import { EntityTypeValue } from '@/app/_components/attachments/constant';
import { ActionResponse } from '../definitions';
import { getAuthHeaders } from '../utils';
import { redirect } from 'next/navigation';

export async function createAttachment(
  formData: FormData,
  relatedEntityId: number,
  relatedEntityType: EntityTypeValue,
): Promise<ActionResponse<string>> {
  formData.append('RelatedEntityId', relatedEntityId.toString());
  formData.append('RelatedEntityType', relatedEntityType.toString());

  const claim: string = 'Attachment-Create';

  try {
    const headers = await getAuthHeaders(claim);

    const response = await axios.post(
      `${serverUrl}/api/v1/Attachment/Create`,
      formData,
      {
        headers: {
          ...headers,
          'Content-Type': 'multipart/form-data',
        },
      },
    );

    if (response.status === 200 || response.status === 201) {
      return {
        isSuccess: true,
        payload: 'Attachment created successfully!',
        errors: [],
      };
    }
    return {
      isSuccess: false,
      payload: null,
      errors: ['An unknown error occurred.'],
    };
  } catch (error: any) {
    if (error?.response?.status === 401 || error?.response?.status === 403) {
      redirect('/dashboard/403');
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
}

export async function deleteAttachment(
  attachmentId: number,
): Promise<ActionResponse> {
  const claim: string = 'Attachment-Delete';

  try {
    const headers = await getAuthHeaders(claim);
    const response = await axios.delete(
      `${serverUrl}/api/v1/Attachment/Delete/${attachmentId}`,
      {
        headers,
      },
    );

    if (response.status === 200 || response.status === 201) {
      return {
        isSuccess: true,
        payload: 'Attachment deleted successfully!',
        errors: [],
      };
    }
    return {
      isSuccess: false,
      payload: null,
      errors: ['An unknown error occurred.'],
    };
  } catch (error: any) {
    if (error?.response?.status === 401 || error?.response?.status === 403) {
      redirect('/dashboard/403');
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
}
