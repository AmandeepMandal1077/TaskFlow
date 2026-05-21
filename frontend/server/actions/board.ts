"use server";

import { boardService } from "@/server/queries/board";

type CreateBoardInput = {
  title: string;
  description?: string;
  color?: string;
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
