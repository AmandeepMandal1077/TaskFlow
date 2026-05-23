import { z } from 'zod';

export const emailParamSchema = z.object({
  params: z.object({
    email: z.string().email('Invalid email address'),
  }),
});
