import { z } from 'zod';

const uuidSchema = z.string().uuid();

export const isValidUUID = (id: string): boolean => {
  return uuidSchema.safeParse(id).success;
};
