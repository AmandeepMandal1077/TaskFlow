import React from "react";
import { Card } from "@/generated/prisma/browser";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

interface BoardCardProps {
  card: Card;
}

export function BoardCard({ card }: BoardCardProps) {
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
  return (
    <div ref={setNodeRef} style={styles} {...attributes} {...listeners}>
      <div className="bg-neutral-700/80 hover:bg-neutral-700 px-3 py-2 rounded-lg cursor-pointer transition-colors group relative">
        <span className="text-sm text-neutral-200 leading-snug wrap-break-words">
          {card.title}
        </span>
      </div>
    </div>
  );
}

export function BoardCardOverlay({ card }: BoardCardProps) {
  return (
    <div className="bg-neutral-700/80 hover:bg-neutral-700 px-3 py-2 rounded-lg cursor-pointer transition-colors group relative">
      <span className="text-sm text-neutral-200 leading-snug wrap-break-words">
        {card.title}
      </span>
    </div>
  );
}
