import prisma from '../../lib/prisma.js';
import type { Prisma } from '../../generated/prisma/client';

export const cardInclude = {
  assignees: true,
  labels: true,
  checklists: {
    include: {
      items: true,
    },
  },
} satisfies Prisma.CardInclude;

export const cardRepository = {
  async getCardsByBoardId(boardId: string) {
    return await prisma.card.findMany({
      where: {
        list: {
          board_id: boardId,
        },
      },
      include: cardInclude,
      orderBy: [
        {
          list: {
            order: 'asc',
          },
        },
        {
          order: 'asc',
        },
      ],
    });
  },

  async getCardById(cardId: string) {
    return await prisma.card.findUnique({
      where: { id: cardId },
      include: cardInclude,
    });
  },

  async createCard(
    listId: string,
    cardData: { title: string; description?: string | null; order?: number }
  ) {
    return await prisma.card.create({
      data: {
        title: cardData.title,
        description: cardData.description ?? null,
        list_id: listId,
        order: cardData.order,
      },
      include: cardInclude,
    });
  },

  async updateCard(
    cardId: string,
    data: Prisma.CardUpdateInput
  ) {
    return await prisma.card.update({
      where: { id: cardId },
      data,
      include: cardInclude,
    });
  },

  async deleteCard(cardId: string) {
    return await prisma.card.delete({
      where: { id: cardId },
    });
  },

  async moveCard(cardId: string, targetListId: string, targetOrder: number) {
    return await prisma.card.update({
      where: {
        id: cardId,
      },
      data: {
        list_id: targetListId,
        order: targetOrder,
      },
    });
  },

  async reorderCards(affectedLists: { listId: string; cardIds: string[] }[]) {
    const updates: any[] = [];

    for (const { listId, cardIds } of affectedLists) {
      for (let i = 0; i < cardIds.length; i++) {
        updates.push(
          prisma.card.update({
            where: { id: cardIds[i] },
            data: { list_id: listId, order: i },
          })
        );
      }
    }

    return await prisma.$transaction(updates);
  },

  async addLabelToCard(cardId: string, labelId: string) {
    return await prisma.card.update({
      where: { id: cardId },
      data: {
        labels: { connect: { id: labelId } },
      },
      include: cardInclude,
    });
  },

  async removeLabelFromCard(cardId: string, labelId: string) {
    return await prisma.card.update({
      where: { id: cardId },
      data: {
        labels: { disconnect: { id: labelId } },
      },
      include: cardInclude,
    });
  },

  async addAssigneeToCard(cardId: string, userId: string) {
    return await prisma.card.update({
      where: { id: cardId },
      data: {
        assignees: { connect: { id: userId } },
      },
      include: cardInclude,
    });
  },

  async removeAssigneeFromCard(cardId: string, userId: string) {
    return await prisma.card.update({
      where: { id: cardId },
      data: {
        assignees: { disconnect: { id: userId } },
      },
      include: cardInclude,
    });
  },

  async createChecklist(cardId: string, title: string) {
    return await prisma.checklist.create({
      data: {
        title,
        card_id: cardId,
      },
      include: { items: true },
    });
  },

  async deleteChecklist(checklistId: string) {
    return await prisma.checklist.delete({
      where: { id: checklistId },
    });
  },

  async createChecklistItem(checklistId: string, title: string) {
    return await prisma.checklistItem.create({
      data: {
        title,
        checklist_id: checklistId,
      },
    });
  },

  async toggleChecklistItem(itemId: string, isChecked: boolean) {
    return await prisma.checklistItem.update({
      where: { id: itemId },
      data: { is_checked: isChecked },
    });
  },

  async deleteChecklistItem(itemId: string) {
    return await prisma.checklistItem.delete({
      where: { id: itemId },
    });
  },
};
