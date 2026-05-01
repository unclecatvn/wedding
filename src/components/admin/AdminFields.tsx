import { Plus, Trash2, Upload } from "lucide-react";
import type { WeddingThemeMode } from "@/types/wedding";

export function TextInput({
  label,
  onChange,
  placeholder,
  value,
}: {
  label: string;
  onChange: (value: string) => void;
  placeholder?: string;
  value: string;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-xs uppercase tracking-[0.22em] text-stone-400">
        {label}
      </span>
      <input
        className="w-full rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-cream outline-none transition focus:border-gold"
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        value={value}
      />
    </label>
  );
}

export function TextArea({
  label,
  onChange,
  placeholder,
  rows = 4,
  value,
}: {
  label: string;
  onChange: (value: string) => void;
  placeholder?: string;
  rows?: number;
  value: string;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-xs uppercase tracking-[0.22em] text-stone-400">
        {label}
      </span>
      <textarea
        className="min-h-28 w-full resize-y rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-cream outline-none transition focus:border-gold"
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        rows={rows}
        value={value}
      />
    </label>
  );
}

export function ThemeSelect({
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
        className="w-full rounded-2xl border border-white/10 bg-stone-900 px-4 py-3 text-cream outline-none transition focus:border-gold"
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

export function AddButton({
  children,
  onClick,
}: {
  children: React.ReactNode;
  onClick: () => void;
}) {
  return (
    <button
      className="inline-flex items-center gap-2 rounded-full border border-gold/30 px-4 py-2 text-sm text-gold transition hover:border-gold hover:bg-gold/10"
      onClick={onClick}
      type="button"
    >
      <Plus size={15} />
      {children}
    </button>
  );
}

export function RemoveButton({
  children,
  onClick,
}: {
  children: React.ReactNode;
  onClick: () => void;
}) {
  return (
    <button
      className="mt-3 inline-flex items-center gap-2 rounded-full border border-white/15 px-4 py-2 text-sm text-stone-300 transition hover:border-gold/40 hover:text-gold"
      onClick={onClick}
      type="button"
    >
      <Trash2 size={15} />
      {children}
    </button>
  );
}

export function UploadInput({
  disabled,
  isUploading,
  onUpload,
}: {
  disabled?: boolean;
  isUploading?: boolean;
  onUpload: (file: File) => void;
}) {
  return (
    <label
      className={`mt-3 inline-flex cursor-pointer items-center gap-2 rounded-full border border-white/15 px-4 py-2 text-sm text-stone-200 transition ${
        disabled ? "cursor-not-allowed opacity-50" : "hover:border-gold/40 hover:text-gold"
      }`}
    >
      <Upload size={16} />
      {isUploading ? "Đang upload..." : "Upload ảnh"}
      <input
        accept="image/*"
        className="hidden"
        disabled={disabled}
        onChange={(event) => {
          const file = event.target.files?.[0];
          if (file) {
            onUpload(file);
          }
          event.target.value = "";
        }}
        type="file"
      />
    </label>
  );
}
