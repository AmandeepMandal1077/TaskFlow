import prisma from "@/lib/prisma";
import { List } from "@/generated/prisma/client";

export const listService = {
  async getListsByBoardId(boardId: string) {
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

  async updateList(listId: string, data: Partial<{ title: string; order: number }>) {
    try {
      return await prisma.list.update({
        where: {
          id: listId,
        },
        data,
      });
    } catch (error) {
      console.error("Error updating list:", error);
      throw new Error("Failed to update list");
    }
  },

  async deleteList(listId: string) {
    try {
      return await prisma.list.delete({
        where: {
          id: listId,
        },
      });
    } catch (error) {
      console.error("Error deleting list:", error);
      throw new Error("Failed to delete list");
    }
  },
};
