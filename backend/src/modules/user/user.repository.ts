import prisma from '../../lib/prisma.js';

const defaultUsers = [
  { name: 'Amandeep Mandal', email: 'amandeep@email.com' },
  { name: 'Alice Johnson', email: 'alice@email.com' },
];

export const userRepository = {
  async getUserByEmail(email: string) {
    return await prisma.user.findUnique({
      where: { email },
    });
  },

  async getAllUsers() {
    const users = await prisma.user.findMany({
      orderBy: { name: 'asc' },
    });

    if (users.length > 0) {
      return users;
    }

    await prisma.user.createMany({ data: defaultUsers });
    return await prisma.user.findMany({
      orderBy: { name: 'asc' },
    });
  },
};
