'use server';
import { baseUrl } from '@/app/_services/envService';
import { tokenProvider } from '@/app/_services/tokenServices';
import axios from 'axios';

const { accessToken, idToken } = await tokenProvider();
export async function fetchAttorneys() {
  try {
    let response = await axios.get(`${baseUrl}/Attorney/GetAll`, {
      headers: {
        'Content-Type': 'application/json',
        accessToken,
        idToken,
        clientClaim: 'Get-Attorney',
        'Cache-Control': 'no-store',
      },
    });
    return response?.data;
  } catch (err: any) {
    return null;
  }
}
export async function fetchAttorneyById(id: number) {
  try {
    let response = await axios.get(`${baseUrl}/Attorney/GetById?id=${id}`, {
      headers: {
        'Content-Type': 'application/json',
        accessToken,
        idToken,
        clientClaim: 'Get-Attorney',
        'Cache-Control': 'no-store',
      },
    });
    return response?.data;
  } catch (err) {
    return null;
  }
}
export async function fetchAttorneyByUserId(userId: string) {
  try {
    let response = await axios.get(
      `${baseUrl}/Attorney/GetByUserId?UserId=${userId}`,
      {
        headers: {
          'Content-Type': 'application/json',
          accessToken,
          idToken,
          clientClaim: 'Get-Attorney',
          'Cache-Control': 'no-store',
        },
      },
    );
    return response?.data;
  } catch (err) {
    return null;
  }
}
