"use server";

import { cardService } from "@/server/queries/card";

export async function getCardsByBoardId(boardId: string) {
  return cardService.getCardsByBoardId(boardId);
}

export async function createCard(
  listId: string,
  cardData: { title: string; description?: string; order?: number },
) {
  return await cardService.createCard(listId, cardData);
}
