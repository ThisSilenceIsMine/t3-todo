import type { ToDo as _ToDo, Note as _Note } from "@prisma/client";

type OptionalExceptFor<T, TRequired extends keyof T = keyof T> = Partial<
  Pick<T, Exclude<keyof T, TRequired>>
> &
  Required<Pick<T, TRequired>>;

export type ToDo = OptionalExceptFor<_ToDo, "done" | "label">;

export type Note = OptionalExceptFor<_Note, "content">;
