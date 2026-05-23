"use client";

import React, { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Search, X, Tag, Users, CalendarClock } from "lucide-react";
import { getAllLabels } from "@/lib/api/label";
import { getAllUsers } from "@/lib/api/user";
import type { Label, User } from "@/generated/prisma/client";
import type { CardFilters, DueDateFilter } from "@/lib/hooks/useCardFilters";

interface CardFilterPanelProps {
  filters: CardFilters;
  onSearchChange: (query: string) => void;
  onToggleLabel: (labelId: string) => void;
  onToggleMember: (memberId: string) => void;
  onToggleDueDate: (filter: DueDateFilter) => void;
  onClearAll: () => void;
  isAnyFilterActive: boolean;
}

const DUE_DATE_OPTIONS: { value: DueDateFilter; label: string }[] = [
  { value: "no-date", label: "No dates" },
  { value: "overdue", label: "Overdue" },
  { value: "due-next-day", label: "Due in the next day" },
  { value: "due-next-week", label: "Due in the next week" },
  { value: "due-next-month", label: "Due in the next month" },
];

export function CardFilterPanel({
  filters,
  onSearchChange,
  onToggleLabel,
  onToggleMember,
  onToggleDueDate,
  onClearAll,
  isAnyFilterActive,
}: CardFilterPanelProps) {
  const [labels, setLabels] = useState<Label[]>([]);
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    getAllLabels().then(setLabels).catch(console.error);
    getAllUsers().then(setUsers).catch(console.error);
  }, []);

  return (
    <div className="w-80 rounded-xl border border-neutral-700 bg-neutral-900 shadow-2xl animate-in fade-in slide-in-from-top-2 duration-200">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-neutral-700 px-4 py-3">
        <h3 className="text-sm font-semibold text-neutral-100">Filters</h3>
        {isAnyFilterActive && (
          <button
            onClick={onClearAll}
            className="text-xs font-medium text-blue-400 hover:text-blue-300 transition-colors"
          >
            Clear all
          </button>
        )}
      </div>

      <div className="max-h-[380px] overflow-y-auto overflow-x-hidden rounded-b-xl">
        <div className="space-y-1 p-3">
          {/* Card Search */}
          <div className="relative">
            <Search className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-neutral-500" />
            <Input
              placeholder="Search cards..."
              value={filters.searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="h-8 rounded-lg border-neutral-600 bg-neutral-700 pl-8 text-xs text-white placeholder:text-neutral-400 focus-visible:ring-1 focus-visible:ring-neutral-500"
            />
            {filters.searchQuery && (
              <button
                onClick={() => onSearchChange("")}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-white transition-colors"
              >
                <X className="h-3 w-3" />
              </button>
            )}
          </div>

          {/* Labels Section */}
          <div>
            <div className="flex items-center gap-1.5 px-1 py-2">
              <Tag className="h-3.5 w-3.5 text-neutral-400" />
              <span className="text-xs font-semibold text-neutral-300 uppercase tracking-wider">
                Labels
              </span>
            </div>
            <div className="space-y-0.5">
              {labels.map((label) => (
                <div
                  key={label.id}
                  role="button"
                  tabIndex={0}
                  onClick={() => onToggleLabel(label.id)}
                  onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); onToggleLabel(label.id); } }}
                  className={`flex w-full items-center gap-2.5 rounded-lg px-2 py-1.5 text-left transition-colors cursor-pointer ${
                    filters.labelIds.includes(label.id)
                      ? "bg-neutral-700"
                      : "hover:bg-neutral-700/50"
                  }`}
                >
                  <Checkbox
                    checked={filters.labelIds.includes(label.id)}
                    className="h-3.5 w-3.5 rounded border-neutral-500 data-[state=checked]:border-blue-500 data-[state=checked]:bg-blue-500 pointer-events-none"
                    tabIndex={-1}
                  />
                  <div
                    className={`h-3 w-3 rounded-full ${label.color} shrink-0`}
                  />
                  <span className="text-xs text-neutral-200 truncate">
                    {label.name}
                  </span>
                </div>
              ))}
              {labels.length === 0 && (
                <p className="px-2 py-1.5 text-xs text-neutral-500">
                  No labels available
                </p>
              )}
            </div>
          </div>

          {/* Members Section */}
          <div>
            <div className="flex items-center gap-1.5 px-1 py-2">
              <Users className="h-3.5 w-3.5 text-neutral-400" />
              <span className="text-xs font-semibold text-neutral-300 uppercase tracking-wider">
                Members
              </span>
            </div>
            <div className="space-y-0.5">
              {users.map((user) => (
                <div
                  key={user.id}
                  role="button"
                  tabIndex={0}
                  onClick={() => onToggleMember(user.id)}
                  onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); onToggleMember(user.id); } }}
                  className={`flex w-full items-center gap-2.5 rounded-lg px-2 py-1.5 text-left transition-colors cursor-pointer ${
                    filters.memberIds.includes(user.id)
                      ? "bg-neutral-700"
                      : "hover:bg-neutral-700/50"
                  }`}
                >
                  <Checkbox
                    checked={filters.memberIds.includes(user.id)}
                    className="h-3.5 w-3.5 rounded border-neutral-500 data-[state=checked]:border-blue-500 data-[state=checked]:bg-blue-500 pointer-events-none"
                    tabIndex={-1}
                  />
                  <span className="text-xs text-neutral-200 truncate">
                    {user.name}
                  </span>
                </div>
              ))}
              {users.length === 0 && (
                <p className="px-2 py-1.5 text-xs text-neutral-500">
                  No members available
                </p>
              )}
            </div>
          </div>

          {/* Due Date Section */}
          <div>
            <div className="flex items-center gap-1.5 px-1 py-2">
              <CalendarClock className="h-3.5 w-3.5 text-neutral-400" />
              <span className="text-xs font-semibold text-neutral-300 uppercase tracking-wider">
                Due Date
              </span>
            </div>
            <div className="space-y-0.5">
              {DUE_DATE_OPTIONS.map((opt) => (
                <div
                  key={opt.value}
                  role="button"
                  tabIndex={0}
                  onClick={() => onToggleDueDate(opt.value)}
                  onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); onToggleDueDate(opt.value); } }}
                  className={`flex w-full items-center gap-2.5 rounded-lg px-2 py-1.5 text-left transition-colors cursor-pointer ${
                    filters.dueDateFilters.includes(opt.value)
                      ? "bg-neutral-700"
                      : "hover:bg-neutral-700/50"
                  }`}
                >
                  <Checkbox
                    checked={filters.dueDateFilters.includes(opt.value)}
                    className="h-3.5 w-3.5 rounded border-neutral-500 data-[state=checked]:border-blue-500 data-[state=checked]:bg-blue-500 pointer-events-none"
                    tabIndex={-1}
                  />
                  <span className="text-xs text-neutral-200">
                    {opt.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
