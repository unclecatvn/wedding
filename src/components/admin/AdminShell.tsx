import { Eye, LogOut, Save } from "lucide-react";
import { Notice } from "@/components/admin/AdminCards";

export type AdminSection = "overview" | "content" | "media" | "rsvp" | "settings";

const sections: Array<{
  description: string;
  id: AdminSection;
  label: string;
}> = [
  {
    id: "overview",
    label: "Overview",
    description: "Tổng quan website",
  },
  {
    id: "content",
    label: "Content",
    description: "Nội dung từng section",
  },
  {
    id: "media",
    label: "Media",
    description: "Ảnh hero, venue, gallery",
  },
  {
    id: "rsvp",
    label: "RSVP",
    description: "Danh sách khách mời",
  },
  {
    id: "settings",
    label: "Settings",
    description: "Theme và cấu hình",
  },
];

export function AdminShell({
  activeSection,
  children,
  hasDatabaseConfig,
  hasStorageConfig,
  hasUnsavedChanges,
  isSaving,
  lastSavedAt,
  onLogout,
  onSave,
  onSectionChange,
  status,
}: {
  activeSection: AdminSection;
  children: React.ReactNode;
  hasDatabaseConfig: boolean;
  hasStorageConfig: boolean;
  hasUnsavedChanges: boolean;
  isSaving: boolean;
  lastSavedAt: string;
  onLogout: () => void;
  onSave: () => void;
  onSectionChange: (section: AdminSection) => void;
  status: string;
}) {
  return (
    <main className="min-h-screen bg-stone-950 px-5 py-8 text-cream md:px-8">
      <header className="mx-auto flex max-w-7xl flex-col justify-between gap-5 border-b border-white/10 pb-6 md:flex-row md:items-end">
        <div>
          <p className="text-xs uppercase tracking-[0.35em] text-gold">
            Wedding Admin
          </p>
          <h1 className="mt-3 font-serif text-5xl">Quản lý website</h1>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-stone-400">
            Chỉnh nội dung, ảnh và RSVP theo từng khu vực rõ ràng. Mọi thay đổi
            chỉ lên website sau khi bấm lưu.
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <a
            className="inline-flex items-center gap-2 rounded-full border border-white/15 px-5 py-3 text-sm text-stone-200 transition hover:border-gold/40 hover:text-gold"
            href="/"
            target="_blank"
          >
            <Eye size={16} />
            Xem website
          </a>
          <button
            className="inline-flex items-center gap-2 rounded-full border border-white/15 px-5 py-3 text-sm text-stone-200 transition hover:border-gold/40 hover:text-gold"
            onClick={onLogout}
            type="button"
          >
            <LogOut size={16} />
            Đăng xuất
          </button>
        </div>
      </header>

      <div className="mx-auto mt-6 max-w-7xl">
        {!hasDatabaseConfig ? (
          <Notice>
            Chưa cấu hình Prisma database. Admin vẫn hiển thị dữ liệu fallback,
            nhưng lưu nội dung và RSVP cần DATABASE_URL/DIRECT_URL.
          </Notice>
        ) : null}
        {!hasStorageConfig ? (
          <Notice>
            Chưa cấu hình Supabase Storage. Bạn vẫn lưu nội dung được, nhưng
            upload ảnh cần URL/key Supabase và bucket hợp lệ.
          </Notice>
        ) : null}
        {status ? <Notice tone={status.includes("Đã") ? "success" : "warning"}>{status}</Notice> : null}
      </div>

      <SaveStateBar
        hasDatabaseConfig={hasDatabaseConfig}
        hasUnsavedChanges={hasUnsavedChanges}
        isSaving={isSaving}
        lastSavedAt={lastSavedAt}
        onSave={onSave}
      />

      <div className="mx-auto mt-8 grid max-w-7xl gap-6 lg:grid-cols-[18rem_1fr]">
        <aside className="lg:sticky lg:top-24 lg:self-start">
          <nav className="flex gap-2 overflow-x-auto rounded-[2rem] border border-white/10 bg-white/[0.05] p-2 backdrop-blur lg:flex-col">
            {sections.map((section) => {
              const isActive = section.id === activeSection;
              return (
                <button
                  className={`min-w-40 rounded-[1.35rem] px-4 py-3 text-left transition ${
                    isActive
                      ? "bg-cream text-ink"
                      : "text-stone-300 hover:bg-white/[0.06] hover:text-cream"
                  }`}
                  key={section.id}
                  onClick={() => onSectionChange(section.id)}
                  type="button"
                >
                  <span className="block text-sm font-semibold">{section.label}</span>
                  <span className="mt-1 block text-xs opacity-70">
                    {section.description}
                  </span>
                </button>
              );
            })}
          </nav>
        </aside>

        <section>{children}</section>
      </div>
    </main>
  );
}

function SaveStateBar({
  hasDatabaseConfig,
  hasUnsavedChanges,
  isSaving,
  lastSavedAt,
  onSave,
}: {
  hasDatabaseConfig: boolean;
  hasUnsavedChanges: boolean;
  isSaving: boolean;
  lastSavedAt: string;
  onSave: () => void;
}) {
  const label = !hasDatabaseConfig
    ? "Chưa cấu hình Prisma database nên chưa thể lưu"
    : isSaving
      ? "Đang lưu thay đổi"
      : hasUnsavedChanges
        ? "Có thay đổi chưa lưu"
        : lastSavedAt
          ? `Đã lưu lúc ${lastSavedAt}`
          : "Chưa có thay đổi";

  return (
    <div className="sticky top-0 z-30 mx-auto mt-6 max-w-7xl rounded-2xl border border-white/10 bg-stone-950/90 p-4 backdrop-blur">
      <div className="flex flex-col justify-between gap-3 md:flex-row md:items-center">
        <p className="text-sm text-stone-300">{label}</p>
        <SaveButton
          disabled={!hasDatabaseConfig || isSaving || !hasUnsavedChanges}
          isSaving={isSaving}
          onSave={onSave}
          size="sm"
        />
      </div>
    </div>
  );
}

function SaveButton({
  disabled,
  isSaving,
  onSave,
  size = "md",
}: {
  disabled: boolean;
  isSaving: boolean;
  onSave: () => void;
  size?: "md" | "sm";
}) {
  return (
    <button
      className={`inline-flex items-center justify-center gap-2 rounded-full bg-cream text-sm font-semibold uppercase tracking-[0.18em] text-ink transition hover:bg-gold disabled:cursor-not-allowed disabled:opacity-50 ${
        size === "sm" ? "px-5 py-2.5" : "px-5 py-3"
      }`}
      disabled={disabled}
      onClick={onSave}
      type="button"
    >
      <Save size={size === "sm" ? 15 : 16} />
      {isSaving ? "Đang lưu" : "Lưu thay đổi"}
    </button>
  );
}
