import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical } from "lucide-react";
import { ReactNode } from "react";

interface SortableMenuCardProps {
  id: string;
  children: ReactNode;
}

const SortableMenuCard = ({ id, children }: SortableMenuCardProps) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} className="relative group">
      <div
        {...attributes}
        {...listeners}
        className="absolute left-2 top-4 z-10 cursor-grab active:cursor-grabbing p-1 rounded hover:bg-muted transition-colors"
        aria-label="Drag to reorder"
      >
        <GripVertical className="h-5 w-5 text-muted-foreground" />
      </div>
      <div className="pl-8">
        {children}
      </div>
    </div>
  );
};

export default SortableMenuCard;
