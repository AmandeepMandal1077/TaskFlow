import React from "react";
import { CardWithRelations } from "@/server/queries/card";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { CheckSquare, Clock, Users } from "lucide-react";
import { format } from "date-fns";

interface BoardCardProps {
  card: CardWithRelations;
  onClick?: () => void;
  onToggleComplete?: (cardId: string, isComplete: boolean) => void;
}

export function BoardCard({ card, onClick, onToggleComplete }: BoardCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: card.id });

  const styles = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    cursor: "grab",
  };

  const totalChecklistItems = card.checklists?.reduce((acc, c) => acc + c.items.length, 0) || 0;
  const completedChecklistItems = card.checklists?.reduce((acc, c) => acc + c.items.filter(i => i.is_checked).length, 0) || 0;

  return (
    <div ref={setNodeRef} style={styles} {...attributes} {...listeners}>
      <div 
        onClick={(e) => {
          if (!isDragging && onClick) {
            e.stopPropagation();
            onClick();
          }
        }}
        className="bg-neutral-700/80 hover:bg-neutral-700 px-3 py-2.5 rounded-lg cursor-pointer transition-all group relative flex flex-col gap-1.5 hover:ring-2 hover:ring-inset hover:ring-blue-500"
      >
        {card.labels && card.labels.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-0.5">
            {card.labels.map((label) => (
              <div 
                key={label.id} 
                className={`h-2 w-8 rounded-full ${label.color} opacity-80`}
                title={label.name}
              />
            ))}
          </div>
        )}

        <div className="flex items-start gap-2">
          <div className="mt-1.5 flex-shrink-0">
            <button 
              type="button"
              className="flex items-center justify-center p-[1px] rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              onClick={(e) => {
                e.stopPropagation();
                onToggleComplete?.(card.id, !card.is_complete);
              }}
            >
              <div 
                className={`w-2.5 h-2.5 rounded-full transition-colors ${
                  card.is_complete 
                    ? "bg-green-500" 
                    : "bg-transparent border border-neutral-500 group-hover:bg-neutral-500 hover:!bg-green-400"
                }`}
              />
            </button>
          </div>
          <span className="text-sm text-neutral-200 leading-snug wrap-break-words break-words">
            {card.title}
          </span>
        </div>

        <div className="flex items-center gap-2 mt-0.5 flex-wrap">
          {card.due_date && (
            <div className={`flex items-center gap-1 text-[11px] font-medium px-1.5 py-0.5 rounded ${
              card.is_complete 
                ? "bg-green-500/20 text-green-400" 
                : "bg-neutral-600/50 text-neutral-400"
            }`}>
              <Clock className="w-3 h-3" />
              <span>{format(new Date(card.due_date), "MMM d")}</span>
            </div>
          )}
          {totalChecklistItems > 0 && (
            <div className={`flex items-center gap-1 text-[11px] font-medium px-1.5 py-0.5 rounded ${
                completedChecklistItems === totalChecklistItems 
                  ? "bg-green-500/20 text-green-400" 
                  : "bg-neutral-600/50 text-neutral-400"
              }`}
            >
              <CheckSquare className="w-3 h-3" />
              <span>{completedChecklistItems}/{totalChecklistItems}</span>
            </div>
          )}
          {card.assignees && card.assignees.length > 0 && (
            <div className="flex items-center gap-1 text-[11px] font-medium px-1.5 py-0.5 rounded bg-neutral-600/50 text-neutral-400">
              <Users className="w-3 h-3" />
              <span>{card.assignees.length}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export function BoardCardOverlay({ card }: BoardCardProps) {
  const totalChecklistItems = card.checklists?.reduce((acc, c) => acc + c.items.length, 0) || 0;
  const completedChecklistItems = card.checklists?.reduce((acc, c) => acc + c.items.filter(i => i.is_checked).length, 0) || 0;

  return (
    <div className="bg-neutral-700/80 hover:bg-neutral-700 px-3 py-2.5 rounded-lg cursor-pointer transition-all group relative flex flex-col gap-1.5 hover:ring-2 hover:ring-inset hover:ring-blue-500">
        {card.labels && card.labels.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-0.5">
            {card.labels.map((label) => (
              <div 
                key={label.id} 
                className={`h-2 w-8 rounded-full ${label.color} opacity-80`}
                title={label.name}
              />
            ))}
          </div>
        )}

        <div className="flex items-start gap-2">
          <div className="mt-1.5 flex-shrink-0">
            <div 
              className={`w-2.5 h-2.5 rounded-full transition-colors ${
                card.is_complete 
                  ? "bg-green-500" 
                  : "bg-transparent border border-neutral-500 group-hover:bg-neutral-500"
              }`}
            />
          </div>
          <span className="text-sm text-neutral-200 leading-snug wrap-break-words break-words">
            {card.title}
          </span>
        </div>

        <div className="flex items-center gap-2 mt-0.5 flex-wrap">
          {card.due_date && (
            <div className={`flex items-center gap-1 text-[11px] font-medium px-1.5 py-0.5 rounded ${
              card.is_complete 
                ? "bg-green-500/20 text-green-400" 
                : "bg-neutral-600/50 text-neutral-400"
            }`}>
              <Clock className="w-3 h-3" />
              <span>{format(new Date(card.due_date), "MMM d")}</span>
            </div>
          )}
          {totalChecklistItems > 0 && (
            <div className={`flex items-center gap-1 text-[11px] font-medium px-1.5 py-0.5 rounded ${
                completedChecklistItems === totalChecklistItems 
                  ? "bg-green-500/20 text-green-400" 
                  : "bg-neutral-600/50 text-neutral-400"
              }`}
            >
              <CheckSquare className="w-3 h-3" />
              <span>{completedChecklistItems}/{totalChecklistItems}</span>
            </div>
          )}
          {card.assignees && card.assignees.length > 0 && (
            <div className="flex items-center gap-1 text-[11px] font-medium px-1.5 py-0.5 rounded bg-neutral-600/50 text-neutral-400">
              <Users className="w-3 h-3" />
              <span>{card.assignees.length}</span>
            </div>
          )}
        </div>
    </div>
  );
}
