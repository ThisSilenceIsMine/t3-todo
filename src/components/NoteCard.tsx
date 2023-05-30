// import type { Note, ToDo } from "~/lib/types";
import * as Card from "./ui/card";

import { ToDoList } from "./NoteForm/ToDo/ToDoList";
import { X } from "lucide-react";
import { Note, ToDo } from "@prisma/client";

type Props = {
  note: Note & { todos: ToDo[] };
  onChange?: (note: Note & { todos: ToDo[] }) => void;
  onRemove?: () => void;
};

export const NoteCard = ({ note, onChange, onRemove }: Props): JSX.Element => {
  return (
    <Card.Card className="flex max-h-80 w-80 flex-col justify-between">
      <Card.CardHeader className="h-[40%]">
        <Card.CardTitle className="flex items-center justify-between">
          <input
            type="text"
            defaultValue={note.title ?? ""}
            onBlur={(e) => onChange?.({ ...note, title: e.target.value })}
          />
          <X
            className="cursor-pointer"
            color="gray"
            size="1em"
            onClick={onRemove}
          />
        </Card.CardTitle>
        <Card.CardDescription className="block max-h-12 flex-1">
          <textarea
            className="h-full w-full resize-none"
            defaultValue={note.content ?? ""}
            onBlur={(e) => onChange?.({ ...note, content: e.target.value })}
          />
        </Card.CardDescription>
      </Card.CardHeader>
      <Card.CardContent>
        <ToDoList
          todos={note.todos}
          onChange={(todos) => {
            if (todos.some((todo) => todo.id === undefined)) return;

            onChange?.({ ...note, todos: todos as ToDo[] });
          }}
        />
      </Card.CardContent>
    </Card.Card>
  );
};
