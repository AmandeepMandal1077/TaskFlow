"use client";

import { Board, List } from "@/generated/prisma/browser";
import {
  createBoardWithDefaultLists,
  getBoardsByEmail,
  getBoardWithLists,
  updateBoardWithId,
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

export function useBoard(boardId: string) {
  const [board, setBoard] = useState<Board | null>(null);
  const [lists, setLists] = useState<List[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadBoards = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await getBoardWithLists(boardId);
        setBoard(data.board);
        setLists(data.lists);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load boards");
      } finally {
        setLoading(false);
      }
    };
    loadBoards();
  }, [boardId]);

  async function updateBoard(
    boardId: string,
    updatedData: {
      title?: string;
      description?: string;
      color?: string;
    },
  ) {
    try {
      const updatedBoard = await updateBoardWithId(boardId, updatedData);
      setBoard(updatedBoard);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update board");
    }
  }

  return {
    board,
    lists,
    loading,
    error,
    updateBoard,
  };
}
