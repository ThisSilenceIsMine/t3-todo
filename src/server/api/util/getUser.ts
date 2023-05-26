import { prisma } from "~/server/db";

export const getUserOrCreate = async (deviceId: string) => {
  let user = await prisma.user.findUnique({
    where: {
      deviceId,
    },
  });

  if (!user) {
    //create user
    user = await prisma.user.create({
      data: {
        deviceId,
      },
    });
  }

  return user;
};
