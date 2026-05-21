"use client";

import { Navbar } from "@/components/navbar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useBoards } from "@/lib/hooks/useBoards";
import { Loader, Plus, Search } from "lucide-react";
import Link from "next/link";

export default function Dashboard() {
  const currentUserName = "Amandeep Mandal";
  const { createBoard, boards, loading, error } = useBoards();

  const handleCreateBoard = async () => {
    await createBoard({ title: "Testing" });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-neutral-100 text-black">
        <Navbar username={currentUserName} />
        <div className="mx-auto flex w-full max-w-7xl items-center justify-center px-4 py-16 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3 rounded-2xl border border-neutral-300 bg-white px-5 py-4 shadow-sm">
            <Loader className="h-5 w-5 animate-spin text-black" />
            <span className="text-sm font-medium text-neutral-700">
              Loading your boards...
            </span>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-neutral-100 text-black">
        <Navbar username={currentUserName} />
        <div className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
          <div className="rounded-2xl border border-neutral-300 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold">Error loading boards</h2>
            <p className="mt-2 text-sm text-neutral-600">Error: {error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-100 text-black">
      <Navbar username={currentUserName} />

      <main className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="mb-6 flex flex-col gap-4 rounded-2xl border border-neutral-300 bg-white p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between sm:p-5">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">Boards</h1>
            <p className="mt-1 text-sm text-neutral-600">
              Manage projects and tasks
            </p>
          </div>
          <Button
            onClick={handleCreateBoard}
            className="h-10 rounded-xl border border-black bg-black px-4 text-sm font-medium text-white hover:bg-neutral-800"
          >
            <Plus className="mr-2 h-4 w-4" />
            Create New Board
          </Button>
        </div>

        <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <Card className="rounded-2xl border-neutral-300 bg-white shadow-sm">
            <CardContent className="p-5">
              <div className="flex items-end justify-between gap-4">
                <div>
                  <p className="text-xs font-medium uppercase tracking-wide text-neutral-500">
                    Total boards
                  </p>
                  <p className="mt-2 text-3xl font-semibold leading-none">
                    {boards.length}
                  </p>
                </div>
                <Badge className="rounded-full border border-neutral-300 bg-neutral-100 px-3 py-1 text-xs font-medium text-neutral-700">
                  Workspace
                </Badge>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="mb-4 flex items-center justify-between gap-3">
          <h2 className="text-lg font-semibold">Your boards</h2>
        </div>

        <div className="relative mb-6">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-500" />
          <Input
            id="search"
            placeholder="Search boards..."
            className="h-11 rounded-xl border-neutral-300 bg-white pl-10 text-sm placeholder:text-neutral-400 focus-visible:ring-1 focus-visible:ring-black"
          />
        </div>

        {!boards || boards.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-neutral-300 bg-white px-6 py-12 text-center shadow-sm">
            <p className="text-sm text-neutral-600">
              No boards found. Create your first board.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {boards.map((board) => (
              <div key={board.id} className="group">
                <Link href={`/board/${board.id}`}>
                  <Card className="h-64 overflow-hidden rounded-2xl border-neutral-300 bg-white transition-all duration-200 hover:-translate-y-0.5 hover:border-black hover:shadow-md">
                    <CardHeader
                      className="h-[80%] border-b border-neutral-200 p-0"
                      style={{ backgroundColor: board.color || "#e5e5e5" }}
                    />
                    <CardContent className="flex h-[20%] items-center justify-between gap-3 p-3">
                      <CardTitle className="line-clamp-2 text-sm font-semibold tracking-tight">
                        {board.title}
                      </CardTitle>
                      <div className="shrink-0 text-right text-[10px] leading-tight text-neutral-600">
                        <p>
                          Created at:{" "}
                          {new Date(board.created_at).toLocaleDateString()}
                        </p>
                        <p>
                          Updated at:{" "}
                          {new Date(board.updated_at).toLocaleDateString()}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
