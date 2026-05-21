import prisma from "@/lib/prisma";
import { Board } from "@/generated/prisma/client";
import { listService } from "@/server/queries/list";

export const boardService = {
  async getBoardsByUserId(userId: string) {
    try {
      return await prisma.board.findMany({
        where: {
          user_id: userId,
        },
      });
    } catch (error) {
      console.error("Error fetching boards:", error);
      throw new Error("Failed to fetch boards");
    }
  },
  async getBoardsByEmail(email: string) {
    try {
      const user = await prisma.user.findUnique({
        where: {
          email,
        },
      });

      if (!user) {
        throw new Error("User not found");
      }

      return await prisma.board.findMany({
        where: {
          user_id: user.id,
        },
      });
    } catch (error) {
      console.error("Error fetching boards:", error);
      throw new Error("Failed to fetch boards");
    }
  },

  async getBoardById(boardId: string) {
    try {
      return await prisma.board.findUnique({
        where: {
          id: boardId,
        },
      });
    } catch (error) {
      console.error("Error fetching board:", error);
      throw new Error("Failed to fetch board");
    }
  },

  async getBoardWithLists(boardId: string) {
    try {
      const [board, lists] = await Promise.all([
        boardService.getBoardById(boardId),
        listService.getListsByBoardId(boardId),
      ]);

      if (!board) {
        throw new Error("Board not found");
      }
      return { board, lists };
    } catch (error) {
      console.error("Error fetching board with lists:", error);
      throw new Error("Failed to fetch board with lists");
    }
  },

  async createBoard(board: Omit<Board, "id" | "created_at" | "updated_at">) {
    try {
      return await prisma.board.create({
        data: board,
      });
    } catch (error) {
      console.error("Error creating board:", error);
      throw new Error("Failed to create board");
    }
  },

  async createBoardWithDefaultLists(boardData: {
    title: string;
    email: string;
    description?: string;
    color?: string;
  }) {
    try {
      const user = await prisma.user.findUnique({
        where: {
          email: boardData.email,
        },
      });

      if (!user) {
        throw new Error("User not found");
      }

      const board = await prisma.board.create({
        data: {
          title: boardData.title,
          user_id: user.id,
          description: boardData.description,
          color: boardData.color,
        },
      });

      const defaultLists = [
        { title: "To Do", board_id: board.id, order: 0 },
        { title: "In Progress", board_id: board.id, order: 1 },
        { title: "Done", board_id: board.id, order: 2 },
      ];

      const createdLists = await Promise.all(
        defaultLists.map((list) => listService.createList(list)),
      );

      return { board, lists: createdLists };
    } catch (error) {
      console.error("Error creating board with default lists:", error);
      throw new Error("Failed to create board with default lists");
    }
  },

  async updateBoardWithId(
    boardId: string,
    updateData: Partial<
      Omit<Board, "id" | "user_id" | "created_at" | "updated_at">
    >,
  ) {
    try {
      return await prisma.board.update({
        where: {
          id: boardId,
        },
        data: updateData,
      });
    } catch (error) {
      console.error("Error updating board:", error);
      throw new Error("Failed to update board");
    }
  },
};
