"use client";

import { useState, useCallback, useMemo } from "react";
import type { CardWithRelations } from "@/lib/api/types";
import { useDebounce } from "./useDebounce";
import {
  isAfter,
  isBefore,
  addDays,
  addWeeks,
  addMonths,
  startOfDay,
  endOfDay,
} from "date-fns";

export type DueDateFilter =
  | "no-date"
  | "overdue"
  | "due-next-day"
  | "due-next-week"
  | "due-next-month";

export interface CardFilters {
  searchQuery: string;
  labelIds: string[];
  memberIds: string[];
  dueDateFilters: DueDateFilter[];
}

const INITIAL_FILTERS: CardFilters = {
  searchQuery: "",
  labelIds: [],
  memberIds: [],
  dueDateFilters: [],
};

export function useCardFilters() {
  const [filters, setFilters] = useState<CardFilters>(INITIAL_FILTERS);
  const debouncedSearch = useDebounce(filters.searchQuery, 300);

  const setSearchQuery = useCallback((query: string) => {
    setFilters((prev) => ({ ...prev, searchQuery: query }));
  }, []);

  const toggleLabel = useCallback((labelId: string) => {
    setFilters((prev) => ({
      ...prev,
      labelIds: prev.labelIds.includes(labelId)
        ? prev.labelIds.filter((id) => id !== labelId)
        : [...prev.labelIds, labelId],
    }));
  }, []);

  const toggleMember = useCallback((memberId: string) => {
    setFilters((prev) => ({
      ...prev,
      memberIds: prev.memberIds.includes(memberId)
        ? prev.memberIds.filter((id) => id !== memberId)
        : [...prev.memberIds, memberId],
    }));
  }, []);

  const toggleDueDate = useCallback((filter: DueDateFilter) => {
    setFilters((prev) => ({
      ...prev,
      dueDateFilters: prev.dueDateFilters.includes(filter)
        ? prev.dueDateFilters.filter((f) => f !== filter)
        : [...prev.dueDateFilters, filter],
    }));
  }, []);

  const clearAll = useCallback(() => {
    setFilters(INITIAL_FILTERS);
  }, []);

  const isAnyFilterActive = useMemo(() => {
    return (
      debouncedSearch.trim() !== "" ||
      filters.labelIds.length > 0 ||
      filters.memberIds.length > 0 ||
      filters.dueDateFilters.length > 0
    );
  }, [debouncedSearch, filters.labelIds, filters.memberIds, filters.dueDateFilters]);

  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (debouncedSearch.trim() !== "") count++;
    if (filters.labelIds.length > 0) count++;
    if (filters.memberIds.length > 0) count++;
    if (filters.dueDateFilters.length > 0) count++;
    return count;
  }, [debouncedSearch, filters.labelIds, filters.memberIds, filters.dueDateFilters]);

  const filterCards = useCallback(
    (cards: CardWithRelations[]): CardWithRelations[] => {
      if (!isAnyFilterActive) return cards;

      return cards.filter((card) => {
        // Search filter (AND with others)
        if (debouncedSearch.trim() !== "") {
          const q = debouncedSearch.toLowerCase().trim();
          if (!card.title.toLowerCase().includes(q)) {
            return false;
          }
        }

        // Label filter — card must have at least one selected label (OR within)
        if (filters.labelIds.length > 0) {
          const cardLabelIds = card.labels?.map((l) => l.id) || [];
          if (!filters.labelIds.some((id) => cardLabelIds.includes(id))) {
            return false;
          }
        }

        // Member filter — card must have at least one selected member (OR within)
        if (filters.memberIds.length > 0) {
          const cardMemberIds = card.assignees?.map((a) => a.id) || [];
          if (!filters.memberIds.some((id) => cardMemberIds.includes(id))) {
            return false;
          }
        }

        // Due date filter — card must match at least one selected option (OR within)
        if (filters.dueDateFilters.length > 0) {
          const now = new Date();
          const todayStart = startOfDay(now);

          const matchesDueDate = filters.dueDateFilters.some((f) => {
            switch (f) {
              case "no-date":
                return !card.due_date;
              case "overdue":
                return card.due_date && isBefore(new Date(card.due_date), todayStart);
              case "due-next-day":
                return (
                  card.due_date &&
                  !isBefore(new Date(card.due_date), todayStart) &&
                  isBefore(new Date(card.due_date), endOfDay(addDays(now, 1)))
                );
              case "due-next-week":
                return (
                  card.due_date &&
                  !isBefore(new Date(card.due_date), todayStart) &&
                  isBefore(new Date(card.due_date), endOfDay(addWeeks(now, 1)))
                );
              case "due-next-month":
                return (
                  card.due_date &&
                  !isBefore(new Date(card.due_date), todayStart) &&
                  isBefore(new Date(card.due_date), endOfDay(addMonths(now, 1)))
                );
              default:
                return true;
            }
          });

          if (!matchesDueDate) return false;
        }

        return true;
      });
    },
    [debouncedSearch, filters.labelIds, filters.memberIds, filters.dueDateFilters, isAnyFilterActive],
  );

  return {
    filters,
    setSearchQuery,
    toggleLabel,
    toggleMember,
    toggleDueDate,
    clearAll,
    filterCards,
    activeFilterCount,
    isAnyFilterActive,
  };
}
