import { apiClient, ApiResponse } from './apiClient';
import type { Label } from '@/generated/prisma/client';

export async function getAllLabels() {
  const { data } = await apiClient.get<ApiResponse<Label[]>>('/labels');
  return data.data;
}

export async function createLabel(name: string, color: string) {
  const { data } = await apiClient.post<ApiResponse<Label>>('/labels', { name, color });
  return data.data;
}
