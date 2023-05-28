import { Note, ToDo } from "~/lib/types";
import { Button } from "../ui/button";
import * as Card from "../ui/card";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import { ToDoList } from "./ToDo/ToDoList";
import { useState } from "react";

type Props = {
  onSubmit?: (note: Note, todos: ToDo[]) => void;
};

export const NoteForm = ({ onSubmit }: Props) => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const [todos, setTodos] = useState<ToDo[]>([]);

  const onTodosChange = (todos: ToDo[]) => {
    console.log({ todos });
    setTodos(todos);
  };

  const handleSubmit = () => {
    onSubmit?.(
      {
        title,
        content,
      },
      todos
    );
  };

  return (
    <Card.Card className="min-w-[375px]">
      <Card.CardHeader>
        <Card.CardTitle>Create new note</Card.CardTitle>
      </Card.CardHeader>
      <Card.CardContent className="flex flex-col gap-4">
        <div>
          <Label htmlFor="title">Title</Label>
          <Input
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="content">Content</Label>
          <Textarea
            id="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
        </div>
        <div>
          <Label>ToDo:</Label>
          <ToDoList todos={todos} onChange={onTodosChange} />
        </div>
      </Card.CardContent>

      <Card.CardFooter>
        <Button className="w-full" onClick={handleSubmit}>
          Submit
        </Button>
      </Card.CardFooter>
    </Card.Card>
  );
};
