import { PlusIcon } from "lucide-react";
import { Button } from "../../ui/button";
import { Checkbox } from "../../ui/checkbox";
import { Label } from "../../ui/label";
import { A, O, F, pipe } from "@mobily/ts-belt";
import type { ToDo } from "~/lib/types";

type Props = {
  todos: ToDo[];
  onChange?: (todos: ToDo[]) => void;
};

export const ToDoList = ({ todos = [], onChange }: Props) => {
  const handleChange = (idx: number) => (checked: boolean) =>
    pipe(
      todos,
      A.updateAt(idx, (todo) => ({ ...todo, done: checked })),
      O.mapNullable((v) => pipe(v, onChange ?? F.identity))
    );

  const handleAdd = () =>
    pipe(
      O.fromNullable(window.prompt("Enter a new todo")),
      O.map((label) => ({
        label,
        done: false,
      })),
      O.map(A.append<ToDo>),
      O.mapNullable((v) => pipe(todos, v, onChange ?? F.identity))
    );

  return (
    <div className="flex flex-col gap-2">
      {todos.map((todo, i) => (
        <div key={todo.id ?? todo.label} className="flex items-center gap-2">
          <Checkbox
            id={`label-${todo.id ?? ""}`}
            checked={todo.done}
            onCheckedChange={handleChange(i)}
          />
          <Label htmlFor={`label-${todo.id ?? ""}`}>{todo.label}</Label>
        </div>
      ))}

      <Button
        className="w-fit border-2 border-slate-800 bg-transparent"
        onClick={handleAdd}
      >
        <PlusIcon />
      </Button>
    </div>
  );
};
