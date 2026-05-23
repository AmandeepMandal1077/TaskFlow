import { z } from 'zod';

export const createBoardSchema = z.object({
  body: z.object({
    title: z.string().min(1, 'Title is required').max(100, 'Title is too long'),
    description: z.string().max(500, 'Description is too long').optional().nullable(),
    color: z.string().max(50).optional().nullable(),
    image_url: z.string().url('Invalid URL format').optional().nullable(),
  }),
});

export const updateBoardSchema = z.object({
  params: z.object({
    id: z.string().uuid('Invalid board ID'),
  }),
  body: z.object({
    title: z.string().min(1).max(100).optional(),
    description: z.string().max(500).optional().nullable(),
    color: z.string().max(50).optional().nullable(),
    image_url: z.string().url().optional().nullable(),
  }),
});

export const boardIdParamSchema = z.object({
  params: z.object({
    id: z.string().uuid('Invalid board ID'),
  }),
});
