import { NextResponse } from "next/server";
import { hasDatabaseConfig, prisma } from "@/lib/prisma";
import { rsvpSchema } from "@/lib/rsvp";

export async function POST(request: Request) {
  const payload = await request.json().catch(() => null);
  const parsed = rsvpSchema.safeParse(payload);

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid RSVP payload." },
      { status: 400 },
    );
  }

  const rsvp = parsed.data;

  if (hasDatabaseConfig) {
    try {
      await prisma.rsvp.create({
        data: {
          name: rsvp.name,
          email: rsvp.email,
          attending: rsvp.attending,
          guests: rsvp.guests,
          note: rsvp.note,
        },
      });
    } catch {
      return NextResponse.json(
        { error: "Unable to save RSVP." },
        { status: 500 },
      );
    }
  }

  return NextResponse.json({ ok: true });
}
