"use server";

import { labelService } from "@/server/queries/label";

export async function getAllLabels() {
  return await labelService.getAllLabels();
}

export async function createLabel(name: string, color: string) {
  return await labelService.createLabel(name, color);
}
