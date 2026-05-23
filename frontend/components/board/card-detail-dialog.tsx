import React, { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Progress } from "@/components/ui/progress";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  CheckCircle2,
  Circle,
  Calendar as CalendarIcon,
  CheckSquare,
  Users,
  Trash2,
  AlignLeft,
  Tag,
  X,
} from "lucide-react";
import { format } from "date-fns";
import type { CardWithRelations } from "@/lib/api/types";
import { ListWithCards } from "@/lib/hooks/useBoards";
import {
  updateCard,
  deleteCard,
  addLabelToCard,
  removeLabelFromCard,
  createChecklist,
  deleteChecklist,
  createChecklistItem,
  toggleChecklistItem,
  deleteChecklistItem,
  addAssigneeToCard,
  removeAssigneeFromCard,
} from "@/lib/api/card";
import { getAllLabels, createLabel } from "@/lib/api/label";
import { getAllUsers } from "@/lib/api/user";

interface CardDetailDialogProps {
  card: CardWithRelations | null;
  isOpen: boolean;
  onClose: () => void;
  lists: ListWithCards[];
  setLists: React.Dispatch<React.SetStateAction<ListWithCards[]>>;
}

export function CardDetailDialog({
  card,
  isOpen,
  onClose,
  lists,
  setLists,
}: CardDetailDialogProps) {
  type LabelRecord = Awaited<ReturnType<typeof getAllLabels>>[number];
  type UserRecord = Awaited<ReturnType<typeof getAllUsers>>[number];

  const [allLabels, setAllLabels] = useState<LabelRecord[]>([]);
  const [allUsers, setAllUsers] = useState<UserRecord[]>([]);
  const [isEditingDesc, setIsEditingDesc] = useState(false);
  const [descValue, setDescValue] = useState("");
  const [newChecklistTitle, setNewChecklistTitle] = useState("");
  const [isAddingChecklist, setIsAddingChecklist] = useState(false);
  const [newItemTitles, setNewItemTitles] = useState<Record<string, string>>(
    {},
  );

  const [isCreatingLabel, setIsCreatingLabel] = useState(false);
  const [newLabelName, setNewLabelName] = useState("");
  const [newLabelColor, setNewLabelColor] = useState("bg-blue-500");

  async function loadLabels() {
    const labels = await getAllLabels();
    setAllLabels(labels);
    const users = await getAllUsers();
    setAllUsers(users);
  }

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const timer = window.setTimeout(() => {
      void loadLabels();
    }, 0);

    return () => window.clearTimeout(timer);
  }, [isOpen]);

  if (!card) return null;

  const updateCardLocally = (
    updater: (c: CardWithRelations) => CardWithRelations,
  ) => {
    setLists((prev) =>
      prev.map((l) => ({
        ...l,
        cards: l.cards.map((c) => (c.id === card.id ? updater(c) : c)),
      })),
    );
  };

  const handleToggleComplete = async () => {
    const newValue = !card.is_complete;
    updateCardLocally((c) => ({ ...c, is_complete: newValue }));
    await updateCard(card.id, { is_complete: newValue });
  };

  const handleUpdateDesc = async () => {
    updateCardLocally((c) => ({ ...c, description: descValue }));
    setIsEditingDesc(false);
    await updateCard(card.id, { description: descValue });
  };

  const handleDateSelect = async (date: Date | undefined) => {
    if (!date) return;
    updateCardLocally((c) => ({ ...c, due_date: date }));
    await updateCard(card.id, { due_date: date });
  };

  const handleToggleLabel = async (label: LabelRecord) => {
    const hasLabel = card.labels.some((l) => l.id === label.id);
    if (hasLabel) {
      updateCardLocally((c) => ({
        ...c,
        labels: c.labels.filter((l) => l.id !== label.id),
      }));
      await removeLabelFromCard(card.id, label.id);
    } else {
      updateCardLocally((c) => ({ ...c, labels: [...c.labels, label] }));
      await addLabelToCard(card.id, label.id);
    }
  };

  const handleAddChecklist = async () => {
    if (!newChecklistTitle.trim()) return;
    const tempId = "temp-" + Date.now();
    const newTitle = newChecklistTitle.trim();

    updateCardLocally((c) => ({
      ...c,
      checklists: [
        ...c.checklists,
        { id: tempId, title: newTitle, card_id: c.id, items: [] },
      ],
    }));
    setNewChecklistTitle("");
    setIsAddingChecklist(false);

    const actualChecklist = await createChecklist(card.id, newTitle);
    updateCardLocally((c) => ({
      ...c,
      checklists: c.checklists.map((cl) =>
        cl.id === tempId ? actualChecklist : cl,
      ),
    }));
  };

  const handleDeleteChecklist = async (checklistId: string) => {
    updateCardLocally((c) => ({
      ...c,
      checklists: c.checklists.filter((cl) => cl.id !== checklistId),
    }));
    if (!checklistId.startsWith("temp-")) {
      await deleteChecklist(checklistId);
    }
  };

  const handleAddChecklistItem = async (checklistId: string) => {
    const title = newItemTitles[checklistId]?.trim();
    if (!title) return;

    const tempId = "temp-item-" + Date.now();
    updateCardLocally((c) => ({
      ...c,
      checklists: c.checklists.map((cl) =>
        cl.id === checklistId
          ? {
              ...cl,
              items: [
                ...cl.items,
                { id: tempId, title, is_checked: false, checklist_id: cl.id },
              ],
            }
          : cl,
      ),
    }));
    setNewItemTitles((prev) => ({ ...prev, [checklistId]: "" }));

    const actualItem = await createChecklistItem(checklistId, title);
    updateCardLocally((c) => ({
      ...c,
      checklists: c.checklists.map((cl) =>
        cl.id === checklistId
          ? {
              ...cl,
              items: cl.items.map((i) => (i.id === tempId ? actualItem : i)),
            }
          : cl,
      ),
    }));
  };

  const handleToggleChecklistItem = async (
    itemId: string,
    isChecked: boolean,
  ) => {
    updateCardLocally((c) => ({
      ...c,
      checklists: c.checklists.map((cl) => ({
        ...cl,
        items: cl.items.map((i) =>
          i.id === itemId ? { ...i, is_checked: isChecked } : i,
        ),
      })),
    }));
    if (!itemId.startsWith("temp-")) {
      await toggleChecklistItem(itemId, isChecked);
    }
  };

  const handleDeleteChecklistItemLocal = async (
    checklistId: string,
    itemId: string,
  ) => {
    updateCardLocally((c) => ({
      ...c,
      checklists: c.checklists.map((cl) =>
        cl.id === checklistId
          ? { ...cl, items: cl.items.filter((i) => i.id !== itemId) }
          : cl,
      ),
    }));
    if (!itemId.startsWith("temp-")) {
      await deleteChecklistItem(itemId);
    }
  };

  const handleCreateLabel = async () => {
    if (!newLabelName.trim()) return;
    const label = await createLabel(newLabelName.trim(), newLabelColor);
    setAllLabels((prev) => [...prev, label]);
    setNewLabelName("");
    setIsCreatingLabel(false);
    // Auto assign
    handleToggleLabel(label);
  };

  const handleToggleMember = async (user: UserRecord) => {
    const hasMember = card.assignees.some((u) => u.id === user.id);
    if (hasMember) {
      updateCardLocally((c) => ({
        ...c,
        assignees: c.assignees.filter((u) => u.id !== user.id),
      }));
      await removeAssigneeFromCard(card.id, user.id);
    } else {
      updateCardLocally((c) => ({ ...c, assignees: [...c.assignees, user] }));
      await addAssigneeToCard(card.id, user.id);
    }
  };

  const handleClearDueDate = async (e: React.MouseEvent) => {
    e.stopPropagation();
    updateCardLocally((c) => ({ ...c, due_date: null }));
    await updateCard(card.id, { due_date: null });
  };

  const handleDeleteCard = async () => {
    if (!confirm("Are you sure you want to delete this card?")) return;
    setLists((prev) =>
      prev.map((l) => ({
        ...l,
        cards: l.cards.filter((c) => c.id !== card.id),
      })),
    );
    onClose();
    await deleteCard(card.id);
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent
        style={{ width: "50vw", maxWidth: "none" }}
        className="max-h-[85vh] !top-16 !translate-y-0 overflow-hidden bg-neutral-900 text-neutral-200 border-neutral-700 p-0"
        showCloseButton={false}
      >
        <DialogTitle className="sr-only">
          Card Details: {card.title}
        </DialogTitle>

        <ScrollArea className="max-h-[85vh] w-full [&_[data-slot=scroll-area-thumb]]:bg-neutral-600">
          <div className="flex flex-col gap-6 p-6">
            {/* Header */}
            <div className="flex items-start gap-4">
            <button
              onClick={handleToggleComplete}
              className="mt-1 text-neutral-400 hover:text-green-500 transition-colors"
            >
              {card.is_complete ? (
                <CheckCircle2 className="w-6 h-6 text-green-500" />
              ) : (
                <Circle className="w-6 h-6" />
              )}
            </button>
            <div className="flex-1">
              <h2 className="text-xl font-bold text-white leading-tight">
                {card.title}
              </h2>
              <p className="text-xs text-neutral-400 mt-1">
                in list{" "}
                <span className="underline">
                  {lists.find((l) => l.id === card.list_id)?.title}
                </span>
              </p>
            </div>
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="icon"
                onClick={handleDeleteCard}
                className="text-neutral-400 hover:text-red-500 hover:bg-neutral-700 transition-colors h-8 w-8"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={onClose}
                className="text-neutral-400 hover:text-neutral-200 hover:bg-neutral-700 h-8 w-8"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Action Buttons Row */}
          <div className="flex flex-wrap gap-2">
            <Popover open={isCreatingLabel ? true : undefined}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="bg-neutral-700 hover:bg-neutral-600 border-neutral-600 text-neutral-200"
                >
                  <Tag className="w-4 h-4 mr-2" /> Labels
                </Button>
              </PopoverTrigger>
              <PopoverContent 
                className="w-72 bg-neutral-900 border-neutral-700 text-neutral-200"
                onWheelCapture={(e) => e.stopPropagation()}
              >
                <h4 className="font-semibold mb-2">
                  {isCreatingLabel ? "Create label" : "Labels"}
                </h4>
                {!isCreatingLabel ? (
                  <>
                    <ScrollArea className="h-80 pr-2 [&_[data-slot=scroll-area-thumb]]:bg-neutral-600">
                      <div className="space-y-2">
                        {allLabels.map((label) => (
                          <div
                            key={label.id}
                            className="flex items-center gap-2"
                          >
                            <Checkbox
                              checked={card.labels.some(
                                (l) => l.id === label.id,
                              )}
                              onCheckedChange={() => handleToggleLabel(label)}
                            />
                            <div
                              className={`flex-1 h-8 rounded px-3 flex items-center font-medium ${label.color}`}
                            >
                              {label.name}
                            </div>
                          </div>
                        ))}
                      </div>
                    </ScrollArea>
                    <Button
                      variant="secondary"
                      className="w-full mt-3 bg-neutral-700 hover:bg-neutral-600 text-neutral-200"
                      onClick={() => setIsCreatingLabel(true)}
                    >
                      Create a new label
                    </Button>
                  </>
                ) : (
                  <div className="space-y-3">
                    <Input
                      value={newLabelName}
                      onChange={(e) => setNewLabelName(e.target.value)}
                      placeholder="Label name..."
                      className="bg-neutral-700 border-neutral-600"
                      autoFocus
                    />
                    <div className="flex gap-2 flex-wrap">
                      {[
                        "bg-red-500",
                        "bg-blue-500",
                        "bg-green-500",
                        "bg-yellow-500",
                        "bg-purple-500",
                        "bg-teal-500",
                        "bg-orange-500",
                      ].map((color) => (
                        <button
                          key={color}
                          onClick={() => setNewLabelColor(color)}
                          className={`w-6 h-6 rounded ${color} ${newLabelColor === color ? "ring-2 ring-white" : ""}`}
                        />
                      ))}
                    </div>
                    <div className="flex gap-2">
                      <Button
                        className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
                        onClick={handleCreateLabel}
                      >
                        Create
                      </Button>
                      <Button
                        variant="ghost"
                        onClick={() => setIsCreatingLabel(false)}
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                )}
              </PopoverContent>
            </Popover>

            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="bg-neutral-700 hover:bg-neutral-600 border-neutral-600 text-neutral-200"
                >
                  <CalendarIcon className="w-4 h-4 mr-2" /> Dates
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0 bg-neutral-900 border-neutral-700">
                <Calendar
                  mode="single"
                  selected={card.due_date ? new Date(card.due_date) : undefined}
                  onSelect={handleDateSelect}
                  className="bg-neutral-900 text-neutral-200"
                />
              </PopoverContent>
            </Popover>

            <Popover
              open={isAddingChecklist}
              onOpenChange={setIsAddingChecklist}
            >
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="bg-neutral-700 hover:bg-neutral-600 border-neutral-600 text-neutral-200"
                >
                  <CheckSquare className="w-4 h-4 mr-2" /> Checklist
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-64 bg-neutral-900 border-neutral-700">
                <h4 className="font-semibold mb-2 text-neutral-200">
                  Add checklist
                </h4>
                <Input
                  autoFocus
                  placeholder="Checklist title..."
                  value={newChecklistTitle}
                  onChange={(e) => setNewChecklistTitle(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleAddChecklist()}
                  className="bg-neutral-700 border-neutral-600 mb-2 text-neutral-200"
                />
                <Button
                  onClick={handleAddChecklist}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                >
                  Add
                </Button>
              </PopoverContent>
            </Popover>

            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="bg-neutral-700 hover:bg-neutral-600 border-neutral-600 text-neutral-200"
                >
                  <Users className="w-4 h-4 mr-2" /> Members
                </Button>
              </PopoverTrigger>
              <PopoverContent 
                className="w-72 bg-neutral-900 border-neutral-700 text-neutral-200"
                onWheelCapture={(e) => e.stopPropagation()}
              >
                <h4 className="font-semibold mb-2">Members</h4>
                <ScrollArea className="h-80 pr-2 [&_[data-slot=scroll-area-thumb]]:bg-neutral-600">
                  <div className="space-y-2">
                    {allUsers.map((user) => (
                      <div
                        key={user.id}
                        className="flex items-center gap-2 cursor-pointer hover:bg-neutral-700 p-1.5 rounded"
                        onClick={() => handleToggleMember(user)}
                      >
                        <Checkbox
                          checked={card.assignees.some((u) => u.id === user.id)}
                          disabled
                        />
                        <div className="flex-1 flex flex-col">
                          <span className="text-sm font-medium leading-none">
                            {user.name}
                          </span>
                          <span className="text-xs text-neutral-400 mt-1">
                            {user.email}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </PopoverContent>
            </Popover>
          </div>

          <div className="flex gap-6">
            <div className="flex-1 space-y-8">
              {/* Labels Display */}
              {card.labels.length > 0 && (
                <div>
                  <h3 className="text-xs font-semibold text-neutral-400 mb-2">
                    Labels
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {card.labels.map((label) => (
                      <div
                        key={label.id}
                        className={`px-2 py-1 rounded text-sm font-medium flex items-center gap-1.5 ${label.color}`}
                      >
                        {label.name}
                        <button
                          onClick={() => handleToggleLabel(label)}
                          className="hover:bg-black/20 rounded-full p-0.5 transition-colors"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {card.due_date && (
                <div>
                  <h3 className="text-xs font-semibold text-neutral-400 mb-2">
                    Due Date
                  </h3>
                  <div className="inline-flex items-center gap-2 bg-neutral-700 pl-3 pr-1 py-1.5 rounded text-sm">
                    <span>
                      {format(new Date(card.due_date), "MMM d, yyyy")}
                    </span>
                    {card.is_complete && (
                      <span className="bg-green-500 text-white text-[10px] px-1.5 rounded uppercase font-bold">
                        Complete
                      </span>
                    )}
                    <button
                      onClick={handleClearDueDate}
                      className="hover:bg-neutral-600 rounded-full p-1 transition-colors text-neutral-400 hover:text-neutral-200 ml-1"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              )}

              {/* Members Display */}
              {card.assignees && card.assignees.length > 0 && (
                <div>
                  <h3 className="text-xs font-semibold text-neutral-400 mb-2">
                    Members
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {card.assignees.map((user) => (
                      <div
                        key={user.id}
                        className="bg-neutral-700 px-2.5 py-1.5 rounded text-sm font-medium flex items-center gap-2"
                        title={user.email}
                      >
                        <div className="w-5 h-5 rounded-full bg-neutral-600 flex items-center justify-center text-[10px] text-white">
                          {user.name.charAt(0).toUpperCase()}
                        </div>
                        {user.name}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Description */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <AlignLeft className="w-5 h-5" />
                    <h3 className="text-base font-semibold">Description</h3>
                  </div>
                  {!isEditingDesc && (
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => setIsEditingDesc(true)}
                      className="bg-neutral-700 hover:bg-neutral-600 text-neutral-200 h-8"
                    >
                      Edit
                    </Button>
                  )}
                </div>
                {isEditingDesc ? (
                  <div className="space-y-2">
                    <Textarea
                      autoFocus
                      value={descValue}
                      onChange={(e) => setDescValue(e.target.value)}
                      className="bg-neutral-700 border-neutral-600 min-h-25 text-neutral-200"
                      placeholder="Add a more detailed description..."
                    />
                    <div className="flex gap-2">
                      <Button
                        onClick={handleUpdateDesc}
                        className="bg-blue-600 hover:bg-blue-700 text-white"
                      >
                        Save
                      </Button>
                      <Button
                        variant="ghost"
                        onClick={() => setIsEditingDesc(false)}
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div
                    onClick={() => {
                      setDescValue(card.description || "");
                      setIsEditingDesc(true);
                    }}
                    className={`bg-neutral-700/50 hover:bg-neutral-700 rounded-lg p-3 min-h-12.5 cursor-pointer text-sm ${!card.description ? "text-neutral-400" : "text-neutral-200"}`}
                  >
                    {card.description || "Add a more detailed description..."}
                  </div>
                )}
              </div>

              {/* Checklists */}
              {card.checklists.map((checklist) => {
                const totalItems = checklist.items.length;
                const completedItems = checklist.items.filter(
                  (i) => i.is_checked,
                ).length;
                const progressPercentage =
                  totalItems === 0
                    ? 0
                    : Math.round((completedItems / totalItems) * 100);

                return (
                  <div key={checklist.id} className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <CheckSquare className="w-5 h-5" />
                        <h3 className="text-base font-semibold">
                          {checklist.title}
                        </h3>
                      </div>
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => handleDeleteChecklist(checklist.id)}
                        className="bg-neutral-700 hover:bg-neutral-600 text-neutral-200 h-8"
                      >
                        Delete
                      </Button>
                    </div>

                    {/* Progress Bar */}
                    <div className="flex items-center gap-3">
                      <span className="text-xs text-neutral-400 w-8">
                        {progressPercentage}%
                      </span>
                      <Progress
                        value={progressPercentage}
                        className="h-2 bg-neutral-700 [&>div]:bg-blue-500"
                      />
                    </div>

                    {/* Items */}
                    <div className="space-y-2">
                      {checklist.items.map((item) => (
                        <div
                          key={item.id}
                          className="flex items-start gap-3 group relative hover:bg-neutral-700/50 p-1 -ml-1 rounded"
                        >
                          <Checkbox
                            checked={item.is_checked}
                            onCheckedChange={(checked) =>
                              handleToggleChecklistItem(
                                item.id,
                                checked as boolean,
                              )
                            }
                            className="mt-1"
                          />
                          <span
                            className={`text-sm flex-1 ${item.is_checked ? "line-through text-neutral-500" : "text-neutral-200"}`}
                          >
                            {item.title}
                          </span>
                          <button
                            onClick={() =>
                              handleDeleteChecklistItemLocal(
                                checklist.id,
                                item.id,
                              )
                            }
                            className="opacity-0 group-hover:opacity-100 p-1 hover:bg-neutral-600 rounded text-neutral-400 hover:text-red-400 transition-all"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>

                    {/* Add Item */}
                    <div className="pl-7 mt-2">
                      {newItemTitles[checklist.id] !== undefined ? (
                        <div className="space-y-2">
                          <Input
                            autoFocus
                            placeholder="Add an item"
                            value={newItemTitles[checklist.id]}
                            onChange={(e) =>
                              setNewItemTitles((prev) => ({
                                ...prev,
                                [checklist.id]: e.target.value,
                              }))
                            }
                            onKeyDown={(e) =>
                              e.key === "Enter" &&
                              handleAddChecklistItem(checklist.id)
                            }
                            className="bg-neutral-700 border-neutral-600 text-neutral-200"
                          />
                          <div className="flex gap-2">
                            <Button
                              onClick={() =>
                                handleAddChecklistItem(checklist.id)
                              }
                              className="bg-blue-600 hover:bg-blue-700 text-white"
                            >
                              Add
                            </Button>
                            <Button
                              variant="ghost"
                              onClick={() =>
                                setNewItemTitles((prev) => {
                                  const n = { ...prev };
                                  delete n[checklist.id];
                                  return n;
                                })
                              }
                            >
                              Cancel
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={() =>
                            setNewItemTitles((prev) => ({
                              ...prev,
                              [checklist.id]: "",
                            }))
                          }
                          className="bg-neutral-700 hover:bg-neutral-600 text-neutral-200"
                        >
                          Add an item
                        </Button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
