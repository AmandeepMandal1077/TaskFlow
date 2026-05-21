"use client";
import { Navbar } from "@/components/navbar";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useBoard } from "@/lib/hooks/useBoards";
import { DialogTitle } from "@radix-ui/react-dialog";
import { useParams } from "next/navigation";
import { useState } from "react";
import type React from "react";

export default function BoardPage() {
  const currentUserName = "Amandeep Mandal";
  const { id } = useParams<{ id: string }>();
  const { board, updateBoard } = useBoard(id);

  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [isFilteringOpen, setIsFilteringOpen] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newColor, setNewColor] = useState("");

  async function handleUpdateBoard(e: React.SubmitEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!newTitle.trim() || !board) return;

    try {
      await updateBoard(board.id, {
        title: newTitle,
        color: newColor || board.color,
      });
    } catch (error) {
      console.error("Error updating board:", error);
    } finally {
      setIsEditingTitle(false);
    }
  }

  const boardTitle = board?.title || "Board";
  return (
    <div className="min-h-screen bg-neutral-100 text-black">
      <Navbar
        username={currentUserName}
        boardTitle={boardTitle}
        boardColor={board?.color || "bg-neutral-300"}
        onEditBoard={() => {
          setNewTitle(board?.title || "");
          setNewColor(board?.color || "");
          setIsEditingTitle(true);
        }}
        onFilterClick={() => {}}
        filterCount={2}
      />

      <Dialog open={isEditingTitle} onOpenChange={setIsEditingTitle}>
        <DialogContent className="rounded-2xl border border-neutral-300 bg-white p-0 shadow-xl sm:max-w-lg">
          <DialogHeader className="border-b border-neutral-200 px-6 py-5">
            <DialogTitle className="text-lg font-semibold tracking-tight">
              Edit Board
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleUpdateBoard} className="space-y-5 px-6 py-5">
            <div className="space-y-2">
              <Label
                htmlFor="title"
                className="text-sm font-medium text-neutral-700"
              >
                Title
              </Label>
              <Input
                id="title"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                placeholder="Enter new board title"
                className="h-11 rounded-xl border-neutral-300 bg-white focus-visible:ring-1 focus-visible:ring-black"
                required
              />
            </div>
            <div className="space-y-2">
              <Label
                htmlFor="color"
                className="text-sm font-medium text-neutral-700"
              >
                Color
              </Label>
              <div className="grid grid-cols-6 gap-3 sm:grid-cols-6">
                {[
                  "bg-red-500",
                  "bg-green-500",
                  "bg-blue-500",
                  "bg-yellow-500",
                  "bg-pink-500",
                  "bg-indigo-500",
                  "bg-gray-500",
                  "bg-teal-500",
                  "bg-orange-500",
                  "bg-purple-500",
                  "bg-cyan-500",
                  "bg-lime-500",
                ].map((color) => (
                  <button
                    key={color}
                    type="button"
                    className={`h-8 w-8 rounded-full border border-neutral-200 shadow-sm transition-transform hover:scale-105 ${color} ${
                      newColor === color
                        ? "ring-2 ring-black ring-offset-2"
                        : "ring-1 ring-black/10 ring-offset-0"
                    }`}
                    onClick={() => setNewColor(color)}
                    aria-label={color}
                  />
                ))}
              </div>
            </div>
            <div className="flex items-center justify-end gap-3 border-t border-neutral-200 pt-5">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsEditingTitle(false)}
                className="h-10 rounded-xl border-neutral-300 bg-white text-sm font-medium text-black hover:bg-neutral-100"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="h-10 rounded-xl border border-black bg-black px-5 text-sm font-medium text-white hover:bg-neutral-800"
              >
                Save Changes
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={isFilteringOpen} onOpenChange={setIsFilteringOpen}>
        <DialogContent className="rounded-2xl border border-neutral-300 bg-white p-0 shadow-xl sm:max-w-lg">
          <DialogHeader className="border-b border-neutral-200 px-6 py-5">
            <DialogTitle className="text-lg font-semibold tracking-tight">
              Filter Cards
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-5 px-6 py-5">
            <p className="text-sm text-neutral-600">
              Filter options will go here.
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
