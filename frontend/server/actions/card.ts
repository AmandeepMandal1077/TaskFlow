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

export async function moveCard(
  cardId: string,
  targetListId: string,
  targetOrder: number,
) {
  return await cardService.moveCard(cardId, targetListId, targetOrder);
}

export async function reorderCards(
  affectedLists: { listId: string; cardIds: string[] }[],
) {
  return await cardService.reorderCards(affectedLists);
}
