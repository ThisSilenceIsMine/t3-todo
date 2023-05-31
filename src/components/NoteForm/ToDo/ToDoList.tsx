import { Checkbox } from "../../ui/checkbox";
import { Label } from "../../ui/label";
import { A, O, F, pipe } from "@mobily/ts-belt";
import type { ToDo } from "~/lib/types";
import { Input } from "~/components/ui/input";
import type { FocusEventHandler } from "react";
import clsx from "clsx";
import { X } from "lucide-react";

type Props = {
  todos: ToDo[];
  onChange?: (todos: ToDo[]) => void;
  className?: string;
};

export const ToDoList = ({ todos = [], onChange, className }: Props) => {
  const handleChange = (idx: number) => (input: Partial<ToDo>) =>
    pipe(
      todos,
      A.updateAt(idx, (todo) => ({ ...todo, ...input })),
      A.sort((a, b) => (a.done ? 1 : 0) - (b.done ? 1 : 0)),
      O.mapNullable((v) => pipe(v, onChange ?? F.identity))
    );

  const handleRemove = (idx: number) => () =>
    pipe(
      todos,
      A.removeAt(idx),
      O.mapNullable((v) => pipe(v, onChange ?? F.identity))
    );

  const handleAdd: FocusEventHandler<HTMLInputElement> = (e) =>
    pipe(
      O.fromNullable(e.target.value),
      O.filter((v) => v !== ""),
      O.map((label) => ({
        label,
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
        {todos.map((todo, i) => (
          <div
            key={todo.id ?? todo.label ?? i}
            className="p-x-2 flex items-center gap-2"
          >
            <Checkbox
              id={`label-${todo.id ?? todo.label ?? ""}`}
              checked={todo.done}
              onCheckedChange={(done: boolean) => handleChange(i)({ done })}
            />
            <Label
              htmlFor={`label-${todo.id ?? todo.label ?? ""}`}
              className={clsx(
                {
                  "line-through": todo.done,
                },
                "flex w-full items-center justify-between gap-2"
              )}
            >
              <input
                type="text"
                defaultValue={todo.label}
                onBlur={(e) => handleChange(i)({ label: e.target.value })}
              />
            </Label>
            <X onClick={handleRemove(i)} className="cursor-pointer" />
          </div>
        ))}
      </div>

      <Input className="mt-auto" placeholder="Buy milk" onBlur={handleAdd} />
    </div>
  );
};
