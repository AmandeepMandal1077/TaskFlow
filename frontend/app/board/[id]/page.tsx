"use client";
import { Navbar } from "@/components/navbar";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useBoard, useBoards } from "@/lib/hooks/useBoards";
import { useCardFilters } from "@/lib/hooks/useCardFilters";
import { useDebounce } from "@/lib/hooks/useDebounce";
import { BoardCanvas } from "@/components/board/board-canvas";
import { CardFilterPanel } from "@/components/board/card-filter-panel";
import { DialogTitle } from "@radix-ui/react-dialog";
import { ArrowLeftRight, Search, Check } from "lucide-react";
import { useParams } from "next/navigation";
import { useRef, useState } from "react";
import type React from "react";
import Link from "next/link";
import BoardLoading from "./loading";

const COLORS = [
  "bg-blue-600",
  "bg-orange-500",
  "bg-green-600",
  "bg-red-600",
  "bg-purple-600",
  "bg-pink-600",
];

const DEFAULT_IMAGES = [
  "https://images.unsplash.com/photo-1542273917363-3b1817f69a5d?q=80&w=1920&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=1920&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1519681393784-d120267933ba?q=80&w=1920&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=1920&auto=format&fit=crop",
];

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
    loading,
  } = useBoard(id);

  const { boards } = useBoards();
  const cardFilters = useCardFilters();

  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newColor, setNewColor] = useState("");
  const [newImage, setNewImage] = useState("");
  const [isSwitchBoardOpen, setIsSwitchBoardOpen] = useState(false);
  const [boardSearchQuery, setBoardSearchQuery] = useState("");
  const debouncedBoardSearch = useDebounce(boardSearchQuery, 300);

  const filterButtonRef = useRef<HTMLDivElement>(null);

  async function handleUpdateBoard(e: React.SubmitEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!newTitle.trim() || !board) return;

    try {
      await updateBoard(board.id, {
        title: newTitle,
        color: newColor || undefined,
        image_url: newImage || null,
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
      b.title.toLowerCase().includes(debouncedBoardSearch.toLowerCase().trim()),
  );

  if (loading) {
    return <BoardLoading />;
  }

  const boardTitle = board?.title || "Board";
  return (
    <div
      className={`h-screen w-screen flex flex-col text-white overflow-hidden bg-cover bg-center ${board?.image_url ? "bg-neutral-900" : (board?.color || "bg-neutral-900")}`}
      style={board?.image_url ? { backgroundImage: `url(${board.image_url})` } : undefined}
    >
      <Navbar
        username={currentUserName}
        boardTitle={boardTitle}
        boardColor={board?.image_url ? "bg-black/20 backdrop-blur-sm" : (board?.color || "bg-neutral-800")}
        onEditBoard={() => {
          setNewTitle(board?.title || "");
          setNewColor(board?.image_url ? "" : (board?.color || COLORS[0]));
          setNewImage(board?.image_url || "");
          setIsEditingTitle(true);
        }}
        onFilterClick={() => setIsFilterOpen(!isFilterOpen)}
        filterCount={cardFilters.activeFilterCount}
      />

      {/* Filter Panel (positioned below navbar) */}
      {isFilterOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-30"
            onClick={() => setIsFilterOpen(false)}
          />
          <div className="absolute right-4 top-[4.5rem] z-40" ref={filterButtonRef}>
            <CardFilterPanel
              filters={cardFilters.filters}
              onSearchChange={cardFilters.setSearchQuery}
              onToggleLabel={cardFilters.toggleLabel}
              onToggleMember={cardFilters.toggleMember}
              onToggleDueDate={cardFilters.toggleDueDate}
              onClearAll={cardFilters.clearAll}
              isAnyFilterActive={cardFilters.isAnyFilterActive}
            />
          </div>
        </>
      )}

      <Dialog open={isEditingTitle} onOpenChange={setIsEditingTitle}>
        <DialogContent className="rounded-2xl border border-neutral-700 bg-neutral-900 p-0 shadow-xl sm:max-w-lg text-white">
          <DialogHeader className="border-b border-neutral-700 px-6 py-5">
            <DialogTitle className="text-lg font-semibold tracking-tight text-neutral-100">
              Edit Board
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleUpdateBoard} className="space-y-5 px-6 py-5">
            <div className="space-y-2">
              <Label
                htmlFor="title"
                className="text-sm font-medium text-neutral-300"
              >
                Title
              </Label>
              <Input
                id="title"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                placeholder="Enter new board title"
                className="h-11 rounded-xl border-neutral-600 bg-neutral-700 text-white placeholder:text-neutral-400 focus-visible:ring-1 focus-visible:ring-neutral-500"
                required
              />
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-medium text-neutral-300">Background</Label>

              {/* Images */}
              <div className="grid grid-cols-4 gap-1.5 mb-1.5">
                {DEFAULT_IMAGES.map((img) => (
                  <button
                    key={img}
                    type="button"
                    onClick={() => { setNewImage(img); setNewColor(""); }}
                    className="relative h-10 rounded-[4px] bg-cover bg-center hover:opacity-80 transition-opacity overflow-hidden group"
                    style={{ backgroundImage: `url(${img})` }}
                  >
                    {newImage === img && (
                      <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                        <Check className="h-4 w-4 text-white" />
                      </div>
                    )}
                  </button>
                ))}
              </div>

              {/* Colors */}
              <div className="grid grid-cols-6 gap-1.5">
                {COLORS.map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => { setNewColor(c); setNewImage(""); }}
                    className={`relative h-8 rounded-[4px] hover:opacity-80 transition-opacity ${c}`}
                  >
                    {newColor === c && (
                      <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                        <Check className="h-3 w-3 text-white" />
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>
            <div className="flex items-center justify-end gap-3 border-t border-neutral-700 pt-5">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsEditingTitle(false)}
                className="h-10 rounded-xl border-neutral-600 bg-neutral-700 text-sm font-medium text-neutral-200 hover:bg-neutral-600"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="h-10 rounded-xl border border-transparent bg-blue-600 px-5 text-sm font-medium text-white hover:bg-blue-500"
              >
                Save Changes
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Switch Boards Dialog */}
      <Dialog open={isSwitchBoardOpen} onOpenChange={setIsSwitchBoardOpen}>
        <DialogContent className="rounded-2xl border border-neutral-700 bg-neutral-900 p-0 shadow-xl sm:max-w-2xl text-white top-[15vh] translate-y-0">
          <DialogHeader className="border-b border-neutral-700 px-6 py-5">
            <DialogTitle className="text-lg font-semibold tracking-tight text-neutral-100">
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
                className="h-11 rounded-xl border-neutral-600 bg-neutral-700 pl-10 text-sm text-white placeholder:text-neutral-400 focus-visible:ring-1 focus-visible:ring-neutral-500"
              />
            </div>

            {/* Board grid */}
            <div className="max-h-[400px] overflow-y-auto space-y-3">
              {filteredBoards.length === 0 ? (
                <div className="rounded-xl border border-dashed border-neutral-600 px-4 py-8 text-center">
                  <p className="text-sm text-neutral-500">No boards found.</p>
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-2">
                  {filteredBoards.map((b) => (
                    <Link
                      key={b.id}
                      href={`/board/${b.id}`}
                      onClick={() => setIsSwitchBoardOpen(false)}
                    >
                      <Card className="h-24 gap-0 overflow-hidden rounded-xl border-neutral-700 bg-neutral-800 p-0 transition-all duration-200 hover:-translate-y-0.5 hover:border-neutral-500 hover:shadow-md cursor-pointer">
                        <CardHeader
                          className={`h-[75%] border-b border-neutral-700 p-0 bg-cover bg-center ${!b.image_url ? (b.color || "bg-neutral-600") : ""
                            }`}
                          style={b.image_url ? { backgroundImage: `url(${b.image_url})` } : undefined}
                        />
                        <CardContent className="flex h-[25%] items-center justify-between gap-3 p-3">
                          <CardTitle className="truncate text-xs tracking-tight text-neutral-200">
                            {b.title}
                          </CardTitle>
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
          filterCards={cardFilters.filterCards}
          isAnyFilterActive={cardFilters.isAnyFilterActive}
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
