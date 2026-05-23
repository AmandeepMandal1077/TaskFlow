"use client";

import type { CardWithRelations, Board, List } from "@/lib/api/types";
import {
  createBoardWithDefaultLists,
  getBoardsByEmail,
  getBoardWithLists,
  updateBoardWithId,
  deleteBoard as deleteBoardAction,
} from "@/lib/api/board";
import { createCard, moveCard as moveCardAction, updateCard as updateCardAction, deleteCard as deleteCardAction } from "@/lib/api/card";
import { createList, updateList, deleteList } from "@/lib/api/list";

export type ListWithCards = List & {
  cards: CardWithRelations[];
};

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
    image_url?: string;
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
  const [lists, setLists] = useState<ListWithCards[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadBoards = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await getBoardWithLists(boardId);
        setBoard(data.board);
        setLists(data.listsWithCards);
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
      image_url?: string | null;
    },
  ) {
    try {
      const updatedBoard = await updateBoardWithId(boardId, updatedData);
      setBoard(updatedBoard);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update board");
    }
  }

  async function deleteBoard(boardId: string) {
    try {
      await deleteBoardAction(boardId);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete board");
      throw err;
    }
  }

  async function createCardInList(
    listId: string,
    cardData: { title: string; description?: string; order?: number },
  ) {
    try {
      const newCard = await createCard(listId, {
        ...cardData,
        order:
          cardData.order ||
          lists.find((list) => list.id === listId)?.cards.length ||
          0,
      });

      setLists((prevLists) =>
        prevLists.map((list) =>
          list.id === listId
            ? { ...list, cards: [...list.cards, newCard] }
            : list,
        ),
      );

      return newCard;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create card");
    }
  }

  async function createListInBoard(listData: {
    title: string;
    order?: number;
  }) {
    try {
      const newList = await createList(boardId, {
        title: listData.title,
        order: listData.order ?? lists.length,
      });
      const newListWithCards: ListWithCards = {
        ...newList,
        cards: [],
      };
      setLists((prevLists) => [...prevLists, newListWithCards]);
      return newList;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create list");
    }
  }

  async function updateListInBoard(
    listId: string,
    updateData: { title?: string; order?: number },
  ) {
    try {
      const updatedList = await updateList(listId, updateData);
      setLists((prevLists) =>
        prevLists.map((list) =>
          list.id === listId ? { ...list, ...updatedList } : list,
        ),
      );
      return updatedList;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update list");
    }
  }

  async function deleteListInBoard(listId: string) {
    try {
      await deleteList(listId);
      setLists((prevLists) => prevLists.filter((list) => list.id !== listId));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete list");
    }
  }

  async function moveCard(
    cardId: string,
    targetListId: string,
    targetOrder: number,
  ) {
    try {
      await moveCardAction(cardId, targetListId, targetOrder);
      setLists((prevLists) => {
        const newLists = [...prevLists];
        let movedCard: CardWithRelations | null = null;

        for (const list of newLists) {
          const cardIndex = list.cards.findIndex((card: CardWithRelations) => card.id === cardId);
          if (cardIndex !== -1) {
            movedCard = list.cards[cardIndex];
            list.cards.splice(cardIndex, 1);
            break;
          }
        }

        if (movedCard) {
          const targetList = newLists.find((list) => list.id === targetListId);
          if (targetList) {
            targetList.cards.splice(targetOrder, 0, movedCard);
          }
        }

        return newLists;
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to move card");
    }
  }

  async function updateCardInList(
    cardId: string,
    data: Parameters<typeof updateCardAction>[1]
  ) {
    try {
      const updatedCard = await updateCardAction(cardId, data);
      setLists((prevLists) =>
        prevLists.map((list) => ({
          ...list,
          cards: list.cards.map((card: CardWithRelations) =>
            card.id === cardId ? { ...card, ...updatedCard } : card
          ),
        }))
      );
      return updatedCard;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update card");
    }
  }

  async function deleteCardInList(cardId: string) {
    try {
      await deleteCardAction(cardId);
      setLists((prevLists) =>
        prevLists.map((list) => ({
          ...list,
          cards: list.cards.filter((card: CardWithRelations) => card.id !== cardId),
        }))
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete card");
    }
  }

  return {
    board,
    lists,
    loading,
    error,
    setLists,
    updateBoard,
    deleteBoard,
    createCardInList,
    createListInBoard,
    updateListInBoard,
    deleteListInBoard,
    moveCard,
    updateCardInList,
    deleteCardInList,
  };
}
