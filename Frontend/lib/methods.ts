import { BaggageIncidentType } from '@/app/_lib/data/types/baggage_types';
import { TheftIncident } from '@/app/_lib/data/types/theft_incident_type';

// Utility to convert a string to a Date object
export const stringToDate = (dateString: string): Date => {
  return new Date(dateString);
};

// Utility to convert a Date object to an ISO string
export const dateToISOString = (date: Date): string => {
  return date.toISOString();
};

// Function to transform the data for API submission
export const prepareDataForAPI = (data: TheftIncident): any => {
  return {
    ...data,
    incidentDate: dateToISOString(stringToDate(data.incidentDate)), // Ensuring the date is in the correct format
    registeredDate: dateToISOString(data.registeredDate), // Convert Date to ISO string
    lastUpdateDate: dateToISOString(data.lastUpdateDate), // Convert Date to ISO string
  };
};

export const getBaggageIncidentTypes = (value: number): string[] => {
  const incidentTypes: string[] = [];

  for (const [key, flag] of Object.entries(BaggageIncidentType)) {
    if ((value & flag) === flag && flag !== BaggageIncidentType.None) {
      incidentTypes.push(key);
    }
  }

  return incidentTypes.length > 0 ? incidentTypes : ['None'];
};
