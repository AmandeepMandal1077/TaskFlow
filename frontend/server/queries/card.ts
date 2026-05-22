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
};
