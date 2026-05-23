"use client";

import { ArrowLeft, Filter, MoreHorizontal } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "./ui/button";

type NavbarProps = {
  username: string;
  boardTitle?: string;
  boardColor?: string;
  onEditBoard?: () => void;
  onFilterClick?: () => void;
  filterCount?: number;
};

export const Navbar = ({
  username,
  boardTitle,
  boardColor,
  onEditBoard,
  onFilterClick,
  filterCount,
}: NavbarProps) => {
  const path = usePathname();

  const isBoardPage = path.startsWith("/board/");

  if (isBoardPage) {
    return (
      <header className="sticky top-0 z-50 border-b border-neutral-700/80 bg-neutral-900/90 backdrop-blur">
        <div className="mx-auto flex h-16 w-full items-center gap-4 px-4 sm:px-4 lg:px-6">
          <div className="flex min-w-0 items-center gap-3">
            <Link
              href="/dashboard"
              className="flex items-center gap-2 text-sm font-medium text-neutral-400 hover:text-neutral-200 transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Back to Dashboard</span>
            </Link>
            <span className="text-neutral-600">|</span>
            <div className="min-w-0">
              <div className="truncate text-lg font-semibold tracking-[0.2em] text-white">
                {boardTitle}
              </div>
            </div>
          </div>
          {onEditBoard && (
            <Button
              onClick={onEditBoard}
              variant="outline"
              className="h-9 w-9 rounded-full border-neutral-600 bg-neutral-800 p-0 text-neutral-300 hover:bg-neutral-700 hover:text-white"
              aria-label="Edit board"
            >
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          )}

          <div className="ml-auto flex shrink-0 items-center gap-3">
            {onFilterClick && (
              <Button
                type="button"
                variant="outline"
                onClick={onFilterClick}
                className="h-9 rounded-full border-neutral-600 bg-neutral-800 px-3.5 text-sm font-medium text-neutral-300 hover:bg-neutral-700 hover:text-white"
              >
                <Filter className="mr-2 h-4 w-4" />
                <span>Filter</span>
                {filterCount && filterCount > 0 && (
                  <span className="ml-2 inline-flex min-w-5 items-center justify-center rounded-full bg-blue-600 px-1.5 py-0.5 text-[11px] font-semibold leading-none text-white">
                    {filterCount}
                  </span>
                )}
              </Button>
            )}
            <span className="text-sm font-medium text-neutral-300">
              {username}
            </span>
          </div>
        </div>
      </header>
    );
  }
  return (
    <header className="sticky top-0 z-50 border-b border-neutral-700/80 bg-neutral-900/90 backdrop-blur">
      <div className="mx-auto flex h-16 w-full max-w-5/6 items-center justify-between px-4 sm:px-4 lg:px-6">
        <div className="text-lg font-semibold tracking-[0.2em] text-white">
          TASKFLOW
        </div>
        <div className="text-sm font-medium text-neutral-300">{username}</div>
      </div>
    </header>
  );
};
