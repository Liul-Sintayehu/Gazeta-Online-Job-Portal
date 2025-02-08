import axios, { AxiosResponse } from 'axios';
import { authUrl, clientId, clientSecret } from './envService';

const clientCredential = {
  clientId,
  clientSecret,
};

export async function clientLogin(): Promise<AxiosResponse> {
  try {
    const response: AxiosResponse = await axios.post(
      `${authUrl}/api/v1/Client/Login`,
      clientCredential,
    );
    return response;
  } catch (error: any) {
    throw new Error('Login failed');
  }
}

export async function getClientAccessToken(): Promise<string> {
  try {
    const response = await clientLogin();
    const token = response?.data?.accessToken;
    return token ? token : '';
  } catch (error) {
    return '';
  }
}
