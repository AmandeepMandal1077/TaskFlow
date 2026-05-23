import { apiClient, ApiResponse } from './apiClient';
import type { User } from '@/lib/api/types';

export async function getUserByEmail(email: string) {
  const { data } = await apiClient.get<ApiResponse<User>>(`/users/email/${email}`);
  return data.data;
}

export async function getAllUsers() {
  const { data } = await apiClient.get<ApiResponse<User[]>>('/users');
  return data.data;
}
