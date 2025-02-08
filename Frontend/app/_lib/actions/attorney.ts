'use server';

import { baseUrl } from '@/app/_services/envService';
import { AttorneyState, AttroneyFormSchema } from '../definitions';
import { tokenProvider } from '@/app/_services/tokenServices';
import axios from 'axios';

const { accessToken, idToken } = await tokenProvider();
const CreateAttorneyProfileSchema = AttroneyFormSchema.omit({ id: true });

export async function createAttroneyProfile(
  prevState: AttorneyState,
  formData: FormData,
) {
  const validatedFields = CreateAttorneyProfileSchema.safeParse({
    // requireds
    firstname: formData.get('firstname'),
    middlename: formData.get('middlename'),
    lastname: formData.get('lastname'),
    userId: formData.get('userId'),
    phonenumber: formData.get('phonenumber'),
    email: formData.get('email'),
    // optionals
    areaofexpertise: formData.get('areaofexpertise')
      ? formData.get('areaofexpertise')
      : null,
    education: formData.get('education') ? formData.get('education') : null,
    experience: formData.get('experience') ? formData.get('experience') : null,
    barassociationinfo: formData.get('barassociation')
      ? formData.get('barassociation')
      : null,
    licenseinfo: formData.get('license') ? formData.get('license') : null,
    languages: formData.get('languages') ? formData.get('languages') : null,
    biography: formData.get('biography') ? formData.get('biography') : null,
    profilepicture: formData.get('profilepicture') as File,
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      submitError: 'Missing Fields. Failed to Create.',
    };
  }

  const body = validatedFields.data;
  const profileFile = body.profilepicture as File;

  let formdata: FormData = new FormData();
  formdata.append(
    'fullName',
    body.firstname + ' ' + body.middlename + ' ' + body.lastname,
  );
  formdata.append('phone', body.phonenumber);
  formdata.append('email', body.email);
  formdata.append('userId', body.userId);
  formdata.append('areaOfExperiance', body.areaofexpertise || '');
  formdata.append('education', body.education || '');
  formdata.append('experiance', body.experience || '');
  formdata.append('barAssociationMembership', body.barassociationinfo || '');
  formdata.append('licenseInformation', body.licenseinfo || '');
  formdata.append('languagesSpoken', body.languages || '');
  formdata.append('biography', body.biography || '');
  formdata.append('profilePicture', profileFile);

  try {
    let response = await axios.post(`${baseUrl}/Attorney/Create`, formdata, {
      headers: {
        'Content-Type': 'multipart/form-data',
        accessToken,
        idToken,
        clientClaim: 'Create-Attorney',
      },
    });

    return {
      success: `${response?.data?.message}`,
      submitError: null,
    };
  } catch (error: any) {
    return {
      success: null,
      submitError: `${error?.response?.data?.errors[0]}`,
    };
  }
}

export async function updateAttroneyProfile(
  prevState: AttorneyState,
  formData: FormData,
) {
  const validatedFields = AttroneyFormSchema.safeParse({
    // requireds
    id: formData.get('id'),
    firstname: formData.get('firstname'),
    middlename: formData.get('middlename'),
    lastname: formData.get('lastname'),
    userId: formData.get('userId'),
    phonenumber: formData.get('phonenumber'),
    email: formData.get('email'),
    // optionals
    areaofexpertise: formData.get('areaofexpertise')
      ? formData.get('areaofexpertise')
      : null,
    education: formData.get('education') ? formData.get('education') : null,
    experience: formData.get('experience') ? formData.get('experience') : null,
    barassociationinfo: formData.get('barassociation')
      ? formData.get('barassociation')
      : null,
    licenseinfo: formData.get('license') ? formData.get('license') : null,
    languages: formData.get('languages') ? formData.get('languages') : null,
    biography: formData.get('biography') ? formData.get('biography') : null,
    profilepicture: formData.get('profilepicture') as File,
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      submitError: 'Missing Fields. Failed to Update.',
    };
  }

  const body = validatedFields.data;
  let editFormData: FormData = new FormData();

  // Append the fields to FormData
  editFormData.append('id', body.id.toString());
  editFormData.append(
    'fullName',
    `${body.firstname} ${body.middlename} ${body.lastname}`,
  );
  editFormData.append('phone', body.phonenumber);
  editFormData.append('email', body.email);
  editFormData.append('userId', body.userId);
  editFormData.append('areaOfExperiance', body.areaofexpertise || '');
  editFormData.append('education', body.education || '');
  editFormData.append('experiance', body.experience || '');
  editFormData.append(
    'barAssociationMembership',
    body.barassociationinfo || '',
  );
  editFormData.append('licenseInformation', body.licenseinfo || '');
  editFormData.append('languagesSpoken', body.languages || '');
  editFormData.append('biography', body.biography || '');

  const profileFile = body.profilepicture as File;
  if (profileFile) {
    editFormData.append('profilePicture', profileFile);
  }

  try {
    const response = await axios.put(
      `${baseUrl}/Attorney/Update`,
      editFormData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
          accessToken,
          idToken,
          clientClaim: 'Create-Attorney',
        },
      },
    );

    return {
      success: `${response?.data?.message}`,
      submitError: null,
    };
  } catch (error: any) {
    return {
      success: null,
      submitError: `${error?.response?.data?.errors[0]}`,
    };
  }
}

export async function deleteAttorneyProfile(id: number) {
  try {
    const response = await axios.delete(`${baseUrl}/Attorney/Delete`, {
      params: { Id: id },
      headers: {
        'Content-Type': 'application/json',
        accessToken,
        idToken,
        clientClaim: 'Delete-ContractTypes',
      },
    });
    // revalidatePath('/dashboard/master-data','page');

    return {
      success: response?.data?.message,
      submitError: '',
    };
  } catch (error: any) {
    return {
      success: '',
      submitError: `${error?.response?.data?.errors[0]}`,
    };
  }
}
