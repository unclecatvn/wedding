"use client";

import { useMemo, useState } from "react";
import { Panel, Stat } from "@/components/admin/AdminCards";
import { TextInput } from "@/components/admin/AdminFields";
import type { AdminRsvp } from "@/types/admin";

type RsvpFilter = "all" | "yes" | "no";

export function RsvpManager({ rsvps }: { rsvps: AdminRsvp[] }) {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<RsvpFilter>("all");
  const stats = useMemo(() => getRsvpStats(rsvps), [rsvps]);
  const filteredRsvps = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return rsvps.filter((rsvp) => {
      const matchesFilter = filter === "all" || rsvp.attending === filter;
      const matchesQuery =
        !normalizedQuery ||
        rsvp.name.toLowerCase().includes(normalizedQuery) ||
        rsvp.email.toLowerCase().includes(normalizedQuery);

      return matchesFilter && matchesQuery;
    });
  }, [filter, query, rsvps]);

  return (
    <div className="space-y-6">
      <Panel title="RSVP Overview" description="Tổng quan khách mời đã phản hồi.">
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <Stat label="Tổng RSVP" value={stats.total} />
          <Stat label="Tham dự" value={stats.attending} />
          <Stat label="Không tham dự" value={stats.declined} />
          <Stat label="Tổng khách" value={stats.guests} />
        </div>
      </Panel>

      <Panel
        title="Danh sách khách"
        description="Tìm theo tên/email hoặc lọc theo trạng thái tham dự."
      >
        <div className="grid gap-3 lg:grid-cols-[1fr_auto] lg:items-end">
          <TextInput
            label="Tìm khách"
            placeholder="Nhập tên hoặc email"
            value={query}
            onChange={setQuery}
          />
          <div className="flex flex-wrap gap-2">
            {[
              ["all", "Tất cả"],
              ["yes", "Tham dự"],
              ["no", "Không tham dự"],
            ].map(([value, label]) => (
              <button
                className={`rounded-full border px-4 py-3 text-sm transition ${
                  filter === value
                    ? "border-gold bg-gold/15 text-gold"
                    : "border-white/15 text-stone-300 hover:border-gold/40 hover:text-gold"
                }`}
                key={value}
                onClick={() => setFilter(value as RsvpFilter)}
                type="button"
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-6 space-y-3">
          {filteredRsvps.length === 0 ? (
            <p className="rounded-2xl border border-white/10 bg-white/[0.04] p-4 text-sm text-stone-400">
              Không có RSVP phù hợp.
            </p>
          ) : (
            filteredRsvps.map((rsvp) => (
              <article
                className="rounded-2xl border border-white/10 bg-white/[0.04] p-4"
                key={rsvp.id}
              >
                <div className="flex flex-col justify-between gap-3 md:flex-row md:items-start">
                  <div>
                    <h3 className="font-medium">{rsvp.name}</h3>
                    <p className="text-sm text-stone-400">{rsvp.email}</p>
                    <p className="mt-2 text-xs uppercase tracking-[0.18em] text-stone-500">
                      {formatDate(rsvp.submitted_at)}
                    </p>
                  </div>
                  <span className="w-fit rounded-full border border-gold/30 px-3 py-1 text-xs uppercase tracking-[0.18em] text-gold">
                    {rsvp.attending === "yes" ? "Tham dự" : "Không tham dự"}
                  </span>
                </div>
                <p className="mt-3 text-sm text-stone-300">
                  Guests: {rsvp.guests}
                  {rsvp.note ? ` · ${rsvp.note}` : ""}
                </p>
              </article>
            ))
          )}
        </div>
      </Panel>
    </div>
  );
}

export function getRsvpStats(rsvps: AdminRsvp[]) {
  return {
    attending: rsvps.filter((rsvp) => rsvp.attending === "yes").length,
    declined: rsvps.filter((rsvp) => rsvp.attending === "no").length,
    guests: rsvps.reduce((total, rsvp) => total + rsvp.guests, 0),
    total: rsvps.length,
  };
}

function formatDate(value: string) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Không rõ thời gian";
  }

  return date.toLocaleString("vi-VN", {
    dateStyle: "medium",
    timeStyle: "short",
  });
}
