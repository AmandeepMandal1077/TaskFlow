import prisma from "@/lib/prisma";

export const userService = {
  async getUserByEmail(email: string) {
    try {
      return await prisma.user.findUnique({
        where: {
          email,
        },
      });
    } catch (error) {
      console.error("Error fetching user by email:", error);
      throw new Error("Failed to fetch user by email");
    }
  },
};
