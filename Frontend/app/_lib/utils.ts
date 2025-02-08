export const formatDateToLocal = (
  dateStr: string,
  locale: string = 'en-US',
) => {
  const date = new Date(dateStr);
  const options: Intl.DateTimeFormatOptions = {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  };
  const formatter = new Intl.DateTimeFormat(locale, options);
  return formatter.format(date);
};

export function getInitials(name: string): string {
  let initials = '';
  if (name.includes(' ') && !name.includes('  ')) {
    const words = name.split(' ');
    initials = words
      .slice(0, 2)
      .map(word => word[0].toUpperCase())
      .join('');
  } else {
    const consonants = 'bcdfghjklmnpqrstvwxyz';
    let count = 0;
    for (let i = 0; i < name.length; i++) {
      if (consonants.includes(name[i].toLowerCase())) {
        initials += name[i].toUpperCase();
        count++;
      }
      if (count === 2) {
        break;
      }
    }
  }
  return initials;
}
// Do all Formats here

export function formatVersion(version: string): string {
  return parseFloat(version).toFixed(1);
}

export const phoneRegex = new RegExp(
  /^([+]?[\s0-9]+)?(\d{3}|[(]?[0-9]+[)])?([-]?[\s]?[0-9])+$/,
);

//maximum image file size upload
export const MAX_FILE_SIZE = 1024 * 2048;

//image file types accepted
export const ACCEPTED_IMAGE_TYPES = [
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/webp',
];

export const isValidUrl = (url: string) => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

import { tokenProvider } from '@/app/_services/tokenServices';

export const getAuthHeaders = async (clientClaim: string) => {
  const { accessToken, idToken } = await tokenProvider();

  return {
    'Content-Type': 'application/json',
    accessToken,
    idToken,
    clientClaim,
    'Cache-Control': 'no-store',
  };
};
