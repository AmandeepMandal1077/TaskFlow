import { apiClient, ApiResponse } from './apiClient';
import type { Board } from '@/lib/api/types';
import type { ListWithCards } from '../hooks/useBoards';

export async function getBoardsByEmail(email: string) {
  // Backend relies on auth middleware for user, email parameter is ignored
  const { data } = await apiClient.get<ApiResponse<Board[]>>('/boards');
  return data.data;
}

export async function getBoardWithLists(boardId: string) {
  const { data } = await apiClient.get<ApiResponse<{ board: Board; listsWithCards: ListWithCards[] }>>(`/boards/${boardId}`);
  return data.data;
}

export async function createBoardWithDefaultLists(
  email: string,
  boardData: { title: string; description?: string; color?: string; image_url?: string }
) {
  const { data } = await apiClient.post<ApiResponse<{ board: Board; lists: any[] }>>('/boards', boardData);
  return data.data;
}

export async function updateBoardWithId(
  boardId: string,
  updatedData: { title?: string; description?: string; color?: string; image_url?: string | null }
) {
  const { data } = await apiClient.patch<ApiResponse<Board>>(`/boards/${boardId}`, updatedData);
  return data.data;
}
