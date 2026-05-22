import prisma from "@/lib/prisma";

export const cardService = {
  async getCardsByBoardId(boardId: string) {
    try {
      return await prisma.card.findMany({
        where: {
          list: {
            board_id: boardId,
          },
        },
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
      });
    } catch (err) {
      console.error("Error creating card:", err);
      throw new Error("Failed to create card");
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
};
