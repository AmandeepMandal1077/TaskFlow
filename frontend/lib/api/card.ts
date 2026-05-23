import { apiClient, ApiResponse } from './apiClient';
import type { CardWithRelations } from './types';

export async function getCardsByBoardId(boardId: string) {
  const { data } = await apiClient.get<ApiResponse<CardWithRelations[]>>(`/cards/board/${boardId}`);
  return data.data;
}

export async function createCard(
  listId: string,
  cardData: { title: string; description?: string | null; order?: number }
) {
  const { data } = await apiClient.post<ApiResponse<CardWithRelations>>('/cards', {
    ...cardData,
    list_id: listId,
  });
  return data.data;
}

export async function updateCard(
  cardId: string,
  updateData: Partial<{
    title: string;
    description: string | null;
    due_date: Date | null;
    is_complete: boolean;
  }>
) {
  const { data } = await apiClient.patch<ApiResponse<CardWithRelations>>(`/cards/${cardId}`, updateData);
  return data.data;
}

export async function deleteCard(cardId: string) {
  const { data } = await apiClient.delete<ApiResponse<null>>(`/cards/${cardId}`);
  return data.data;
}

export async function moveCard(
  cardId: string,
  targetListId: string,
  targetOrder: number
) {
  const { data } = await apiClient.patch<ApiResponse<any>>(`/cards/${cardId}/move`, {
    targetListId,
    targetOrder,
  });
  return data.data;
}

export async function reorderCards(
  affectedLists: { listId: string; cardIds: string[] }[]
) {
  const { data } = await apiClient.patch<ApiResponse<null>>('/cards/reorder', { affectedLists });
  return data.data;
}

// Label management
export async function addLabelToCard(cardId: string, labelId: string) {
  const { data } = await apiClient.post<ApiResponse<CardWithRelations>>(`/cards/${cardId}/labels`, { labelId });
  return data.data;
}

export async function removeLabelFromCard(cardId: string, labelId: string) {
  const { data } = await apiClient.delete<ApiResponse<CardWithRelations>>(`/cards/${cardId}/labels/${labelId}`);
  return data.data;
}

// Assignee management
export async function addAssigneeToCard(cardId: string, userId: string) {
  const { data } = await apiClient.post<ApiResponse<CardWithRelations>>(`/cards/${cardId}/assignees`, { userId });
  return data.data;
}

export async function removeAssigneeFromCard(cardId: string, userId: string) {
  const { data } = await apiClient.delete<ApiResponse<CardWithRelations>>(`/cards/${cardId}/assignees/${userId}`);
  return data.data;
}

// Checklist management
export async function createChecklist(cardId: string, title: string) {
  const { data } = await apiClient.post<ApiResponse<any>>(`/cards/${cardId}/checklists`, { title });
  return data.data;
}

export async function deleteChecklist(checklistId: string) {
  const { data } = await apiClient.delete<ApiResponse<null>>(`/cards/checklists/${checklistId}`);
  return data.data;
}

// Checklist item management
export async function createChecklistItem(checklistId: string, title: string) {
  const { data } = await apiClient.post<ApiResponse<any>>(`/cards/checklists/${checklistId}/items`, { title });
  return data.data;
}

export async function toggleChecklistItem(itemId: string, isChecked: boolean) {
  const { data } = await apiClient.patch<ApiResponse<any>>(`/cards/checklists/items/${itemId}`, { is_checked: isChecked });
  return data.data;
}

export async function deleteChecklistItem(itemId: string) {
  const { data } = await apiClient.delete<ApiResponse<null>>(`/cards/checklists/items/${itemId}`);
  return data.data;
}
