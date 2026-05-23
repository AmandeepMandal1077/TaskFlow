"use server";

import { boardService } from "@/server/queries/board";

type CreateBoardInput = {
  title: string;
  description?: string;
  color?: string;
  image_url?: string;
};

export async function createBoardWithDefaultLists(
  email: string,
  boardData: CreateBoardInput,
) {
  return boardService.createBoardWithDefaultLists({
    ...boardData,
    email,
  });
}

export async function getBoardsByEmail(email: string) {
  return boardService.getBoardsByEmail(email);
}

export async function getBoardWithLists(boardId: string) {
  return boardService.getBoardWithLists(boardId);
}

export async function updateBoardWithId(
  boardId: string,
  updateData: Partial<{ title: string; description: string; color: string; image_url: string | null }>,
) {
  return boardService.updateBoardWithId(boardId, updateData);
}
