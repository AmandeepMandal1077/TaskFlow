"use client";

import React, { useState, useRef, useEffect } from "react";
import { ListWithCards } from "@/lib/hooks/useBoards";
import { BoardColumn } from "./board-column";
import { Plus, X } from "lucide-react";
import { Input } from "@/components/ui/input";

interface BoardCanvasProps {
  lists: ListWithCards[];
  onAddCard: (
    listId: string,
    cardData: { title: string; description?: string },
  ) => Promise<any>;
  onAddList: (title: string) => Promise<any>;
  onRenameList: (listId: string, newTitle: string) => Promise<any>;
  onDeleteList: (listId: string) => Promise<any>;
}

export function BoardCanvas({
  lists,
  onAddCard,
  onAddList,
  onRenameList,
  onDeleteList,
}: BoardCanvasProps) {
  const [isAddingList, setIsAddingList] = useState(false);
  const [newListTitle, setNewListTitle] = useState("");
  const formRef = useRef<HTMLFormElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

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

  return (
    <div className="flex-1 w-full overflow-x-auto overflow-y-hidden py-4 h-full flex flex-col justify-start">
      {/* Lists */}
      <div className="flex gap-3 px-4 sm:px-6 select-none items-start h-full pb-4">
        {lists.map((list) => (
          <BoardColumn
            key={list.id}
            list={list}
            onAddCard={onAddCard}
            onRenameList={onRenameList}
            onDeleteList={onDeleteList}
          />
        ))}

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
      </div>
    </div>
  );
}
