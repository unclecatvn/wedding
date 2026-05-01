import { hasDatabaseConfig, prisma } from "@/lib/prisma";
import type { AdminRsvp } from "@/types/admin";

export async function getRsvps(): Promise<AdminRsvp[]> {
  if (!hasDatabaseConfig) {
    return [];
  }

  const rsvps = await prisma.rsvp
    .findMany({
      orderBy: { submittedAt: "desc" },
    })
    .catch(() => []);

  return rsvps.map((rsvp) => ({
    id: rsvp.id,
    name: rsvp.name,
    email: rsvp.email,
    attending: rsvp.attending === "no" ? "no" : "yes",
    guests: rsvp.guests,
    note: rsvp.note,
    submitted_at: rsvp.submittedAt.toISOString(),
  }));
}
