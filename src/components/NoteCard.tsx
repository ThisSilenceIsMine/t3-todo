import type { Note } from "~/lib/types";
import * as Card from "./ui/card";
type Props = {
  note: Note;
};

export const NoteCard = ({ note }: Props) => {
  return (
    <Card.Card>
      <Card.CardHeader>
        <Card.CardTitle>{note.title}</Card.CardTitle>
        <Card.CardDescription>{note.content}</Card.CardDescription>
      </Card.CardHeader>
    </Card.Card>
  );
};
