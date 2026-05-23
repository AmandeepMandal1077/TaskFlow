import type { Card, Label, User, Checklist, ChecklistItem } from '@/generated/prisma/client';

export type CardWithRelations = Card & {
  assignees: User[];
  labels: Label[];
  checklists: (Checklist & { items: ChecklistItem[] })[];
};
