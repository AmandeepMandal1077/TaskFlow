import prisma from '../../lib/prisma.js';
import type { Prisma } from '../../generated/prisma/client';

export const boardRepository = {
  async getBoardsByUserId(userId: string) {
    return await prisma.board.findMany({
      where: { user_id: userId },
    });
  },

  async getBoardById(boardId: string) {
    return await prisma.board.findUnique({
      where: { id: boardId },
    });
  },

  async getBoardWithLists(boardId: string) {
    const board = await this.getBoardById(boardId);
    if (!board) return null;

    const lists = await prisma.list.findMany({
      where: { board_id: boardId },
      orderBy: { order: 'asc' },
    });

    const cards = await prisma.card.findMany({
      where: {
        list: {
          board_id: boardId,
        },
      },
      orderBy: { order: 'asc' },
    });

    const listsWithCards = lists.map((list) => ({
      ...list,
      cards: cards.filter((card) => card.list_id === list.id),
    }));

    return { board, listsWithCards };
  },

  async createBoardWithDefaultLists(data: {
    title: string;
    userId: string;
    description?: string | null;
    color?: string | null;
    image_url?: string | null;
  }) {
    const board = await prisma.board.create({
      data: {
        title: data.title,
        user_id: data.userId,
        description: data.description ?? null,
        color: data.color ?? undefined,
        image_url: data.image_url ?? null,
      },
    });

    const defaultLists = [
      { title: 'To Do', board_id: board.id, order: 0 },
      { title: 'In Progress', board_id: board.id, order: 1 },
      { title: 'Done', board_id: board.id, order: 2 },
    ];

    const createdLists = await Promise.all(
      defaultLists.map((list) => prisma.list.create({ data: list }))
    );

    return { board, lists: createdLists };
  },

  async updateBoard(boardId: string, updateData: Prisma.BoardUpdateInput) {
    return await prisma.board.update({
      where: { id: boardId },
      data: updateData,
    });
  },
};
