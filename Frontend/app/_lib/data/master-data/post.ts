import axios, { AxiosError } from 'axios';
import { ActionResponse } from '../../definitions';
import {
  GetPostsQueryDto,
  PostResponseDto,
} from '@/components/ui/master_data/post/types';
import { serverUrl } from '@/app/_services/envService';
import { getAuthHeaders } from '../../utils';
import { redirect } from 'next/navigation';

export const fetchPosts = async (
  params: GetPostsQueryDto,
): Promise<ActionResponse<PostResponseDto[]>> => {
  try {
    const headers = await getAuthHeaders('Post-GetAll');

    const response = await axios.get<PostResponseDto[]>(
      `${serverUrl}/api/v1/Post`,
      {
        params,
        headers,
      },
    );
    if (response.status === 200) {
      return {
        isSuccess: true,
        payload: response.data,
        errors: [],
      };
    } else if (response.status === 201) {
      return {
        isSuccess: false,
        payload: null,
        errors: [],
      };
    } else
      return {
        isSuccess: false,
        payload: null,
        errors: ['An unknown error occurred.'],
      };
  } catch (error: AxiosError | any) {
    if (error?.response?.status === 401 || error?.response?.status === 403) {
      redirect('/dashboard/403');
    }
    if (error.response && error.response.data) {
      return {
        isSuccess: false,
        payload: null,
        errors: error.response.data.errors,
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
  }
};

interface LoadingProps {
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
}

export const downloadExcelTemplate = async ({
  setLoading,
}: LoadingProps): Promise<ActionResponse> => {
  setLoading(true);

  try {
    const headers = await getAuthHeaders('Post-Upload');

    const response = await axios.get(
      `${serverUrl}/api/v1/Post/DownloadExcelTemplate`,
      {
        responseType: 'blob',
        headers,
      },
    );

    const url = window.URL.createObjectURL(new Blob([response.data]));

    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'Post_Mass_Upload_Template.xlsx');

    document.body.appendChild(link);
    link.click();
    link.remove();

    window.URL.revokeObjectURL(url);

    return {
      isSuccess: true,
      payload: null,
      errors: [],
    };
  } catch (error: any) {
    if (error.response && error.response.data) {
      return {
        isSuccess: false,
        payload: null,
        errors: error.response.data.errors,
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
        errors: ['Failed to dowload template, please try again!'],
      };
    }
  } finally {
    setLoading(false);
  }
};
