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
      <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/90 backdrop-blur">
        <div className="mx-auto flex h-16 w-full max-w-5/6 items-center gap-4 px-4 sm:px-4 lg:px-6">
          <div className="flex min-w-0 items-center gap-3">
            <Link
              href="/dashboard"
              className="flex items-center gap-2 text-sm font-medium text-slate-600"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Back to Dashboard</span>
            </Link>
            <span className="text-slate-300">|</span>
            <div className="min-w-0">
              <div className="truncate text-lg font-semibold tracking-[0.2em] text-slate-900">
                {boardTitle}
              </div>
              <div
                className={`mt-1 h-1 w-full rounded-full ${boardColor || "bg-slate-300"}`}
              />
            </div>
          </div>
          {onEditBoard && (
            <Button
              onClick={onEditBoard}
              variant="outline"
              className="h-9 w-9 rounded-full border-slate-300 bg-white p-0 text-slate-700 hover:bg-slate-100 hover:text-slate-900"
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
                className="h-9 rounded-full border-slate-300 bg-white px-3.5 text-sm font-medium text-slate-700 hover:bg-slate-100 hover:text-slate-900"
              >
                <Filter className="mr-2 h-4 w-4" />
                <span>Filter</span>
                {filterCount && filterCount > 0 && (
                  <span className="ml-2 inline-flex min-w-5 items-center justify-center rounded-full bg-slate-900 px-1.5 py-0.5 text-[11px] font-semibold leading-none text-white">
                    {filterCount}
                  </span>
                )}
              </Button>
            )}
            <span className="text-sm font-medium text-slate-600">
              {username}
            </span>
          </div>
        </div>
      </header>
    );
  }
  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/90 backdrop-blur">
      <div className="mx-auto flex h-16 w-full max-w-5/6 items-center justify-between px-4 sm:px-4 lg:px-6">
        <div className="text-lg font-semibold tracking-[0.2em] text-slate-900">
          TASKFLOW
        </div>
        <div className="text-sm font-medium text-slate-600">{username}</div>
      </div>
    </header>
  );
};
