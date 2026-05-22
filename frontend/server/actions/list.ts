"use server";

import { listService } from "@/server/queries/list";

export async function createList(
  boardId: string,
  listData: { title: string; order?: number },
) {
  return await listService.createList({
    board_id: boardId,
    title: listData.title,
    order: listData.order ?? 0,
  });
}

export async function updateList(
  listId: string,
  updateData: { title?: string; order?: number },
) {
  return await listService.updateList(listId, updateData);
}

export async function deleteList(listId: string) {
  return await listService.deleteList(listId);
}
