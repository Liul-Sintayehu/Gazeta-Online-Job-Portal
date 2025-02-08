import { serverUrl } from '@/app/_services/envService';
import axios from 'axios';
import { getAuthHeaders } from '../utils';

interface Aircraft {
  id: number;
  aircraftTypeCode: string;
  aircraftTypeName: string;
  recordStatus: number;
}
interface Data {
  dataToSend: any; // Replace 'any' with a more specific type if possible
}
interface DataUpdated {
  dataToUpdate: any; // Replace 'any' with a more specific type if possible
  id: number;
}
interface StatusUpdate {
  status: number;
  id: number;
}
interface DataDeleted {
  dataToDelete: {
    id: number; // Replace with the actual type if different
  };
}
interface DataSearch {
  dataToSearch: {
    aircraftTypeCode: string;
    aircraftTypeName: string;
  };
}

export const CreateAircraft = async (params: Data) => {
  try {
    const headers = await getAuthHeaders('AircraftType-Create');

    const response = await axios.post(
      `${serverUrl}/api/v1/AircraftType/Create`,
      params.dataToSend,
      {
        headers,
      },
    );

    const data = response.data;
    return data;
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

//update aircraft

export const UpdateAircraft = async ({ dataToUpdate, id }: DataUpdated) => {
  try {
    const headers = await getAuthHeaders('AircraftType-Update');

    const response = await axios.put(
      `${serverUrl}/api/v1/AircraftType/Update/${id}`,
      dataToUpdate,
      {
        headers,
      },
    );

    if (response.status == 200) {
      return true;
    } else {
      return false;
    }

    // Log the data to the console
  } catch (error: any) {
    // Return error message based on the format of the error object
    if (error.response && error.response.data) {
      return error.response.data.errors[0] || 'An error occurred.';
    } else if (error.message) {
      return error.message;
    } else {
      return 'An unknown error occurred.';
    }
  }
};
export const UpdateAircraftStatus = async ({ status, id }: StatusUpdate) => {
  try {
    const headers = await getAuthHeaders('AircraftType-UpdateStatus');

    const response = await axios.put(
      `${serverUrl}/api/v1/AircraftType/UpdateStatus/${id}`,
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

    // Log the data to the console
  } catch (error: any) {
    // Return error message based on the format of the error object
    if (error.response && error.response.data) {
      return error.response.data.errors[0] || 'An error occurred.';
    } else if (error.message) {
      return error.message;
    } else {
      return 'An unknown error occurred.';
    }
  }
};

export const DeleteAircraft = async (
  params: DataDeleted,
): Promise<boolean | any> => {
  try {
    const { id } = params.dataToDelete;

    const headers = await getAuthHeaders('AircraftType-Delete');

    const response = await axios.delete(
      `${serverUrl}/api/v1/AircraftType/Delete/${id}`,
      {
        headers,
      },
    );

    // Check if the response status indicates success
    if (response.status === 200) {
      return true;
    } else {
      return false;
    }
  } catch (error: any) {
    // Return error message based on the format of the error object
    if (error.response && error.response.data) {
      return error.response.data.errors[0] || 'An error occurred.';
    } else if (error.message) {
      return error.message;
    } else {
      return 'An unknown error occurred.';
    }
  }
};
