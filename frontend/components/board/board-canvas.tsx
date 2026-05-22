"use client";

import React, { useState, useRef, useEffect } from "react";
import { ListWithCards, useBoard } from "@/lib/hooks/useBoards";
import { BoardColumn } from "./board-column";
import { Plus, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  DndContext,
  DragEndEvent,
  DragOverEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  closestCorners,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { CardWithRelations } from "@/server/queries/card";
import { BoardCardOverlay } from "./board-card";
import { reorderCards, updateCard } from "@/server/actions/card";
import { CardDetailDialog } from "./card-detail-dialog";

interface BoardCanvasProps {
  listId: string;
  setLists: React.Dispatch<React.SetStateAction<ListWithCards[]>>;
  lists: ListWithCards[];
  onAddCard: (
    listId: string,
    cardData: { title: string; description?: string },
  ) => Promise<any>;
  onAddList: (title: string) => Promise<any>;
  onRenameList: (listId: string, newTitle: string) => Promise<any>;
  onDeleteList: (listId: string) => Promise<any>;
  filterCards: (cards: CardWithRelations[]) => CardWithRelations[];
  isAnyFilterActive: boolean;
}

export function BoardCanvas({
  listId,
  setLists,
  lists,
  onAddCard,
  onAddList,
  onRenameList,
  onDeleteList,
  filterCards,
  isAnyFilterActive,
}: BoardCanvasProps) {
  const [isAddingList, setIsAddingList] = useState(false);
  const [newListTitle, setNewListTitle] = useState("");
  const formRef = useRef<HTMLFormElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const [activeCard, setActiveCard] = useState<CardWithRelations | null>(null);
  const [selectedCardId, setSelectedCardId] = useState<string | null>(null);
  const affectedListIds = useRef<Set<string>>(new Set());
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    }),
  );

  function handleDragStart(event: DragStartEvent) {
    const cardId = event.active.id as string;
    const card = lists
      .flatMap((list) => list.cards)
      .find((c) => c.id === cardId);

    if (card) {
      setActiveCard(card);
      affectedListIds.current.clear();
      // Record the starting list
      const startList = lists.find((l) => l.cards.some((c) => c.id === cardId));
      if (startList) affectedListIds.current.add(startList.id);
    }
  }

  function handleDragOver(event: DragOverEvent) {
    const { active, over } = event;
    if (!over) return;

    const activeId = active.id as string;
    const overId = over.id as string;
    if (activeId === overId) return;

    setLists((prev: ListWithCards[]) => {
      const sourceList = prev.find((list) =>
        list.cards.some((card) => card.id === activeId),
      );

      let targetList = prev.find((list) =>
        list.cards.some((card) => card.id === overId),
      );
      if (!targetList) {
        targetList = prev.find((list) => list.id === overId);
      }

      if (!sourceList || !targetList) return prev;

      // Track affected lists
      affectedListIds.current.add(sourceList.id);
      affectedListIds.current.add(targetList.id);

      if (sourceList.id === targetList.id) {
        const activeIndex = sourceList.cards.findIndex(
          (card) => card.id === activeId,
        );
        const overIndex = sourceList.cards.findIndex(
          (card) => card.id === overId,
        );
        
        if (overIndex === -1 || activeIndex === overIndex) return prev;

        const newLists = prev.map((l) => ({ ...l, cards: [...l.cards] }));
        const list = newLists.find((l) => l.id === sourceList.id)!;
        const [removed] = list.cards.splice(activeIndex, 1);
        list.cards.splice(overIndex, 0, removed);
        return newLists;
      } else {
        const activeIndex = sourceList.cards.findIndex(
          (card) => card.id === activeId,
        );
        const overIndex = targetList.cards.findIndex(
          (card) => card.id === overId,
        );
        const insertIndex = overIndex >= 0 ? overIndex : targetList.cards.length;

        const newLists = prev.map((l) => ({ ...l, cards: [...l.cards] }));
        const src = newLists.find((l) => l.id === sourceList.id)!;
        const tgt = newLists.find((l) => l.id === targetList!.id)!;
        const [removed] = src.cards.splice(activeIndex, 1);
        tgt.cards.splice(insertIndex, 0, removed);
        return newLists;
      }
    });
  }

  async function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    setActiveCard(null);
    if (!over) {
      affectedListIds.current.clear();
      return;
    }

    // Build the affected lists payload from current state
    const payload = lists
      .filter((list) => affectedListIds.current.has(list.id))
      .map((list) => ({
        listId: list.id,
        cardIds: list.cards.map((card) => card.id),
      }));

    affectedListIds.current.clear();

    if (payload.length > 0) {
      try {
        await reorderCards(payload);
      } catch (err) {
        console.error("Failed to reorder cards", err);
      }
    }
  }

  // Close form on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (formRef.current && !formRef.current.contains(event.target as Node)) {
        setIsAddingList(false);
        setNewListTitle("");
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Focus input when form opens
  useEffect(() => {
    if (isAddingList && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isAddingList]);

  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!newListTitle.trim()) return;

    try {
      await onAddList(newListTitle.trim());
      setNewListTitle("");
      setIsAddingList(false);
    } catch (err) {
      console.error("Failed to add list", err);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      setIsAddingList(false);
      setNewListTitle("");
    }
  };

  const handleToggleComplete = async (cardId: string, isComplete: boolean) => {
    setLists((prev) => prev.map((l) => ({
      ...l,
      cards: l.cards.map((c) => c.id === cardId ? { ...c, is_complete: isComplete } : c),
    })));
    try {
      await updateCard(cardId, { is_complete: isComplete });
    } catch (err) {
      console.error("Failed to toggle completion", err);
    }
  };

  return (
    <div className="flex-1 w-full overflow-x-auto overflow-y-hidden py-4 h-full flex flex-col justify-start">
      {/* Lists */}
      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
      >
        <div className="flex gap-3 px-4 sm:px-6 select-none items-start h-full pb-4">
          {lists.map((list) => {
            const filteredCards = filterCards(list.cards);
            return (
              <BoardColumn
                key={list.id}
                list={list}
                filteredCards={filteredCards}
                isAnyFilterActive={isAnyFilterActive}
                onAddCard={onAddCard}
                onRenameList={onRenameList}
                onDeleteList={onDeleteList}
                onCardClick={(cardId) => setSelectedCardId(cardId)}
                onToggleComplete={handleToggleComplete}
              />
            );
          })}

          {/* Add List Inline Panel */}
          <div className="w-64 shrink-0">
            {isAddingList ? (
              <form
                ref={formRef}
                onSubmit={handleSubmit}
                className="bg-neutral-800/90 backdrop-blur-sm rounded-xl p-3 space-y-2.5 animate-in fade-in duration-150"
              >
                <Input
                  ref={inputRef}
                  value={newListTitle}
                  onChange={(e) => setNewListTitle(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Enter list title..."
                  className="h-9 rounded-lg border-neutral-600 bg-neutral-700 px-3 text-sm text-white placeholder:text-neutral-400 focus-visible:ring-1 focus-visible:ring-neutral-400"
                  required
                />
                <div className="flex items-center gap-2">
                  <button
                    type="submit"
                    className="h-8 rounded-lg bg-blue-600 text-white px-3.5 text-xs font-medium hover:bg-blue-500 transition-colors"
                  >
                    Add List
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setIsAddingList(false);
                      setNewListTitle("");
                    }}
                    className="h-8 w-8 flex items-center justify-center rounded-lg text-neutral-400 hover:text-neutral-200 hover:bg-neutral-700 transition-colors"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              </form>
            ) : (
              <button
                onClick={() => setIsAddingList(true)}
                className="flex items-center gap-2 w-full px-3 py-2.5 bg-neutral-800/70 hover:bg-neutral-800/90 backdrop-blur-sm rounded-xl text-sm font-medium text-neutral-300 hover:text-white transition-all duration-150"
              >
                <Plus className="h-4 w-4" />
                <span>Add another list</span>
              </button>
            )}
          </div>
          <DragOverlay>
            {activeCard ? <BoardCardOverlay card={activeCard} /> : null}
          </DragOverlay>
        </div>
      </DndContext>

      <CardDetailDialog 
        card={lists.flatMap(l => l.cards).find(c => c.id === selectedCardId) || null}
        isOpen={!!selectedCardId}
        onClose={() => setSelectedCardId(null)}
        lists={lists}
        setLists={setLists}
      />
    </div>
  );
}
