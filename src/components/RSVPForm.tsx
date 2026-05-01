"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Send } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { rsvpSchema, type RsvpFormValues } from "@/lib/rsvp";

type SubmitState = "idle" | "success" | "error";

export function RSVPForm({ deadline }: { deadline: string }) {
  const [submitState, setSubmitState] = useState<SubmitState>("idle");
  const {
    formState: { errors, isSubmitting },
    handleSubmit,
    register,
    reset,
  } = useForm<RsvpFormValues>({
    resolver: zodResolver(rsvpSchema),
    defaultValues: {
      attending: "yes",
      guests: 1,
      consent: false,
    },
  });

  const onSubmit = handleSubmit(async (values) => {
    setSubmitState("idle");

    const response = await fetch("/api/rsvp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });

    if (!response.ok) {
      setSubmitState("error");
      return;
    }

    setSubmitState("success");
    reset({ attending: "yes", guests: 1, consent: false });
  });

  return (
    <form
      onSubmit={onSubmit}
      className="rounded-[2rem] border border-white/15 bg-white/[0.06] p-6 backdrop-blur md:p-8"
    >
      <div className="mb-8">
        <p className="text-xs uppercase tracking-[0.4em] text-gold">
          RSVP
        </p>
        <h2 className="mt-3 font-serif text-4xl text-cream md:text-6xl">
          Reserve your place
        </h2>
        <p className="mt-4 max-w-xl text-sm leading-7 text-stone-300">
          {deadline} We only use your details to manage attendance and wedding
          communication.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Field label="Full name" error={errors.name?.message}>
          <input {...register("name")} autoComplete="name" />
        </Field>
        <Field label="Email" error={errors.email?.message}>
          <input {...register("email")} type="email" autoComplete="email" />
        </Field>
        <Field label="Attendance" error={errors.attending?.message}>
          <select {...register("attending")}>
            <option value="yes">Joyfully attending</option>
            <option value="no">Unable to attend</option>
          </select>
        </Field>
        <Field label="Additional guests" error={errors.guests?.message}>
          <input
            {...register("guests", { valueAsNumber: true })}
            min={0}
            max={4}
            type="number"
          />
        </Field>
      </div>

      <Field label="Note" error={errors.note?.message} className="mt-4">
        <textarea
          {...register("note")}
          rows={4}
          placeholder="Dietary needs, travel notes or a message for the couple"
        />
      </Field>

      <label className="mt-5 flex gap-3 text-sm leading-6 text-stone-300">
        <input
          {...register("consent")}
          className="mt-1 h-4 w-4 accent-gold"
          type="checkbox"
        />
        <span>
          I consent to storing my RSVP details for wedding planning purposes.
          {errors.consent?.message ? (
            <span className="block text-gold">{errors.consent.message}</span>
          ) : null}
        </span>
      </label>

      <button
        disabled={isSubmitting}
        className="mt-8 inline-flex items-center gap-3 rounded-full bg-cream px-6 py-3 text-sm font-semibold uppercase tracking-[0.22em] text-ink transition hover:bg-gold disabled:cursor-not-allowed disabled:opacity-60"
        type="submit"
      >
        <Send size={16} />
        {isSubmitting ? "Sending" : "Submit RSVP"}
      </button>

      {submitState === "success" ? (
        <p className="mt-4 text-sm text-gold">
          Thank you. Your RSVP has been received.
        </p>
      ) : null}
      {submitState === "error" ? (
        <p className="mt-4 text-sm text-gold">
          Something went wrong. Please try again or contact the couple directly.
        </p>
      ) : null}
    </form>
  );
}

function Field({
  children,
  className = "",
  error,
  label,
}: {
  children: React.ReactElement;
  className?: string;
  error?: string;
  label: string;
}) {
  return (
    <label className={`block ${className}`}>
      <span className="mb-2 block text-xs uppercase tracking-[0.28em] text-stone-400">
        {label}
      </span>
      <span className="block [&>input]:w-full [&>input]:rounded-2xl [&>input]:border [&>input]:border-white/15 [&>input]:bg-white/10 [&>input]:px-4 [&>input]:py-3 [&>input]:text-cream [&>input]:outline-none [&>input]:transition [&>input]:placeholder:text-stone-500 [&>input]:focus:border-gold [&>select]:w-full [&>select]:rounded-2xl [&>select]:border [&>select]:border-white/15 [&>select]:bg-stone-900 [&>select]:px-4 [&>select]:py-3 [&>select]:text-cream [&>select]:outline-none [&>select]:focus:border-gold [&>textarea]:w-full [&>textarea]:resize-none [&>textarea]:rounded-2xl [&>textarea]:border [&>textarea]:border-white/15 [&>textarea]:bg-white/10 [&>textarea]:px-4 [&>textarea]:py-3 [&>textarea]:text-cream [&>textarea]:outline-none [&>textarea]:transition [&>textarea]:placeholder:text-stone-500 [&>textarea]:focus:border-gold">
        {children}
      </span>
      {error ? <span className="mt-2 block text-sm text-gold">{error}</span> : null}
    </label>
  );
}
