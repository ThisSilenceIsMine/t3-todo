import type { Note } from "~/lib/types";

type Props = {
  note: Note;
};

export const NoteCard = ({ note }: Props) => {
  return (
    <div className="rounded-lg bg-slate-600 p-4 text-white">
      <h1 className="text-2xl font-bold">{note.title}</h1>
      <p className="text-lg">{note.content}</p>
    </div>
  );
};

// export const NoteCard = ({ note }: Props) => {
