import { apiClient, ApiResponse } from './apiClient';
import type { List } from '@/generated/prisma/client';

export async function getListsByBoardId(boardId: string) {
  const { data } = await apiClient.get<ApiResponse<List[]>>(`/lists/board/${boardId}`);
  return data.data;
}

export async function createList(
  boardId: string,
  listData: { title: string; order?: number }
) {
  const { data } = await apiClient.post<ApiResponse<List>>('/lists', {
    ...listData,
    board_id: boardId,
  });
  return data.data;
}

export async function updateList(
  listId: string,
  updateData: { title?: string; order?: number }
) {
  const { data } = await apiClient.patch<ApiResponse<List>>(`/lists/${listId}`, updateData);
  return data.data;
}

export async function deleteList(listId: string) {
  const { data } = await apiClient.delete<ApiResponse<null>>(`/lists/${listId}`);
  return data.data;
}

export async function reorderLists(items: { id: string; order: number }[]) {
  const { data } = await apiClient.patch<ApiResponse<null>>('/lists/reorder', { items });
  return data.data;
}
