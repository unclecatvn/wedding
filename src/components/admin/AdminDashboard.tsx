"use client";

import { Plus, Save, Trash2, Upload } from "lucide-react";
import { useMemo, useState } from "react";
import type { AdminRsvp } from "@/types/admin";
import type {
  TravelNote,
  WeddingContent,
  WeddingEvent,
  WeddingImage,
  WeddingThemeMode,
} from "@/types/wedding";

type AdminDashboardProps = {
  initialContent: WeddingContent;
  initialRsvps: AdminRsvp[];
  hasDatabaseConfig: boolean;
  hasStorageConfig: boolean;
};

type ImagePath =
  | "heroImage"
  | "venueImage"
  | `portraits.${number}`
  | `gallery.${number}`;

export function AdminDashboard({
  hasDatabaseConfig,
  hasStorageConfig,
  initialContent,
  initialRsvps,
}: AdminDashboardProps) {
  const [content, setContent] = useState(initialContent);
  const [savedContent, setSavedContent] = useState(initialContent);
  const [rsvps] = useState(initialRsvps);
  const [status, setStatus] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [lastSavedAt, setLastSavedAt] = useState("");
  const attendingCount = useMemo(
    () => rsvps.filter((rsvp) => rsvp.attending === "yes").length,
    [rsvps],
  );
  const hasUnsavedChanges = useMemo(
    () => JSON.stringify(content) !== JSON.stringify(savedContent),
    [content, savedContent],
  );

  async function saveContent() {
    if (!hasDatabaseConfig) {
      setStatus(
        "Chưa thể lưu: cần cấu hình DATABASE_URL và DIRECT_URL cho Prisma.",
      );
      return;
    }

    setStatus("Đang lưu...");
    setIsSaving(true);

    try {
      const response = await fetch("/api/admin/content", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(content),
      });
      const result = (await response.json().catch(() => ({}))) as {
        content?: WeddingContent;
        error?: string;
      };

      if (!response.ok || !result.content) {
        setStatus(result.error || "Không thể lưu nội dung.");
        return;
      }

      setContent(result.content);
      setSavedContent(result.content);
      setLastSavedAt(new Date().toLocaleTimeString("vi-VN"));
      setStatus("Đã lưu nội dung.");
    } finally {
      setIsSaving(false);
    }
  }

  async function logout() {
    await fetch("/api/admin/login", { method: "DELETE" });
    window.location.reload();
  }

  return (
    <main className="min-h-screen bg-stone-950 px-5 py-8 text-cream md:px-8">
      <header className="mx-auto flex max-w-7xl flex-col justify-between gap-5 border-b border-white/10 pb-6 md:flex-row md:items-end">
        <div>
          <p className="text-xs uppercase tracking-[0.35em] text-gold">
            Wedding Admin
          </p>
          <h1 className="mt-3 font-serif text-5xl">Quản lý website</h1>
        </div>
        <div className="flex flex-wrap gap-3">
          <a
            className="rounded-full border border-white/15 px-5 py-3 text-sm text-stone-200"
            href="/"
            target="_blank"
          >
            Xem website
          </a>
          <button
            className="rounded-full border border-white/15 px-5 py-3 text-sm text-stone-200"
            onClick={logout}
            type="button"
          >
            Đăng xuất
          </button>
          <button
            className="inline-flex items-center gap-2 rounded-full bg-cream px-5 py-3 text-sm font-semibold uppercase tracking-[0.18em] text-ink transition hover:bg-gold disabled:cursor-not-allowed disabled:opacity-50"
            disabled={!hasDatabaseConfig || isSaving || !hasUnsavedChanges}
            onClick={saveContent}
            type="button"
          >
            <Save size={16} />
            {isSaving ? "Đang lưu" : "Lưu thay đổi"}
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
        {status ? <Notice>{status}</Notice> : null}
      </div>

      <SaveStateBar
        hasDatabaseConfig={hasDatabaseConfig}
        hasUnsavedChanges={hasUnsavedChanges}
        isSaving={isSaving}
        lastSavedAt={lastSavedAt}
        onSave={saveContent}
      />

      <div className="mx-auto mt-8 grid max-w-7xl gap-6 xl:grid-cols-[1fr_0.75fr]">
        <div className="space-y-6">
          <Panel title="Giao diện">
            <ThemeSelect
              value={content.themeMode}
              onChange={(themeMode) => update("themeMode", themeMode)}
            />
          </Panel>

          <Panel title="Hero">
            <TextInput label="Tên cặp đôi" value={content.coupleName} onChange={(value) => update("coupleName", value)} />
            <TextInput label="Eyebrow" value={content.eyebrow} onChange={(value) => update("eyebrow", value)} />
            <TextInput label="Ngày cưới" value={content.dateLabel} onChange={(value) => update("dateLabel", value)} />
            <TextArea label="Tiêu đề hero" value={content.heroTitle} onChange={(value) => update("heroTitle", value)} />
            <TextArea label="Mô tả hero" value={content.heroSubtitle} onChange={(value) => update("heroSubtitle", value)} />
            <ImageEditor image={content.heroImage} label="Ảnh hero" onChange={(image) => update("heroImage", image)} onUpload={(file) => uploadImage(file, "heroImage")} />
          </Panel>

          <Panel title="Story">
            <TextInput label="Tiêu đề story" value={content.storyTitle} onChange={(value) => update("storyTitle", value)} />
            <TextArea label="Nội dung story" value={content.storyBody} onChange={(value) => update("storyBody", value)} />
            <ImageList
              images={content.portraits}
              label="Portraits"
              onAdd={() => setContent({ ...content, portraits: [...content.portraits, blankImage()] })}
              onChange={(index, image) => replaceImage("portraits", index, image)}
              onRemove={(index) => removeImage("portraits", index)}
              onUpload={(index, file) => uploadImage(file, `portraits.${index}`)}
            />
          </Panel>

          <Panel title="Venue">
            <TextInput label="Tên địa điểm" value={content.venueName} onChange={(value) => update("venueName", value)} />
            <TextInput label="Vị trí" value={content.venueLocation} onChange={(value) => update("venueLocation", value)} />
            <TextArea label="Mô tả địa điểm" value={content.venueDescription} onChange={(value) => update("venueDescription", value)} />
            <ImageEditor image={content.venueImage} label="Ảnh venue" onChange={(image) => update("venueImage", image)} onUpload={(file) => uploadImage(file, "venueImage")} />
          </Panel>

          <Panel title="Schedule">
            {content.schedule.map((event, index) => (
              <EventEditor
                key={`${event.time}-${index}`}
                event={event}
                onChange={(nextEvent) => replaceEvent(index, nextEvent)}
                onRemove={() => removeEvent(index)}
              />
            ))}
            <AddButton onClick={() => setContent({ ...content, schedule: [...content.schedule, { time: "18:00", title: "New event", details: "Details" }] })}>
              Thêm sự kiện
            </AddButton>
          </Panel>

          <Panel title="Gallery">
            <ImageList
              images={content.gallery}
              label="Gallery"
              onAdd={() => setContent({ ...content, gallery: [...content.gallery, blankImage()] })}
              onChange={(index, image) => replaceImage("gallery", index, image)}
              onRemove={(index) => removeImage("gallery", index)}
              onUpload={(index, file) => uploadImage(file, `gallery.${index}`)}
            />
          </Panel>

          <Panel title="Travel & Registry">
            <TextInput label="RSVP deadline" value={content.rsvpDeadline} onChange={(value) => update("rsvpDeadline", value)} />
            <TextArea label="Registry note" value={content.registryNote} onChange={(value) => update("registryNote", value)} />
            {content.travelNotes.map((note, index) => (
              <TravelEditor
                key={`${note.title}-${index}`}
                note={note}
                onChange={(nextNote) => replaceTravelNote(index, nextNote)}
                onRemove={() => removeTravelNote(index)}
              />
            ))}
            <AddButton onClick={() => setContent({ ...content, travelNotes: [...content.travelNotes, { title: "New note", description: "Description" }] })}>
              Thêm travel note
            </AddButton>
          </Panel>
        </div>

        <aside className="space-y-6">
          <Panel title="RSVP">
            <div className="grid grid-cols-2 gap-3 text-sm">
              <Stat label="Tổng RSVP" value={rsvps.length} />
              <Stat label="Sẽ tham dự" value={attendingCount} />
            </div>
            <div className="mt-5 space-y-3">
              {rsvps.length === 0 ? (
                <p className="text-sm text-stone-400">Chưa có RSVP.</p>
              ) : (
                rsvps.map((rsvp) => (
                  <article
                    className="rounded-2xl border border-white/10 bg-white/[0.04] p-4"
                    key={rsvp.id}
                  >
                    <div className="flex justify-between gap-4">
                      <div>
                        <h3 className="font-medium">{rsvp.name}</h3>
                        <p className="text-sm text-stone-400">{rsvp.email}</p>
                      </div>
                      <span className="text-xs uppercase tracking-[0.18em] text-gold">
                        {rsvp.attending === "yes" ? "Yes" : "No"}
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
        </aside>
      </div>
    </main>
  );

  function update<Key extends keyof WeddingContent>(
    key: Key,
    value: WeddingContent[Key],
  ) {
    setContent({ ...content, [key]: value });
  }

  async function uploadImage(file: File, path: ImagePath) {
    setStatus("Đang upload ảnh...");
    const formData = new FormData();
    formData.append("file", file);
    const response = await fetch("/api/admin/upload", {
      method: "POST",
      body: formData,
    });
    const result = (await response.json().catch(() => ({}))) as { url?: string };

    if (!response.ok || !result.url) {
      setStatus("Không thể upload ảnh.");
      return;
    }

    setStatus("Đã upload ảnh.");
    setImageUrl(path, result.url);
  }

  function setImageUrl(path: ImagePath, src: string) {
    if (path === "heroImage" || path === "venueImage") {
      update(path, { ...content[path], src });
      return;
    }

    const [group, rawIndex] = path.split(".") as ["portraits" | "gallery", string];
    replaceImage(group, Number(rawIndex), {
      ...content[group][Number(rawIndex)],
      src,
    });
  }

  function replaceImage(
    group: "portraits" | "gallery",
    index: number,
    image: WeddingImage,
  ) {
    setContent({
      ...content,
      [group]: content[group].map((item, itemIndex) =>
        itemIndex === index ? image : item,
      ),
    });
  }

  function removeImage(group: "portraits" | "gallery", index: number) {
    setContent({
      ...content,
      [group]: content[group].filter((_, itemIndex) => itemIndex !== index),
    });
  }

  function replaceEvent(index: number, event: WeddingEvent) {
    setContent({
      ...content,
      schedule: content.schedule.map((item, itemIndex) =>
        itemIndex === index ? event : item,
      ),
    });
  }

  function removeEvent(index: number) {
    setContent({
      ...content,
      schedule: content.schedule.filter((_, itemIndex) => itemIndex !== index),
    });
  }

  function replaceTravelNote(index: number, note: TravelNote) {
    setContent({
      ...content,
      travelNotes: content.travelNotes.map((item, itemIndex) =>
        itemIndex === index ? note : item,
      ),
    });
  }

  function removeTravelNote(index: number) {
    setContent({
      ...content,
      travelNotes: content.travelNotes.filter((_, itemIndex) => itemIndex !== index),
    });
  }
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
        <button
          className="inline-flex items-center justify-center gap-2 rounded-full bg-cream px-5 py-2.5 text-sm font-semibold uppercase tracking-[0.18em] text-ink transition hover:bg-gold disabled:cursor-not-allowed disabled:opacity-50"
          disabled={!hasDatabaseConfig || isSaving || !hasUnsavedChanges}
          onClick={onSave}
          type="button"
        >
          <Save size={15} />
          Lưu
        </button>
      </div>
    </div>
  );
}

function Panel({ children, title }: { children: React.ReactNode; title: string }) {
  return (
    <section className="rounded-[2rem] border border-white/10 bg-white/[0.06] p-5 backdrop-blur md:p-6">
      <h2 className="font-serif text-3xl">{title}</h2>
      <div className="mt-5 space-y-4">{children}</div>
    </section>
  );
}

function Notice({ children }: { children: React.ReactNode }) {
  return (
    <p className="mb-3 rounded-2xl border border-gold/25 bg-gold/10 p-4 text-sm text-gold">
      {children}
    </p>
  );
}

function TextInput({
  label,
  onChange,
  value,
}: {
  label: string;
  onChange: (value: string) => void;
  value: string;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-xs uppercase tracking-[0.22em] text-stone-400">
        {label}
      </span>
      <input
        className="w-full rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-cream outline-none focus:border-gold"
        onChange={(event) => onChange(event.target.value)}
        value={value}
      />
    </label>
  );
}

function TextArea({
  label,
  onChange,
  value,
}: {
  label: string;
  onChange: (value: string) => void;
  value: string;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-xs uppercase tracking-[0.22em] text-stone-400">
        {label}
      </span>
      <textarea
        className="min-h-28 w-full resize-y rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-cream outline-none focus:border-gold"
        onChange={(event) => onChange(event.target.value)}
        value={value}
      />
    </label>
  );
}

function ThemeSelect({
  onChange,
  value,
}: {
  onChange: (value: WeddingThemeMode) => void;
  value: WeddingThemeMode;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-xs uppercase tracking-[0.22em] text-stone-400">
        Chế độ website
      </span>
      <select
        className="w-full rounded-2xl border border-white/10 bg-stone-900 px-4 py-3 text-cream outline-none focus:border-gold"
        onChange={(event) => onChange(event.target.value as WeddingThemeMode)}
        value={value}
      >
        <option value="dark">Tối - cinematic luxury</option>
        <option value="light">Sáng - editorial soft</option>
      </select>
      <p className="mt-2 text-sm leading-6 text-stone-400">
        Chế độ tối giữ cảm giác cinematic; chế độ sáng đổi nền, chữ và overlay
        ảnh sang tông editorial nhẹ hơn.
      </p>
    </label>
  );
}

function ImageEditor({
  image,
  label,
  onChange,
  onUpload,
}: {
  image: WeddingImage;
  label: string;
  onChange: (image: WeddingImage) => void;
  onUpload: (file: File) => void;
}) {
  return (
    <div className="rounded-2xl border border-white/10 p-4">
      <p className="mb-3 text-xs uppercase tracking-[0.22em] text-stone-400">
        {label}
      </p>
      {image.src ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img alt={image.alt} className="mb-4 h-36 w-full rounded-xl object-cover" src={image.src} />
      ) : null}
      <TextInput label="Image URL" value={image.src} onChange={(src) => onChange({ ...image, src })} />
      <TextInput label="Alt text" value={image.alt} onChange={(alt) => onChange({ ...image, alt })} />
      <UploadInput onUpload={onUpload} />
    </div>
  );
}

function ImageList({
  images,
  label,
  onAdd,
  onChange,
  onRemove,
  onUpload,
}: {
  images: WeddingImage[];
  label: string;
  onAdd: () => void;
  onChange: (index: number, image: WeddingImage) => void;
  onRemove: (index: number) => void;
  onUpload: (index: number, file: File) => void;
}) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-3">
        <p className="text-xs uppercase tracking-[0.22em] text-stone-400">
          {label}
        </p>
        <AddButton onClick={onAdd}>Thêm ảnh</AddButton>
      </div>
      {images.map((image, index) => (
        <ImageEditor
          key={`${image.src}-${index}`}
          image={image}
          label={`${label} ${index + 1}`}
          onChange={(nextImage) => onChange(index, nextImage)}
          onUpload={(file) => onUpload(index, file)}
        />
      ))}
      {images.length > 1 ? (
        <div className="flex flex-wrap gap-2">
          {images.map((image, index) => (
            <button
              className="inline-flex items-center gap-2 rounded-full border border-white/15 px-3 py-2 text-xs text-stone-300"
              key={`${image.src}-remove-${index}`}
              onClick={() => onRemove(index)}
              type="button"
            >
              <Trash2 size={14} />
              Xóa ảnh {index + 1}
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}

function UploadInput({ onUpload }: { onUpload: (file: File) => void }) {
  return (
    <label className="mt-3 inline-flex cursor-pointer items-center gap-2 rounded-full border border-white/15 px-4 py-2 text-sm text-stone-200">
      <Upload size={16} />
      Upload ảnh
      <input
        accept="image/*"
        className="hidden"
        onChange={(event) => {
          const file = event.target.files?.[0];
          if (file) {
            onUpload(file);
          }
        }}
        type="file"
      />
    </label>
  );
}

function EventEditor({
  event,
  onChange,
  onRemove,
}: {
  event: WeddingEvent;
  onChange: (event: WeddingEvent) => void;
  onRemove: () => void;
}) {
  return (
    <div className="rounded-2xl border border-white/10 p-4">
      <TextInput label="Time" value={event.time} onChange={(time) => onChange({ ...event, time })} />
      <TextInput label="Title" value={event.title} onChange={(title) => onChange({ ...event, title })} />
      <TextArea label="Details" value={event.details} onChange={(details) => onChange({ ...event, details })} />
      <RemoveButton onClick={onRemove}>Xóa sự kiện</RemoveButton>
    </div>
  );
}

function TravelEditor({
  note,
  onChange,
  onRemove,
}: {
  note: TravelNote;
  onChange: (note: TravelNote) => void;
  onRemove: () => void;
}) {
  return (
    <div className="rounded-2xl border border-white/10 p-4">
      <TextInput label="Title" value={note.title} onChange={(title) => onChange({ ...note, title })} />
      <TextArea label="Description" value={note.description} onChange={(description) => onChange({ ...note, description })} />
      <RemoveButton onClick={onRemove}>Xóa travel note</RemoveButton>
    </div>
  );
}

function AddButton({
  children,
  onClick,
}: {
  children: React.ReactNode;
  onClick: () => void;
}) {
  return (
    <button
      className="inline-flex items-center gap-2 rounded-full border border-gold/30 px-4 py-2 text-sm text-gold"
      onClick={onClick}
      type="button"
    >
      <Plus size={15} />
      {children}
    </button>
  );
}

function RemoveButton({
  children,
  onClick,
}: {
  children: React.ReactNode;
  onClick: () => void;
}) {
  return (
    <button
      className="mt-3 inline-flex items-center gap-2 rounded-full border border-white/15 px-4 py-2 text-sm text-stone-300"
      onClick={onClick}
      type="button"
    >
      <Trash2 size={15} />
      {children}
    </button>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
      <p className="font-serif text-4xl">{value}</p>
      <p className="mt-1 text-xs uppercase tracking-[0.2em] text-stone-400">
        {label}
      </p>
    </div>
  );
}

function blankImage(): WeddingImage {
  return {
    src: "",
    alt: "Wedding image",
  };
}
