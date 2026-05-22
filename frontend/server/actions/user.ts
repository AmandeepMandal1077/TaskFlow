"use server";

import { userService } from "@/server/queries/user";

export async function getAllUsers() {
  return await userService.getAllUsers();
}
