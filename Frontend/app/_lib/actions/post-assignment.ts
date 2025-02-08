import { serverUrl } from '@/app/_services/envService';
import axios, { AxiosError } from 'axios';
import { ActionResponse } from '../definitions';
import {
  CreatePostAssignmentRequestDto,
  PostAssignmentResponseDto,
  UpdatePostAssignmentRequestDto,
} from '@/components/ui/officer-assignment/posts/types';
import { getAuthHeaders } from '../utils';

interface CreatePostAssignmentProps {
  data: CreatePostAssignmentRequestDto;
}

interface UpdatePostAssignmentProps {
  id: number;
  data: UpdatePostAssignmentRequestDto;
}

const handleApiRequest = async <T>(
  method: 'POST' | 'PUT' | 'DELETE',
  url: string,
  data?: any,
  headers?: Record<string, string>,
): Promise<ActionResponse<T>> => {
  try {
    const response = await axios({
      method,
      url,
      data,
      headers,
    });

    if (response.status === 200 || response.status === 201) {
      return {
        isSuccess: true,
        payload: response.data,
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

export const createPostAssignment = async ({
  data,
}: CreatePostAssignmentProps): Promise<
  ActionResponse<PostAssignmentResponseDto>
> => {
  const claim: string = 'PostAssignment-Add';
  const headers = await getAuthHeaders(claim);
  return handleApiRequest<PostAssignmentResponseDto>(
    'POST',
    `${serverUrl}/api/v1/PostAssignment/Create`,
    data,
    headers,
  );
};

export const updatePostAssignment = async ({
  id,
  data,
}: UpdatePostAssignmentProps): Promise<
  ActionResponse<PostAssignmentResponseDto>
> => {
  const claim: string = 'PostAssignment-Update';
  const headers = await getAuthHeaders(claim);
  return handleApiRequest<PostAssignmentResponseDto>(
    'PUT',
    `${serverUrl}/api/v1/PostAssignment/Update/${id}`,
    data,
    headers,
  );
};

export const deletePostAssignment = async (
  id: number,
): Promise<ActionResponse<boolean>> => {
  const claim: string = 'PostAssignment-Remove';
  const headers = await getAuthHeaders(claim);
  return handleApiRequest<boolean>(
    'DELETE',
    `${serverUrl}/api/v1/PostAssignment/Delete/${id}`,
    undefined,
    headers,
  );
};
