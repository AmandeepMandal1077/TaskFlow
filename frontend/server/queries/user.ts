import prisma from "@/lib/prisma";

const defaultUsers = [
  { name: "Amandeep Mandal", email: "amandeep@email.com" },
  { name: "Alice Johnson", email: "alice@email.com" },
];

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

  async getAllUsers() {
    try {
      const users = await prisma.user.findMany({
        orderBy: { name: "asc" },
      });

      if (users.length > 0) {
        return users;
      }

      await prisma.user.createMany({ data: defaultUsers });
      return await prisma.user.findMany({
        orderBy: { name: "asc" },
      });
    } catch (error) {
      console.error("Error fetching all users:", error);
      throw new Error("Failed to fetch users");
    }
  },
};
