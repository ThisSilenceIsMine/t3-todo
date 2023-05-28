import { Checkbox } from "../../ui/checkbox";
import { Label } from "../../ui/label";
import { A, O, F, pipe } from "@mobily/ts-belt";
import type { ToDo } from "~/lib/types";
import { Input } from "~/components/ui/input";
import type { FocusEventHandler } from "react";
import clsx from "clsx";
import { Cross, CrossIcon, X } from "lucide-react";

type Props = {
  todos: ToDo[];
  onChange?: (todos: ToDo[]) => void;
};

export const ToDoList = ({ todos = [], onChange }: Props) => {
  const handleChange = (idx: number) => (checked: boolean) =>
    pipe(
      todos,
      A.updateAt(idx, (todo) => ({ ...todo, done: checked })),
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
    <div className="flex flex-col gap-2">
      {todos.map((todo, i) => (
        <div
          key={todo.id ?? todo.label ?? i}
          className="flex items-center gap-2"
        >
          <Checkbox
            id={`label-${todo.id ?? todo.label ?? ""}`}
            checked={todo.done}
            onCheckedChange={handleChange(i)}
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
            {todo.label}

            <X onClick={handleRemove(i)} className="cursor-pointer" />
          </Label>
        </div>
      ))}

      <Input placeholder="Buy milk" onBlur={handleAdd} />
    </div>
  );
};
