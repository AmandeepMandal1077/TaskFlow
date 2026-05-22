import prisma from "@/lib/prisma";

const defaultLabels = [
  { name: "Bug", color: "bg-red-500" },
  { name: "Feature", color: "bg-blue-500" },
  { name: "Enhancement", color: "bg-teal-500" },
  { name: "Design", color: "bg-purple-500" },
  { name: "Documentation", color: "bg-yellow-500" },
  { name: "Urgent", color: "bg-orange-500" },
];

export const labelService = {
  async getAllLabels() {
    try {
      const labels = await prisma.label.findMany({
        orderBy: { name: "asc" },
      });

      if (labels.length > 0) {
        return labels;
      }

      await prisma.label.createMany({ data: defaultLabels });
      return await prisma.label.findMany({
        orderBy: { name: "asc" },
      });
    } catch (err) {
      console.error("Error fetching labels:", err);
      throw new Error("Failed to fetch labels");
    }
  },

  async createLabel(name: string, color: string) {
    try {
      return await prisma.label.create({
        data: { name, color },
      });
    } catch (err) {
      console.error("Error creating label:", err);
      throw new Error("Failed to create label");
    }
  },
};
