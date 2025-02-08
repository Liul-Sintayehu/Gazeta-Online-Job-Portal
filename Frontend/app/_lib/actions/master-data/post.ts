import { serverUrl } from '@/app/_services/envService';
import { ActionResponse } from '../../definitions';
import {
  PostRequestDto,
  PostResponseDto,
} from '@/components/ui/master_data/post/types';
import axios, { AxiosError } from 'axios';
import { getAuthHeaders } from '../../utils';

const handleError = (
  error: AxiosError | any,
): ActionResponse<PostResponseDto> => {
  if (error?.response?.status === 401 || error?.response?.status === 403) {
    return {
      isSuccess: false,
      payload: null,
      errors: ['Unauthorized to perform the action.'],
    };
  }

  if (error.response && error.response.data) {
    return {
      isSuccess: false,
      payload: null,
      errors: error.response.data.errors || ['An unknown error occurred.'],
    };
  } else if (error.message) {
    return {
      isSuccess: false,
      payload: null,
      errors: [error.message],
    };
  } else {
    return {
      isSuccess: false,
      payload: null,
      errors: ['An unknown error occurred.'],
    };
  }
};

const handleSuccess = <T>(response: T): ActionResponse<T> => ({
  isSuccess: true,
  payload: response,
  errors: [],
});

export const createPost = async (
  data: PostRequestDto,
): Promise<ActionResponse<PostResponseDto>> => {
  try {
    const headers = await getAuthHeaders('Post-Create');

    const response = await axios.post<PostResponseDto>(
      `${serverUrl}/api/v1/Post/Create`,
      data,
      {
        headers,
      },
    );

    if (response.status === 200 || response.status === 201) {
      return handleSuccess(response.data);
    } else {
      return {
        isSuccess: false,
        payload: null,
        errors: ['An unknown error occurred.'],
      };
    }
  } catch (error: any) {
    return handleError(error);
  }
};

// Update Post
interface PostUpdateProps {
  id: number;
  data: PostRequestDto;
}
export const updatePost = async ({
  id,
  data,
}: PostUpdateProps): Promise<ActionResponse<PostResponseDto>> => {
  try {
    const headers = await getAuthHeaders('Post-Update');

    const response = await axios.put<PostResponseDto>(
      `${serverUrl}/api/v1/Post/Update/${id}`,
      data,
      {
        headers,
      },
    );

    if (response.status === 200 || response.status === 201) {
      return handleSuccess(response.data);
    } else {
      return {
        isSuccess: false,
        payload: null,
        errors: ['An unknown error occurred.'],
      };
    }
  } catch (error: any) {
    return handleError(error);
  }
};

// Delete Post
export const deletePost = async (
  id: number,
): Promise<ActionResponse<PostResponseDto>> => {
  try {
    const headers = await getAuthHeaders('Post-Delete');

    const response = await axios.delete<PostResponseDto>(
      `${serverUrl}/api/v1/Post/Delete/${id}`,
      {
        headers,
      },
    );

    if (response.status === 200 || response.status === 201) {
      return handleSuccess(response.data);
    } else {
      return {
        isSuccess: false,
        payload: null,
        errors: ['An unknown error occurred.'],
      };
    }
  } catch (error: any) {
    return handleError(error);
  }
};

interface StatusUpdate {
  id: number;
  status: number;
}

export const updatePostStatus = async ({
  id,
  status,
}: StatusUpdate): Promise<ActionResponse<PostResponseDto>> => {
  try {
    const headers = await getAuthHeaders('Post-UpdateStatus');

    const response = await axios.put<PostResponseDto>(
      `${serverUrl}/api/v1/Post/UpdateStatus/${id}`,
      { status },
      {
        headers,
      },
    );

    if (response.status === 200 || response.status === 201) {
      return handleSuccess(response.data);
    } else {
      return {
        isSuccess: false,
        payload: null,
        errors: ['An unknown error occurred.'],
      };
    }
  } catch (error: any) {
    return handleError(error);
  }
};

export const uploadExcel = async (file: File) => {
  try {
    // Prepare form data
    const formData = new FormData();
    formData.append('excelFile', file);

    const headers = await getAuthHeaders('Post-Upload');

    const response = await axios.post(
      `${serverUrl}/api/v1/Post/Upload`,
      formData,
      {
        headers: {
          ...headers,
          'Content-Type': 'multipart/form-data',
        },
      },
    );
    return true;
  } catch (error: any) {
    if (error.response && error.response.data) {
      return error.response.data.errors[0] || 'An error occurred.';
    } else if (error.message) {
      return error.message;
    } else {
      return 'An unknown error occurred.';
    }
  }
};
