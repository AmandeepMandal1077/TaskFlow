"use client";

import { useState } from "react";
import { Navbar } from "@/components/navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useBoards } from "@/lib/hooks/useBoards";
import { Loader, Plus, X } from "lucide-react";
import Link from "next/link";

const COLORS = [
  "bg-red-500",
  "bg-blue-500",
  "bg-green-500",
  "bg-yellow-500",
  "bg-purple-500",
  "bg-pink-500",
  "bg-teal-500",
  "bg-orange-500",
];

export default function Dashboard() {
  const currentUserName = "Amandeep Mandal";
  const { createBoard, boards, loading, error } = useBoards();
  
  const [isCreating, setIsCreating] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newColor, setNewColor] = useState(COLORS[1]);

  const handleCreateBoard = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    
    await createBoard({ title: newTitle.trim(), color: newColor });
    setNewTitle("");
    setNewColor(COLORS[1]);
    setIsCreating(false);
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
        <div className="mb-6">
          <h1 className="text-2xl font-bold tracking-tight text-white">Your Boards</h1>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {boards.map((board) => (
            <div key={board.id} className="group">
              <Link href={`/board/${board.id}`}>
                <Card className="h-52 gap-0 overflow-hidden rounded-xl border-neutral-700 bg-neutral-800 p-0 transition-all duration-200 hover:-translate-y-0.5 hover:border-neutral-500 hover:shadow-md">
                  <CardHeader
                    className={`h-[75%] border-b border-neutral-700 p-0 ${
                      board.color || "bg-neutral-600"
                    }`}
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

          {/* Create New Board Card */}
          <Card className="h-52 overflow-hidden rounded-xl border border-dashed border-neutral-600 bg-neutral-800/50 p-0 transition-all duration-200 hover:border-neutral-500 hover:bg-neutral-800 flex flex-col justify-center relative">
            {isCreating ? (
              <form onSubmit={handleCreateBoard} className="h-full w-full flex flex-col p-4 bg-neutral-800">
                <div className="flex justify-between items-center mb-3">
                  <span className="font-semibold text-sm text-neutral-200">New Board</span>
                  <button type="button" onClick={() => setIsCreating(false)} className="text-neutral-400 hover:text-white">
                    <X className="w-4 h-4" />
                  </button>
                </div>
                <Input
                  autoFocus
                  placeholder="Board title..."
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="bg-neutral-700 border-neutral-600 text-white h-9 mb-3"
                  required
                />
                <div className="flex flex-wrap gap-1.5 mb-auto">
                  {COLORS.map((c) => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => setNewColor(c)}
                      className={`w-5 h-5 rounded-sm ${c} ${newColor === c ? 'ring-2 ring-white ring-offset-1 ring-offset-neutral-800' : ''}`}
                    />
                  ))}
                </div>
                <Button type="submit" className="w-full h-8 text-xs bg-blue-600 hover:bg-blue-700 text-white mt-3">
                  Create
                </Button>
              </form>
            ) : (
              <button 
                onClick={() => setIsCreating(true)}
                className="w-full h-full flex flex-col items-center justify-center gap-2 text-neutral-400 hover:text-white transition-colors"
              >
                <Plus className="w-8 h-8" />
                <span className="font-medium text-sm">Create New Board</span>
              </button>
            )}
          </Card>
        </div>
      </main>
    </div>
  );
}
