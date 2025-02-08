 import { object, string } from 'zod';

export const titleSchema = object({
  title : string()
});
