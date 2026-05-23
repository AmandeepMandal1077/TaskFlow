export interface User {
  id: string;
  name: string;
  email: string;
}

export interface Board {
  id: string;
  title: string;
  description: string | null;
  color: string;
  image_url: string | null;
  user_id: string;
  created_at: Date | string;
  updated_at: Date | string;
}

export interface List {
  id: string;
  title: string;
  order: number;
  board_id: string;
  created_at: Date | string;
}

export interface Card {
  id: string;
  title: string;
  description: string | null;
  order: number;
  is_complete: boolean;
  due_date: Date | string | null;
  list_id: string;
  created_at: Date | string;
}

export interface Label {
  id: string;
  name: string;
  color: string;
}

export interface Checklist {
  id: string;
  title: string;
  card_id: string;
}

export interface ChecklistItem {
  id: string;
  title: string;
  is_checked: boolean;
  checklist_id: string;
}

export type CardWithRelations = Card & {
  assignees: User[];
  labels: Label[];
  checklists: (Checklist & { items: ChecklistItem[] })[];
};
