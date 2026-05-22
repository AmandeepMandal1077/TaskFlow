import prisma from "@/lib/prisma";
import { Prisma } from "@/generated/prisma/client";

// Shared include for card relations
export const cardInclude = {
  assignees: true,
  labels: true,
  checklists: {
    include: {
      items: true,
    },
  },
} satisfies Prisma.CardInclude;

export type CardWithRelations = Prisma.CardGetPayload<{
  include: typeof cardInclude;
}>;

export const cardService = {
  async getCardsByBoardId(boardId: string) {
    try {
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
              order: "asc",
            },
          },
          {
            order: "asc",
          },
        ],
      });
    } catch (err) {
      console.error("Error fetching cards:", err);
      throw new Error("Failed to fetch cards");
    }
  },

  async getCardById(cardId: string) {
    try {
      return await prisma.card.findUnique({
        where: { id: cardId },
        include: cardInclude,
      });
    } catch (err) {
      console.error("Error fetching card:", err);
      throw new Error("Failed to fetch card");
    }
  },

  async createCard(
    listId: string,
    cardData: { title: string; description?: string; order?: number },
  ) {
    try {
      return await prisma.card.create({
        data: {
          title: cardData.title,
          description: cardData.description,
          list_id: listId,
          order: cardData.order,
        },
        include: cardInclude,
      });
    } catch (err) {
      console.error("Error creating card:", err);
      throw new Error("Failed to create card");
    }
  },

  async updateCard(
    cardId: string,
    data: Partial<{
      title: string;
      description: string | null;
      due_date: Date | null;
      is_complete: boolean;
    }>,
  ) {
    try {
      return await prisma.card.update({
        where: { id: cardId },
        data,
        include: cardInclude,
      });
    } catch (err) {
      console.error("Error updating card:", err);
      throw new Error("Failed to update card");
    }
  },

  async deleteCard(cardId: string) {
    try {
      return await prisma.card.delete({
        where: { id: cardId },
      });
    } catch (err) {
      console.error("Error deleting card:", err);
      throw new Error("Failed to delete card");
    }
  },

  async moveCard(cardId: string, targetListId: string, targetOrder: number) {
    try {
      return await prisma.card.update({
        where: {
          id: cardId,
        },
        data: {
          list_id: targetListId,
          order: targetOrder,
        },
      });
    } catch (err) {
      console.error("Error moving card:", err);
      throw new Error("Failed to move card");
    }
  },

  async reorderCards(
    affectedLists: { listId: string; cardIds: string[] }[],
  ) {
    try {
      const updates: any[] = [];

      for (const { listId, cardIds } of affectedLists) {
        for (let i = 0; i < cardIds.length; i++) {
          updates.push(
            prisma.card.update({
              where: { id: cardIds[i] },
              data: { list_id: listId, order: i },
            }),
          );
        }
      }

      await prisma.$transaction(updates);
    } catch (err) {
      console.error("Error reordering cards:", err);
      throw new Error("Failed to reorder cards");
    }
  },

  // Label management
  async addLabelToCard(cardId: string, labelId: string) {
    try {
      return await prisma.card.update({
        where: { id: cardId },
        data: {
          labels: { connect: { id: labelId } },
        },
        include: cardInclude,
      });
    } catch (err) {
      console.error("Error adding label to card:", err);
      throw new Error("Failed to add label to card");
    }
  },

  async removeLabelFromCard(cardId: string, labelId: string) {
    try {
      return await prisma.card.update({
        where: { id: cardId },
        data: {
          labels: { disconnect: { id: labelId } },
        },
        include: cardInclude,
      });
    } catch (err) {
      console.error("Error removing label from card:", err);
      throw new Error("Failed to remove label from card");
    }
  },

  // Assignee management
  async addAssigneeToCard(cardId: string, userId: string) {
    try {
      return await prisma.card.update({
        where: { id: cardId },
        data: {
          assignees: { connect: { id: userId } },
        },
        include: cardInclude,
      });
    } catch (err) {
      console.error("Error adding assignee to card:", err);
      throw new Error("Failed to add assignee to card");
    }
  },

  async removeAssigneeFromCard(cardId: string, userId: string) {
    try {
      return await prisma.card.update({
        where: { id: cardId },
        data: {
          assignees: { disconnect: { id: userId } },
        },
        include: cardInclude,
      });
    } catch (err) {
      console.error("Error removing assignee from card:", err);
      throw new Error("Failed to remove assignee from card");
    }
  },

  // Checklist management
  async createChecklist(cardId: string, title: string) {
    try {
      return await prisma.checklist.create({
        data: {
          title,
          card_id: cardId,
        },
        include: { items: true },
      });
    } catch (err) {
      console.error("Error creating checklist:", err);
      throw new Error("Failed to create checklist");
    }
  },

  async deleteChecklist(checklistId: string) {
    try {
      return await prisma.checklist.delete({
        where: { id: checklistId },
      });
    } catch (err) {
      console.error("Error deleting checklist:", err);
      throw new Error("Failed to delete checklist");
    }
  },

  // Checklist item management
  async createChecklistItem(checklistId: string, title: string) {
    try {
      return await prisma.checklistItem.create({
        data: {
          title,
          checklist_id: checklistId,
        },
      });
    } catch (err) {
      console.error("Error creating checklist item:", err);
      throw new Error("Failed to create checklist item");
    }
  },

  async toggleChecklistItem(itemId: string, isChecked: boolean) {
    try {
      return await prisma.checklistItem.update({
        where: { id: itemId },
        data: { is_checked: isChecked },
      });
    } catch (err) {
      console.error("Error toggling checklist item:", err);
      throw new Error("Failed to toggle checklist item");
    }
  },

  async deleteChecklistItem(itemId: string) {
    try {
      return await prisma.checklistItem.delete({
        where: { id: itemId },
      });
    } catch (err) {
      console.error("Error deleting checklist item:", err);
      throw new Error("Failed to delete checklist item");
    }
  },
};
