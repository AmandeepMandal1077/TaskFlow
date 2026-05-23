import { z } from 'zod';

export const listIdParamSchema = z.object({
  params: z.object({
    id: z.string().uuid('Invalid list ID'),
  }),
});

export const boardIdParamSchema = z.object({
  params: z.object({
    boardId: z.string().uuid('Invalid board ID'),
  }),
});

export const createListSchema = z.object({
  body: z.object({
    title: z.string().min(1, 'Title is required').max(100),
    board_id: z.string().uuid('Invalid board ID'),
    order: z.number().int().min(0).default(0),
  }),
});

export const updateListSchema = z.object({
  params: z.object({
    id: z.string().uuid('Invalid list ID'),
  }),
  body: z.object({
    title: z.string().min(1).max(100).optional(),
    order: z.number().int().min(0).optional(),
  }).refine(data => Object.keys(data).length > 0, {
    message: "At least one field must be provided for update"
  }),
});

export const reorderListsSchema = z.object({
  body: z.object({
    items: z.array(
      z.object({
        id: z.string().uuid('Invalid list ID'),
        order: z.number().int().min(0),
      })
    ).min(1, 'Must provide at least one list to reorder'),
  }),
});
