import { z } from 'zod';

export const createLabelSchema = z.object({
  body: z.object({
    name: z.string().min(1, 'Name is required').max(50),
    color: z.string().min(1, 'Color is required').max(50),
  }),
});
