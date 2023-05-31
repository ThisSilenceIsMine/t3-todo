import { Checkbox } from "../../ui/checkbox";
import { Label } from "../../ui/label";
import { A, O, F, pipe } from "@mobily/ts-belt";
import type { ToDo } from "~/lib/types";
import { Input } from "~/components/ui/input";
import type { FocusEventHandler } from "react";
import clsx from "clsx";
import { X } from "lucide-react";
import * as uuid from "uuid";

type Props = {
  todos: ToDo[];
  onChange?: (todos: ToDo[]) => void;
  className?: string;
};

export const ToDoList = ({ todos = [], onChange, className }: Props) => {
  const handleChange = (id: string) => (input: Partial<ToDo>) =>
    pipe(
      todos,
      // A.updateAt(id, (todo) => ({ ...todo, ...input })),
      A.updateAt(
        todos.findIndex((todo) => todo.id === id),
        (todo) => ({ ...todo, ...input })
      ),
      A.sort((a, b) => (a.done ? 1 : 0) - (b.done ? 1 : 0)),
      O.mapNullable((v) => pipe(v, onChange ?? F.identity))
    );

  const handleRemove = (id: string) => () =>
    pipe(
      todos,
      A.removeAt(todos.findIndex((todo) => todo.id === id)),
      O.mapNullable((v) => pipe(v, onChange ?? F.identity))
    );

  const handleAdd: FocusEventHandler<HTMLInputElement> = (e) =>
    pipe(
      O.fromNullable(e.target.value),
      O.filter((v) => v !== ""),
      O.map((label) => ({
        label,
        id: uuid.v4(),
        done: false,
      })),
      O.map(A.append<ToDo>),
      O.mapNullable((v) => pipe(todos, v, onChange ?? F.identity)),
      F.tap(() => {
        e.target.value = "";
      })
    );

  return (
    <div className={clsx("flex flex-col gap-2", className)}>
      <div className="flex max-h-36 flex-col gap-2 overflow-auto">
        {A.sort(todos, (a, b) => (a.done ? 1 : 0) - (b.done ? 1 : 0)).map(
          (todo, i) => (
            <div
              key={todo.id ?? todo.label ?? i}
              className="p-x-2 flex items-center gap-2"
            >
              <Checkbox
                id={`label-${todo.id ?? todo.label ?? ""}`}
                checked={todo.done}
                onCheckedChange={(done: boolean) =>
                  todo.id && handleChange(todo.id)({ done })
                }
              />
              <Label
                htmlFor={`label-${todo.id ?? todo.label ?? ""}`}
                className={clsx(
                  "flex w-full items-center justify-between gap-2"
                )}
              >
                <input
                  type="text"
                  defaultValue={todo.label}
                  className={
                    todo.done ? "text-gray-400 line-through" : undefined
                  }
                  onBlur={(e) =>
                    todo.id && handleChange(todo.id)({ label: e.target.value })
                  }
                />
              </Label>
              <X
                onClick={todo.id ? handleRemove(todo.id) : undefined}
                className="cursor-pointer"
              />
            </div>
          )
        )}
      </div>

      <Input className="mt-auto" placeholder="Buy milk" onBlur={handleAdd} />
    </div>
  );
};
