import { fallbackWedding } from "@/lib/fallbackWedding";
import { hasDatabaseConfig, prisma } from "@/lib/prisma";
import { weddingContentSchema } from "@/lib/weddingValidation";
import type { WeddingContent } from "@/types/wedding";

export async function getWeddingContent(): Promise<WeddingContent> {
  if (!hasDatabaseConfig) {
    return fallbackWedding;
  }

  try {
    const data = await prisma.weddingContent.findUnique({
      where: { id: "default" },
    });

    if (!data?.content) {
      return fallbackWedding;
    }

    return weddingContentSchema.parse(data.content);
  } catch {
    return fallbackWedding;
  }
}

export async function saveWeddingContent(content: WeddingContent) {
  if (!hasDatabaseConfig) {
    throw new Error("Database is not configured.");
  }

  const parsed = weddingContentSchema.parse(content);

  await prisma.weddingContent.upsert({
    where: { id: "default" },
    create: {
      id: "default",
      content: parsed,
    },
    update: {
      content: parsed,
    },
  });

  return parsed;
}
