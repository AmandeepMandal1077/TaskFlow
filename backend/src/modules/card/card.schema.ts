import { z } from 'zod';

export const cardIdParamSchema = z.object({
  params: z.object({
    id: z.string().uuid('Invalid card ID'),
  }),
});

export const boardIdParamSchema = z.object({
  params: z.object({
    boardId: z.string().uuid('Invalid board ID'),
  }),
});

export const createCardSchema = z.object({
  body: z.object({
    list_id: z.string().uuid('Invalid list ID'),
    title: z.string().min(1, 'Title is required').max(200),
    description: z.string().max(1000).optional().nullable(),
    order: z.number().int().min(0).optional(),
  }),
});

export const updateCardSchema = z.object({
  params: z.object({
    id: z.string().uuid('Invalid card ID'),
  }),
  body: z.object({
    title: z.string().min(1).max(200).optional(),
    description: z.string().max(1000).optional().nullable(),
    due_date: z.string().datetime().optional().nullable(),
    is_complete: z.boolean().optional(),
  }).refine(data => Object.keys(data).length > 0, {
    message: "At least one field must be provided for update"
  }),
});

export const moveCardSchema = z.object({
  params: z.object({
    id: z.string().uuid('Invalid card ID'),
  }),
  body: z.object({
    targetListId: z.string().uuid('Invalid target list ID'),
    targetOrder: z.number().int().min(0),
  }),
});

export const reorderCardsSchema = z.object({
  body: z.object({
    affectedLists: z.array(
      z.object({
        listId: z.string().uuid('Invalid list ID'),
        cardIds: z.array(z.string().uuid('Invalid card ID')),
      })
    ).min(1),
  }),
});

export const cardLabelSchema = z.object({
  params: z.object({
    id: z.string().uuid('Invalid card ID'),
  }),
  body: z.object({
    labelId: z.string().uuid('Invalid label ID'),
  }),
});

export const deleteCardLabelSchema = z.object({
  params: z.object({
    id: z.string().uuid('Invalid card ID'),
    labelId: z.string().uuid('Invalid label ID'),
  }),
});

export const cardAssigneeSchema = z.object({
  params: z.object({
    id: z.string().uuid('Invalid card ID'),
  }),
  body: z.object({
    userId: z.string().uuid('Invalid user ID'),
  }),
});

export const deleteCardAssigneeSchema = z.object({
  params: z.object({
    id: z.string().uuid('Invalid card ID'),
    userId: z.string().uuid('Invalid user ID'),
  }),
});

export const createChecklistSchema = z.object({
  params: z.object({
    id: z.string().uuid('Invalid card ID'),
  }),
  body: z.object({
    title: z.string().min(1).max(100),
  }),
});

export const idParamSchema = z.object({
  params: z.object({
    id: z.string().uuid('Invalid ID'),
  }),
});

export const createChecklistItemSchema = z.object({
  params: z.object({
    id: z.string().uuid('Invalid checklist ID'),
  }),
  body: z.object({
    title: z.string().min(1).max(200),
  }),
});

export const toggleChecklistItemSchema = z.object({
  params: z.object({
    id: z.string().uuid('Invalid item ID'),
  }),
  body: z.object({
    is_checked: z.boolean(),
  }),
});
