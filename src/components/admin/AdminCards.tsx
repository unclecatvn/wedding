export function Panel({
  children,
  description,
  title,
}: {
  children: React.ReactNode;
  description?: string;
  title: string;
}) {
  return (
    <section className="rounded-[2rem] border border-white/10 bg-white/[0.06] p-5 backdrop-blur md:p-6">
      <div className="mb-5">
        <h2 className="font-serif text-3xl">{title}</h2>
        {description ? (
          <p className="mt-2 max-w-2xl text-sm leading-6 text-stone-400">
            {description}
          </p>
        ) : null}
      </div>
      <div className="space-y-4">{children}</div>
    </section>
  );
}

export function Notice({
  children,
  tone = "warning",
}: {
  children: React.ReactNode;
  tone?: "success" | "warning";
}) {
  const toneClass =
    tone === "success"
      ? "border-emerald-300/25 bg-emerald-300/10 text-emerald-200"
      : "border-gold/25 bg-gold/10 text-gold";

  return (
    <p className={`mb-3 rounded-2xl border p-4 text-sm ${toneClass}`}>
      {children}
    </p>
  );
}

export function Stat({
  label,
  value,
}: {
  label: string;
  value: number | string;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
      <p className="font-serif text-4xl">{value}</p>
      <p className="mt-1 text-xs uppercase tracking-[0.2em] text-stone-400">
        {label}
      </p>
    </div>
  );
}
