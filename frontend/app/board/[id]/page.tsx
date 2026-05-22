"use client";
import { Navbar } from "@/components/navbar";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useBoard, useBoards } from "@/lib/hooks/useBoards";
import { BoardCanvas } from "@/components/board/board-canvas";
import { DialogTitle } from "@radix-ui/react-dialog";
import { ArrowLeftRight, Search } from "lucide-react";
import { useParams } from "next/navigation";
import { useState } from "react";
import type React from "react";
import Link from "next/link";

export default function BoardPage() {
  const currentUserName = "Amandeep Mandal";
  const { id } = useParams<{ id: string }>();
  const {
    board,
    updateBoard,
    lists,
    createCardInList,
    createListInBoard,
    updateListInBoard,
    deleteListInBoard,
    setLists,
  } = useBoard(id);

  const { boards } = useBoards();

  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [isFilteringOpen, setIsFilteringOpen] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newColor, setNewColor] = useState("");
  const [isSwitchBoardOpen, setIsSwitchBoardOpen] = useState(false);
  const [boardSearchQuery, setBoardSearchQuery] = useState("");

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

  const filteredBoards = boards.filter(
    (b) =>
      b.id !== id &&
      b.title.toLowerCase().includes(boardSearchQuery.toLowerCase()),
  );

  const boardTitle = board?.title || "Board";
  return (
    <div className="h-screen w-screen flex flex-col bg-neutral-900 text-white overflow-hidden">
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

      {/* Switch Boards Dialog */}
      <Dialog open={isSwitchBoardOpen} onOpenChange={setIsSwitchBoardOpen}>
        <DialogContent className="rounded-2xl border border-neutral-300 bg-white p-0 shadow-xl sm:max-w-lg text-black">
          <DialogHeader className="border-b border-neutral-200 px-6 py-5">
            <DialogTitle className="text-lg font-semibold tracking-tight">
              Switch Board
            </DialogTitle>
          </DialogHeader>
          <div className="px-6 py-4 space-y-4">
            {/* Search bar */}
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-500" />
              <Input
                placeholder="Search boards..."
                value={boardSearchQuery}
                onChange={(e) => setBoardSearchQuery(e.target.value)}
                className="h-11 rounded-xl border-neutral-300 bg-white pl-10 text-sm placeholder:text-neutral-400 focus-visible:ring-1 focus-visible:ring-black"
              />
            </div>

            {/* Board list */}
            <div className="max-h-[400px] overflow-y-auto space-y-3">
              {filteredBoards.length === 0 ? (
                <div className="rounded-xl border border-dashed border-neutral-300 px-4 py-8 text-center">
                  <p className="text-sm text-neutral-500">No boards found.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {filteredBoards.map((b) => (
                    <Link
                      key={b.id}
                      href={`/board/${b.id}`}
                      onClick={() => setIsSwitchBoardOpen(false)}
                    >
                      <Card className="h-40 gap-0 overflow-hidden rounded-2xl border-neutral-300 bg-white p-0 transition-all duration-200 hover:-translate-y-0.5 hover:border-black hover:shadow-md cursor-pointer">
                        <CardHeader
                          className={`h-[70%] border-b border-neutral-200 p-0 ${
                            b.color || "bg-neutral-200"
                          }`}
                        />
                        <CardContent className="flex h-[30%] items-center justify-between gap-3 p-3">
                          <CardTitle className="line-clamp-1 text-sm font-semibold tracking-tight">
                            {b.title}
                          </CardTitle>
                          <span className="shrink-0 text-[11px] text-neutral-500">
                            {new Date(b.updated_at).toLocaleDateString()}
                          </span>
                        </CardContent>
                      </Card>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Board content */}
      <main className="flex-1 min-h-0 relative">
        <BoardCanvas
          listId={id}
          setLists={setLists}
          lists={lists}
          onAddCard={createCardInList}
          onAddList={(title) => createListInBoard({ title })}
          onRenameList={(listId, title) => updateListInBoard(listId, { title })}
          onDeleteList={deleteListInBoard}
        />
      </main>

      {/* Bottom Bar */}
      <div className="shrink-0 flex items-center justify-center border-t border-neutral-800 bg-neutral-900/95 backdrop-blur-sm px-4 py-2">
        <button
          onClick={() => {
            setBoardSearchQuery("");
            setIsSwitchBoardOpen(true);
          }}
          className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors"
        >
          <ArrowLeftRight className="h-4 w-4" />
          <span>Switch boards</span>
        </button>
      </div>
    </div>
  );
}
