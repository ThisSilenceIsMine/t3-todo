import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { prisma } from "~/server/db";
import { getUserOrCreate } from "../util/getUser";

const createNoteInput = z.object({
  title: z.string().optional(),
  content: z.string(),
  todos: z.array(
    z.object({
      done: z.boolean(),
      label: z.string(),
    })
  ),
});

const removeNoteInput = z.object({
  id: z.string(),
});

const updateNoteInput = z.object({
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
  create: publicProcedure
    .input(createNoteInput)
    .mutation(async ({ input, ctx }) => {
      const user = await getUserOrCreate(ctx.deviceId);

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

  remove: publicProcedure
    .input(removeNoteInput)
    .mutation(async ({ input, ctx }) => {
      const user = await getUserOrCreate(ctx.deviceId);

      const note = await prisma.note.findUnique({
        where: { id: input.id },
      });

      if (!note) {
        throw new Error("Note not found");
      }

      if (note.userId !== user.id) {
        throw new Error("Unauthorized");
      }

      await prisma.note.delete({
        where: { id: input.id },
      });

      return true;
    }),

  getAll: publicProcedure.query(async ({ ctx }) => {
    if (!ctx.deviceId) {
      throw new Error("Unauthorized");
    }

    const user = await getUserOrCreate(ctx.deviceId);

    return await prisma.note.findMany({
      where: {
        userId: user?.id,
      },
      include: {
        todos: true,
      },
    });
  }),

  update: publicProcedure
    .input(updateNoteInput)
    .mutation(async ({ input, ctx }) => {
      const user = await getUserOrCreate(ctx.deviceId);

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
          ...(input.title && { title: input.title }),
          ...(input.content && { content: input.content }),
          ...(input.todos && {
            todos: {
              upsert: input.todos.map(({ id, ...todo }) => ({
                where: {
                  id: id,
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
