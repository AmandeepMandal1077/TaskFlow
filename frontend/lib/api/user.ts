import { apiClient, ApiResponse } from './apiClient';
import type { User } from '@/generated/prisma/client';

export async function getUserByEmail(email: string) {
  const { data } = await apiClient.get<ApiResponse<User>>(`/users/email/${email}`);
  return data.data;
}

export async function getAllUsers() {
  const { data } = await apiClient.get<ApiResponse<User[]>>('/users');
  return data.data;
}
