import prisma from '../../lib/prisma.js';

const defaultLabels = [
  { name: 'Bug', color: 'bg-red-500' },
  { name: 'Feature', color: 'bg-blue-500' },
  { name: 'Enhancement', color: 'bg-teal-500' },
  { name: 'Design', color: 'bg-purple-500' },
  { name: 'Documentation', color: 'bg-yellow-500' },
  { name: 'Urgent', color: 'bg-orange-500' },
];

export const labelRepository = {
  async getAllLabels() {
    const labels = await prisma.label.findMany({
      orderBy: { name: 'asc' },
    });

    if (labels.length > 0) {
      return labels;
    }

    await prisma.label.createMany({ data: defaultLabels });
    return await prisma.label.findMany({
      orderBy: { name: 'asc' },
    });
  },

  async createLabel(name: string, color: string) {
    return await prisma.label.create({
      data: { name, color },
    });
  },
};
