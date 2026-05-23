"use client";

import { useState } from "react";
import { Navbar } from "@/components/navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useBoards } from "@/lib/hooks/useBoards";
import { useDebounce } from "@/lib/hooks/useDebounce";
import { Loader, Plus, Search, X, Check } from "lucide-react";
import Link from "next/link";
import DashboardLoading from "./loading";

const COLORS = [
  "bg-blue-600",
  "bg-orange-600",
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

export default function Dashboard() {
  const currentUserName = "Amandeep Mandal";
  const { createBoard, boards, loading, error } = useBoards();

  const [isCreating, setIsCreating] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newColor, setNewColor] = useState("");
  const [newImage, setNewImage] = useState(DEFAULT_IMAGES[0]);
  const [titleError, setTitleError] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const debouncedSearch = useDebounce(searchQuery, 300);

  const filteredBoards = boards.filter((board) =>
    board.title.toLowerCase().includes(debouncedSearch.toLowerCase().trim()),
  );

  if (loading) {
    return <DashboardLoading />;
  }

  const handleCreateBoard = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) {
      setTitleError(true);
      return;
    }

    await createBoard({
      title: newTitle.trim(),
      color: newColor || undefined,
      image_url: newImage || undefined
    });

    setNewTitle("");
    setNewColor("");
    setNewImage(DEFAULT_IMAGES[0]);
    setIsCreating(false);
    setTitleError(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-neutral-900 text-neutral-200">
        <Navbar username={currentUserName} />
        <div className="mx-auto flex w-full max-w-7xl items-center justify-center px-4 py-16 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3 rounded-2xl border border-neutral-700 bg-neutral-800 px-5 py-4 shadow-sm">
            <Loader className="h-5 w-5 animate-spin text-neutral-400" />
            <span className="text-sm font-medium text-neutral-300">
              Loading your boards...
            </span>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-neutral-900 text-neutral-200">
        <Navbar username={currentUserName} />
        <div className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
          <div className="rounded-2xl border border-neutral-700 bg-neutral-800 p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-red-400">Error loading boards</h2>
            <p className="mt-2 text-sm text-neutral-400">Error: {error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-900 text-neutral-200">
      <Navbar username={currentUserName} />

      <main className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Header + Search */}
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <h1 className="text-2xl font-bold tracking-tight text-white">Your Boards</h1>
          <div className="relative w-full sm:w-72">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-500" />
            <Input
              placeholder="Search boards..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-9 rounded-xl border-neutral-700 bg-neutral-800 pl-9 pr-8 text-sm text-white placeholder:text-neutral-500 focus-visible:ring-1 focus-visible:ring-neutral-500"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-white transition-colors"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Boards Grid */}
        {filteredBoards.length === 0 && debouncedSearch.trim() !== "" ? (
          <div className="rounded-2xl border border-dashed border-neutral-700 px-6 py-16 text-center">
            <Search className="mx-auto mb-3 h-8 w-8 text-neutral-600" />
            <p className="text-sm font-medium text-neutral-400">
              No boards match &ldquo;{debouncedSearch}&rdquo;
            </p>
            <button
              onClick={() => setSearchQuery("")}
              className="mt-2 text-xs font-medium text-blue-400 hover:text-blue-300 transition-colors"
            >
              Clear search
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredBoards.map((board) => (
              <div key={board.id} className="group">
                <Link href={`/board/${board.id}`}>
                  <Card className="h-36 gap-0 overflow-hidden rounded-xl border-neutral-700 bg-neutral-800 p-0 transition-all duration-200 hover:-translate-y-0.5 hover:border-neutral-500 hover:shadow-md">
                    <CardHeader
                      className={`h-[75%] border-b border-neutral-700 p-0 bg-cover bg-center ${!board.image_url ? (board.color || "bg-neutral-600") : ""}`}
                      style={board.image_url ? { backgroundImage: `url(${board.image_url})` } : undefined}
                    />
                    <CardContent className="flex h-[25%] items-center justify-between gap-3 p-3">
                      <CardTitle className="line-clamp-2 text-sm font-semibold tracking-tight text-neutral-200">
                        {board.title}
                      </CardTitle>
                      <div className="shrink-0 text-right text-[10px] leading-tight text-neutral-500">
                        <p>Created: {new Date(board.created_at).toLocaleDateString()}</p>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              </div>
            ))}

            {/* Create New Board Trigger Card */}
            <button
              onClick={() => setIsCreating(true)}
              className="h-36 overflow-hidden rounded-xl border border-dashed border-neutral-600 bg-neutral-800/50 p-0 transition-all duration-200 hover:border-neutral-500 hover:bg-neutral-800 flex flex-col items-center justify-center gap-2 text-neutral-400 hover:text-white"
            >
              <Plus className="w-8 h-8" />
              <span className="font-medium text-sm">Create New Board</span>
            </button>
          </div>
        )}

      </main>

      <Dialog open={isCreating} onOpenChange={(open) => {
        setIsCreating(open);
        if (!open) {
          setTitleError(false);
          setNewTitle("");
        }
      }}>
        <DialogContent className="rounded-2xl border border-neutral-700 bg-neutral-900 p-0 shadow-xl sm:max-w-[400px] text-white">
          <DialogHeader className="border-b border-neutral-700 px-4 py-3 relative">
            <DialogTitle className="text-sm font-semibold tracking-tight text-center text-neutral-100">
              Create board
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleCreateBoard} className="p-4 space-y-4">
            {/* Live Preview Area */}
            <div className="flex justify-center mb-6">
              <div
                className={`w-[200px] h-[120px] rounded-lg shadow-inner relative flex items-center justify-center p-2 gap-1.5 bg-cover bg-center ${!newImage ? newColor : ""}`}
                style={newImage ? { backgroundImage: `url(${newImage})` } : undefined}
              >
                {/* Mock board content */}
                <div className="h-full w-1/3 bg-black/20 rounded-[4px] border border-white/20 p-1 flex flex-col gap-1">
                  <div className="w-full h-2 bg-white/40 rounded-[2px]" />
                  <div className="w-full h-3 bg-white/90 rounded-[2px]" />
                  <div className="w-full h-6 bg-white/90 rounded-[2px]" />
                  <div className="w-full h-3 bg-white/90 rounded-[2px]" />
                </div>
                <div className="h-full w-1/3 bg-black/20 rounded-[4px] border border-white/20 p-1 flex flex-col gap-1">
                  <div className="w-full h-2 bg-white/40 rounded-[2px]" />
                  <div className="w-full h-4 bg-white/90 rounded-[2px]" />
                  <div className="w-full h-3 bg-white/90 rounded-[2px]" />
                </div>
                <div className="h-full w-1/3 bg-black/20 rounded-[4px] border border-white/20 p-1 flex flex-col gap-1">
                  <div className="w-full h-2 bg-white/40 rounded-[2px]" />
                  <div className="w-full h-8 bg-white/90 rounded-[2px]" />
                </div>
              </div>
            </div>

            {/* Background Selection */}
            <div>
              <label className="text-xs font-semibold text-neutral-300 mb-2 block">Background</label>

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

            {/* Title Input */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-neutral-300">
                Board title <span className="text-red-500">*</span>
              </label>
              <Input
                value={newTitle}
                onChange={(e) => {
                  setNewTitle(e.target.value);
                  if (e.target.value.trim()) setTitleError(false);
                }}
                className={`h-9 bg-neutral-900 border ${titleError ? 'border-red-500 focus-visible:ring-red-500' : 'border-neutral-600 focus-visible:ring-blue-500'} text-sm text-white`}
              />
              {titleError && (
                <p className="text-xs text-red-400 flex items-center gap-1.5 mt-1">
                  👋 Board title is required
                </p>
              )}
            </div>

            <Button
              type="submit"
              className="w-full h-9 bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium transition-colors"
            >
              Create
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
