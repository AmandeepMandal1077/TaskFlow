"use client";

import { Board } from "@/generated/prisma/browser";
import {
  createBoardWithDefaultLists,
  getBoardsByEmail,
} from "@/server/actions/board";

import { useCallback, useEffect, useState } from "react";
export function useBoards() {
  const email = "amandeep@email.com";

  const [boards, setBoards] = useState<Board[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadBoards = async () => {
      setLoading(true);
      setError(null);
      try {
        const boards = await getBoardsByEmail(email);
        setBoards(boards);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load boards");
      } finally {
        setLoading(false);
      }
    };
    loadBoards();
  }, [email]);

  const createBoard = async (boardData: {
    title: string;
    description?: string;
    color?: string;
  }) => {
    try {
      const newBoard = await createBoardWithDefaultLists(email, boardData);

      setBoards((prevBoards) => [newBoard.board, ...prevBoards]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create board");
    }
  };

  return {
    boards,
    loading,
    error,
    createBoard,
  };
}
