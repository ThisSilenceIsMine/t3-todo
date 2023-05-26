import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { prisma } from "~/server/db";
import { getUserOrCreate } from "../util/getUser";

const createNoteInput = z.object({
  deviceId: z.string().uuid(),
  title: z.string().optional(),
  content: z.string(),
  todos: z.array(
    z.object({
      done: z.boolean(),
      label: z.string(),
    })
  ),
});

const getAllNotesInput = z.object({
  deviceId: z.string().uuid(),
});

const updateNoteInput = z.object({
  deviceId: z.string().uuid(),
  id: z.string(),
  title: z.string().optional(),
  content: z.string().optional(),
  todos: z
    .array(
      z.object({
        id: z.string(),
        done: z.boolean(),
        label: z.string(),
      })
    )
    .optional(),
});

export const noteRouter = createTRPCRouter({
  create: publicProcedure.input(createNoteInput).mutation(async ({ input }) => {
    const user = await getUserOrCreate(input.deviceId);

    const note = await prisma.note.create({
      data: {
        title: input.title,
        content: input.content,
        todos: {
          create: input.todos,
        },
        userId: user?.id,
      },
    });

    console.log("created:", { note });
  }),

  getAll: publicProcedure.input(getAllNotesInput).query(async ({ input }) => {
    const user = await getUserOrCreate(input.deviceId);

    return await prisma.note.findMany({
      where: {
        userId: user?.id,
      },
      include: {
        todos: true,
      },
    });
  }),

  update: publicProcedure.input(updateNoteInput).mutation(async ({ input }) => {
    const user = await getUserOrCreate(input.deviceId);

    const note = await prisma.note.findUnique({
      where: {
        id: input.id,
      },
    });

    if (note?.userId !== user?.id) {
      throw new Error("You are not the owner of this note");
    }

    await prisma.note.update({
      where: {
        id: input.id,
      },
      data: {
        title: input.title,
        content: input.content,
        ...(input.todos &&
          input.todos.length > 0 && {
            todos: {
              upsert: input.todos.map((todo) => ({
                where: {
                  id: todo.id,
                },
                update: todo,
                create: todo,
              })),
            },
          }),
      },
    });
  }),
});
