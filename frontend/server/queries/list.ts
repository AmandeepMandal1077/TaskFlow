import prisma from "@/lib/prisma";
import { List } from "@/generated/prisma/client";

export const listService = {
  async getLists(boardId: string) {
    try {
      return await prisma.list.findMany({
        where: {
          board_id: boardId,
        },
      });
    } catch (error) {
      console.error("Error fetching lists:", error);
      throw new Error("Failed to fetch lists");
    }
  },

  async createList(list: Omit<List, "id" | "created_at">) {
    try {
      return await prisma.list.create({
        data: list,
      });
    } catch (error) {
      console.error("Error creating list:", error);
      throw new Error("Failed to create list");
    }
  },
};
