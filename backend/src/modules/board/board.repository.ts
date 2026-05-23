import prisma from '../../lib/prisma.js';
import type { Prisma } from '../../generated/prisma/client';
import { cardInclude } from '../card/card.repository.js';

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
    const board = await prisma.board.findUnique({
      where: { id: boardId },
      include: {
        lists: {
          orderBy: { order: 'asc' },
          include: {
            cards: {
              orderBy: { order: 'asc' },
              include: cardInclude,
            },
          },
        },
      },
    });

    if (!board) return null;

    const { lists, ...boardData } = board;
    return { board: boardData, listsWithCards: lists };
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
        lists: {
          create: [
            { title: 'To Do', order: 0 },
            { title: 'In Progress', order: 1 },
            { title: 'Done', order: 2 },
          ],
        },
      },
      include: { lists: true },
    });

    const { lists, ...boardData } = board;
    return { board: boardData, lists };
  },

  async updateBoard(boardId: string, updateData: Prisma.BoardUpdateInput) {
    return await prisma.board.update({
      where: { id: boardId },
      data: updateData,
    });
  },
};
