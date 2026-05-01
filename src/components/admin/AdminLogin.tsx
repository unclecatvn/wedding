"use client";

import { useState } from "react";

export function AdminLogin({ isConfigured }: { isConfigured: boolean }) {
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function onSubmit(formData: FormData) {
    setError("");
    setIsSubmitting(true);

    const response = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password: formData.get("password") }),
    });

    setIsSubmitting(false);

    if (!response.ok) {
      setError("Mật khẩu admin không đúng hoặc ADMIN_PASSWORD chưa cấu hình.");
      return;
    }

    window.location.reload();
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-stone-950 px-5 text-cream">
      <form
        action={onSubmit}
        className="w-full max-w-md rounded-[2rem] border border-white/10 bg-white/[0.06] p-8 backdrop-blur"
      >
        <p className="text-xs uppercase tracking-[0.35em] text-gold">
          Wedding Admin
        </p>
        <h1 className="mt-4 font-serif text-5xl">Đăng nhập</h1>
        <p className="mt-4 text-sm leading-7 text-stone-300">
          Dùng mật khẩu trong biến môi trường <code>ADMIN_PASSWORD</code>.
        </p>
        {!isConfigured ? (
          <p className="mt-4 rounded-2xl border border-gold/30 bg-gold/10 p-4 text-sm text-gold">
            Chưa cấu hình ADMIN_PASSWORD, admin login sẽ bị khóa.
          </p>
        ) : null}
        <input
          className="mt-6 w-full rounded-2xl border border-white/15 bg-white/10 px-4 py-3 text-cream outline-none focus:border-gold"
          name="password"
          placeholder="Admin password"
          type="password"
        />
        {error ? <p className="mt-3 text-sm text-gold">{error}</p> : null}
        <button
          className="mt-6 rounded-full bg-cream px-6 py-3 text-sm font-semibold uppercase tracking-[0.22em] text-ink transition hover:bg-gold disabled:opacity-60"
          disabled={isSubmitting || !isConfigured}
          type="submit"
        >
          {isSubmitting ? "Đang vào" : "Vào admin"}
        </button>
      </form>
    </main>
  );
}
