"use client";

import React, { useState, useRef, useEffect } from "react";
import { ListWithCards } from "@/lib/hooks/useBoards";
import { CardWithRelations } from "@/server/queries/card";
import {
  Plus,
  X,
  MoreHorizontal,
  Trash2,
  Edit2,
  ChevronsLeftRight,
  ChevronsRightLeft,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useDroppable } from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { BoardCard } from "./board-card";

interface BoardColumnProps {
  list: ListWithCards;
  filteredCards: CardWithRelations[];
  isAnyFilterActive: boolean;
  onAddCard: (
    listId: string,
    cardData: { title: string; description?: string },
  ) => Promise<any>;
  onRenameList: (listId: string, newTitle: string) => Promise<any>;
  onDeleteList: (listId: string) => Promise<any>;
  onCardClick?: (cardId: string) => void;
  onToggleComplete?: (cardId: string, isComplete: boolean) => void;
}

export function BoardColumn({
  list,
  filteredCards,
  isAnyFilterActive,
  onAddCard,
  onRenameList,
  onDeleteList,
  onCardClick,
  onToggleComplete,
}: BoardColumnProps) {
  const [isAddingCard, setIsAddingCard] = useState(false);
  const [newCardTitle, setNewCardTitle] = useState("");
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [editedTitle, setEditedTitle] = useState(list.title);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);

  const menuRef = useRef<HTMLDivElement>(null);
  const titleInputRef = useRef<HTMLInputElement>(null);
  const cardInputRef = useRef<HTMLTextAreaElement>(null);

  const { setNodeRef, isOver } = useDroppable({ id: list.id });

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Focus inputs when activated
  useEffect(() => {
    if (isEditingTitle && titleInputRef.current) {
      titleInputRef.current.focus();
      titleInputRef.current.select();
    }
  }, [isEditingTitle]);

  useEffect(() => {
    if (isAddingCard && cardInputRef.current) {
      cardInputRef.current.focus();
    }
  }, [isAddingCard]);

  // Sync state if prop changes
  useEffect(() => {
    setEditedTitle(list.title);
  }, [list.title]);

  const handleRenameSubmit = async () => {
    if (!editedTitle.trim()) {
      setEditedTitle(list.title);
      setIsEditingTitle(false);
      return;
    }
    if (editedTitle.trim() !== list.title) {
      await onRenameList(list.id, editedTitle.trim());
    }
    setIsEditingTitle(false);
  };

  const handleKeyDownTitle = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleRenameSubmit();
    } else if (e.key === "Escape") {
      setEditedTitle(list.title);
      setIsEditingTitle(false);
    }
  };

  const handleAddCardSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCardTitle.trim()) return;

    try {
      await onAddCard(list.id, { title: newCardTitle.trim() });
      setNewCardTitle("");
      setIsAddingCard(false);
    } catch (err) {
      console.error("Failed to add card", err);
    }
  };

  const handleKeyDownCard = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleAddCardSubmit(e);
    } else if (e.key === "Escape") {
      setIsAddingCard(false);
      setNewCardTitle("");
    }
  };

  const totalCards = list.cards.length;
  const matchedCards = filteredCards.length;
  const showFilterIndicator = isAnyFilterActive;

  // Collapsed state: vertical strip with rotated title and card count
  if (isCollapsed) {
    return (
      <div
        ref={setNodeRef}
        className="flex shrink-0 flex-col items-center bg-neutral-800/90 backdrop-blur-sm rounded-xl w-10 py-2 gap-2 self-start"
      >
        <button
          onClick={() => setIsCollapsed(false)}
          className="p-1 text-neutral-400 hover:text-white transition-colors"
          aria-label="Expand list"
        >
          <ChevronsLeftRight className="h-3.5 w-3.5" />
        </button>
        <div className="flex flex-col items-center gap-3 py-2">
          <span
            className="font-semibold text-neutral-300 whitespace-nowrap"
            style={{
              writingMode: "vertical-rl",
              textOrientation: "mixed",
            }}
          >
            {list.title}
          </span>
          <span
            className="font-medium text-neutral-400"
            style={{
              writingMode: "vertical-rl",
              textOrientation: "mixed",
            }}
          >
            {showFilterIndicator ? `${matchedCards}/${totalCards}` : totalCards}
          </span>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={setNodeRef}
      className={`flex h-fit w-64 shrink-0 flex-col bg-neutral-800/90 backdrop-blur-sm rounded-xl max-h-[75vh] ${isOver ? "bg-blue-500/20" : ""}`}
    >
      {/* List Header */}
      <div className="relative flex items-center justify-between px-3 py-2.5">
        <div className="flex-1 min-w-0 mr-1">
          {isEditingTitle ? (
            <Input
              ref={titleInputRef}
              value={editedTitle}
              onChange={(e) => setEditedTitle(e.target.value)}
              onBlur={handleRenameSubmit}
              onKeyDown={handleKeyDownTitle}
              className="h-7 rounded-md border-neutral-600 bg-neutral-700 px-2 py-0.5 text-sm font-semibold text-white focus-visible:ring-1 focus-visible:ring-neutral-400"
            />
          ) : (
            <h3
              onClick={() => setIsEditingTitle(true)}
              className="font-semibold text-neutral-100 truncate cursor-pointer hover:text-white px-0.5 transition-colors"
            >
              {list.title}
            </h3>
          )}
        </div>

        <div className="flex items-center gap-0.5">
          {/* Collapse button */}
          <button
            onClick={() => setIsCollapsed(true)}
            className="h-7 w-7 flex items-center justify-center rounded-md text-neutral-400 hover:bg-neutral-700 hover:text-neutral-200 transition-colors"
            aria-label="Collapse list"
          >
            <ChevronsRightLeft className="h-3.5 w-3.5" />
          </button>

          {/* List Actions Dropdown */}
          <div className="relative" ref={menuRef}>
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="h-7 w-7 flex items-center justify-center rounded-md text-neutral-400 hover:bg-neutral-700 hover:text-neutral-200 transition-colors"
            >
              <MoreHorizontal className="h-4 w-4" />
            </button>

            {isMenuOpen && (
              <div className="absolute right-0 top-8 z-50 w-48 rounded-lg border border-neutral-700 bg-neutral-800 p-1 shadow-xl animate-in fade-in slide-in-from-top-1 duration-100">
                <button
                  onClick={() => {
                    setIsEditingTitle(true);
                    setIsMenuOpen(false);
                  }}
                  className="flex items-center gap-2 w-full px-2.5 py-1.5 text-xs font-medium text-neutral-300 hover:bg-neutral-700 hover:text-white rounded-md text-left transition-colors"
                >
                  <Edit2 className="h-3.5 w-3.5" />
                  Rename List
                </button>
                <button
                  onClick={() => {
                    setIsAddingCard(true);
                    setIsMenuOpen(false);
                  }}
                  className="flex items-center gap-2 w-full px-2.5 py-1.5 text-xs font-medium text-neutral-300 hover:bg-neutral-700 hover:text-white rounded-md text-left transition-colors"
                >
                  <Plus className="h-3.5 w-3.5" />
                  Add Card
                </button>
                <div className="h-px bg-neutral-700 my-1" />
                <button
                  onClick={() => {
                    if (confirm("Are you sure you want to delete this list?")) {
                      onDeleteList(list.id);
                    }
                    setIsMenuOpen(false);
                  }}
                  className="flex items-center gap-2 w-full px-2.5 py-1.5 text-xs font-medium text-red-400 hover:bg-red-500/10 hover:text-red-300 rounded-md text-left transition-colors"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                  Delete List
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Filter Indicator */}
      {showFilterIndicator && (
        <div className="px-3 pb-1.5">
          <span className="text-[11px] font-medium text-blue-400">
            {matchedCards} {matchedCards === 1 ? "card matches" : "cards match"} filter
          </span>
        </div>
      )}

      {/* Cards Stack */}

      <SortableContext
        items={filteredCards.map((card) => card.id)}
        strategy={verticalListSortingStrategy}
      >
        <div className="flex-1 overflow-y-auto px-2 pb-1 space-y-1.5 min-h-0">
          {filteredCards.map((card) => (
            <BoardCard 
              key={card.id} 
              card={card} 
              onClick={() => onCardClick?.(card.id)} 
              onToggleComplete={onToggleComplete}
            />
          ))}
          {isAnyFilterActive && filteredCards.length === 0 && totalCards > 0 && (
            <div className="px-2 py-4 text-center">
              <p className="text-xs text-neutral-500">No cards match</p>
            </div>
          )}
        </div>
      </SortableContext>

      {/* Footer: Add card + open icon */}
      <div className="px-2 py-1.5">
        {isAddingCard ? (
          <form
            onSubmit={handleAddCardSubmit}
            className="space-y-2 p-2 bg-neutral-700/60 rounded-lg"
          >
            <Textarea
              ref={cardInputRef}
              value={newCardTitle}
              onChange={(e) => setNewCardTitle(e.target.value)}
              onKeyDown={handleKeyDownCard}
              placeholder="Enter a title for this card..."
              className="resize-none border-none bg-neutral-700 text-neutral-100 placeholder:text-neutral-400 p-1 text-sm rounded-lg focus-visible:ring-1 focus-visible:ring-neutral-500 focus-visible:ring-offset-0 min-h-9"
            />
            <div className="flex items-center gap-2">
              <Button
                type="submit"
                size="sm"
                className="h-7 rounded-md bg-blue-600 text-white px-3 text-xs font-medium hover:bg-blue-500"
              >
                Add Card
              </Button>
              <button
                type="button"
                onClick={() => {
                  setIsAddingCard(false);
                  setNewCardTitle("");
                }}
                className="h-7 w-7 flex items-center justify-center rounded-md text-neutral-400 hover:text-neutral-200 hover:bg-neutral-600 transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </form>
        ) : (
          <div className="flex items-center justify-between">
            <button
              onClick={() => setIsAddingCard(true)}
              className="flex items-center gap-1.5 text-neutral-400 hover:text-neutral-200 px-1 py-1 rounded-md hover:bg-neutral-700/50 transition-colors w-full"
            >
              <Plus className="h-4 w-4" />
              <span>Add a card</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
