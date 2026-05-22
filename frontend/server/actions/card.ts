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

export async function updateCard(
  cardId: string,
  data: Partial<{
    title: string;
    description: string | null;
    due_date: Date | null;
    is_complete: boolean;
  }>,
) {
  return await cardService.updateCard(cardId, data);
}

export async function deleteCard(cardId: string) {
  return await cardService.deleteCard(cardId);
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

// Label management
export async function addLabelToCard(cardId: string, labelId: string) {
  return await cardService.addLabelToCard(cardId, labelId);
}

export async function removeLabelFromCard(cardId: string, labelId: string) {
  return await cardService.removeLabelFromCard(cardId, labelId);
}

// Assignee management
export async function addAssigneeToCard(cardId: string, userId: string) {
  return await cardService.addAssigneeToCard(cardId, userId);
}

export async function removeAssigneeFromCard(cardId: string, userId: string) {
  return await cardService.removeAssigneeFromCard(cardId, userId);
}

// Checklist management
export async function createChecklist(cardId: string, title: string) {
  return await cardService.createChecklist(cardId, title);
}

export async function deleteChecklist(checklistId: string) {
  return await cardService.deleteChecklist(checklistId);
}

// Checklist item management
export async function createChecklistItem(checklistId: string, title: string) {
  return await cardService.createChecklistItem(checklistId, title);
}

export async function toggleChecklistItem(itemId: string, isChecked: boolean) {
  return await cardService.toggleChecklistItem(itemId, isChecked);
}

export async function deleteChecklistItem(itemId: string) {
  return await cardService.deleteChecklistItem(itemId);
}
