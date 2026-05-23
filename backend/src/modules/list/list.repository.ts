import prisma from '../../lib/prisma.js';
import type { Prisma } from '../../generated/prisma/client';

export const listRepository = {
  async getListsByBoardId(boardId: string) {
    return await prisma.list.findMany({
      where: { board_id: boardId },
      orderBy: { order: 'asc' },
    });
  },

  async createList(data: { title: string; board_id: string; order: number }) {
    return await prisma.list.create({
      data,
    });
  },

  async updateList(listId: string, data: Prisma.ListUpdateInput) {
    return await prisma.list.update({
      where: { id: listId },
      data,
    });
  },

  async deleteList(listId: string) {
    return await prisma.list.delete({
      where: { id: listId },
    });
  },

  async reorderLists(items: { id: string; order: number }[]) {
    return await prisma.$transaction(
      items.map((item) =>
        prisma.list.update({
          where: { id: item.id },
          data: { order: item.order },
        })
      )
    );
  },
};
