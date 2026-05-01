"use client";

import { useMemo, useState } from "react";
import { AdminShell, type AdminSection } from "@/components/admin/AdminShell";
import { ContentEditor } from "@/components/admin/ContentEditor";
import {
  MediaManager,
  type ImagePath,
} from "@/components/admin/MediaManager";
import { OverviewPanel } from "@/components/admin/OverviewPanel";
import { RsvpManager } from "@/components/admin/RsvpManager";
import { SettingsPanel } from "@/components/admin/SettingsPanel";
import type { AdminRsvp } from "@/types/admin";
import type {
  TravelNote,
  WeddingContent,
  WeddingEvent,
  WeddingImage,
} from "@/types/wedding";

type AdminDashboardProps = {
  initialContent: WeddingContent;
  initialRsvps: AdminRsvp[];
  hasDatabaseConfig: boolean;
  hasStorageConfig: boolean;
};

export function AdminDashboard({
  hasDatabaseConfig,
  hasStorageConfig,
  initialContent,
  initialRsvps,
}: AdminDashboardProps) {
  const [activeSection, setActiveSection] = useState<AdminSection>("overview");
  const [content, setContent] = useState(initialContent);
  const [savedContent, setSavedContent] = useState(initialContent);
  const [rsvps] = useState(initialRsvps);
  const [status, setStatus] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [uploadingPath, setUploadingPath] = useState<ImagePath | "">("");
  const [lastSavedAt, setLastSavedAt] = useState("");
  const hasUnsavedChanges = useMemo(
    () => JSON.stringify(content) !== JSON.stringify(savedContent),
    [content, savedContent],
  );

  async function saveContent() {
    if (!hasDatabaseConfig) {
      setStatus("Chưa thể lưu: cần cấu hình DATABASE_URL cho Prisma.");
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

  async function uploadImage(file: File, path: ImagePath) {
    if (!hasStorageConfig) {
      setStatus("Chưa thể upload: cần cấu hình Supabase Storage.");
      return;
    }

    setStatus(`Đang upload ${getImagePathLabel(path)}...`);
    setUploadingPath(path);

    try {
      const formData = new FormData();
      formData.append("file", file);
      const response = await fetch("/api/admin/upload", {
        method: "POST",
        body: formData,
      });
      const result = (await response.json().catch(() => ({}))) as {
        error?: string;
        url?: string;
      };

      if (!response.ok || !result.url) {
        setStatus(result.error || "Không thể upload ảnh.");
        return;
      }

      setImageUrl(path, result.url);
      setStatus("Đã upload ảnh. Bấm lưu để cập nhật website.");
    } finally {
      setUploadingPath("");
    }
  }

  return (
    <AdminShell
      activeSection={activeSection}
      hasDatabaseConfig={hasDatabaseConfig}
      hasStorageConfig={hasStorageConfig}
      hasUnsavedChanges={hasUnsavedChanges}
      isSaving={isSaving}
      lastSavedAt={lastSavedAt}
      onLogout={logout}
      onSave={saveContent}
      onSectionChange={setActiveSection}
      status={status}
    >
      {activeSection === "overview" ? (
        <OverviewPanel
          content={content}
          hasDatabaseConfig={hasDatabaseConfig}
          hasStorageConfig={hasStorageConfig}
          hasUnsavedChanges={hasUnsavedChanges}
          lastSavedAt={lastSavedAt}
          rsvps={rsvps}
        />
      ) : null}

      {activeSection === "content" ? (
        <ContentEditor
          content={content}
          onAddEvent={() =>
            setContent((current) => ({
              ...current,
              schedule: [
                ...current.schedule,
                { time: "18:00", title: "New event", details: "Details" },
              ],
            }))
          }
          onAddTravelNote={() =>
            setContent((current) => ({
              ...current,
              travelNotes: [
                ...current.travelNotes,
                { title: "New note", description: "Description" },
              ],
            }))
          }
          onRemoveEvent={removeEvent}
          onRemoveTravelNote={removeTravelNote}
          onReplaceEvent={replaceEvent}
          onReplaceTravelNote={replaceTravelNote}
          onUpdate={update}
        />
      ) : null}

      {activeSection === "media" ? (
        <MediaManager
          content={content}
          hasStorageConfig={hasStorageConfig}
          onAddImage={addImage}
          onRemoveImage={removeImage}
          onReplaceImage={replaceImage}
          onUpdateMainImage={updateMainImage}
          onUpload={uploadImage}
          uploadingPath={uploadingPath}
        />
      ) : null}

      {activeSection === "rsvp" ? <RsvpManager rsvps={rsvps} /> : null}

      {activeSection === "settings" ? (
        <SettingsPanel
          content={content}
          hasDatabaseConfig={hasDatabaseConfig}
          hasStorageConfig={hasStorageConfig}
          onUpdate={update}
        />
      ) : null}
    </AdminShell>
  );

  function update<Key extends keyof WeddingContent>(
    key: Key,
    value: WeddingContent[Key],
  ) {
    setContent((current) => ({ ...current, [key]: value }));
  }

  function updateMainImage(path: "heroImage" | "venueImage", image: WeddingImage) {
    setContent((current) => ({ ...current, [path]: image }));
  }

  function addImage(group: "portraits" | "gallery") {
    setContent((current) => ({
      ...current,
      [group]: [...current[group], blankImage()],
    }));
  }

  function setImageUrl(path: ImagePath, src: string) {
    if (path === "heroImage" || path === "venueImage") {
      setContent((current) => ({
        ...current,
        [path]: { ...current[path], src },
      }));
      return;
    }

    const [group, rawIndex] = path.split(".") as ["portraits" | "gallery", string];
    const index = Number(rawIndex);
    setContent((current) => ({
      ...current,
      [group]: current[group].map((item, itemIndex) =>
        itemIndex === index ? { ...item, src } : item,
      ),
    }));
  }

  function replaceImage(
    group: "portraits" | "gallery",
    index: number,
    image: WeddingImage,
  ) {
    setContent((current) => ({
      ...current,
      [group]: current[group].map((item, itemIndex) =>
        itemIndex === index ? image : item,
      ),
    }));
  }

  function removeImage(group: "portraits" | "gallery", index: number) {
    setContent((current) => ({
      ...current,
      [group]: current[group].filter((_, itemIndex) => itemIndex !== index),
    }));
  }

  function replaceEvent(index: number, event: WeddingEvent) {
    setContent((current) => ({
      ...current,
      schedule: current.schedule.map((item, itemIndex) =>
        itemIndex === index ? event : item,
      ),
    }));
  }

  function removeEvent(index: number) {
    setContent((current) => ({
      ...current,
      schedule: current.schedule.filter((_, itemIndex) => itemIndex !== index),
    }));
  }

  function replaceTravelNote(index: number, note: TravelNote) {
    setContent((current) => ({
      ...current,
      travelNotes: current.travelNotes.map((item, itemIndex) =>
        itemIndex === index ? note : item,
      ),
    }));
  }

  function removeTravelNote(index: number) {
    setContent((current) => ({
      ...current,
      travelNotes: current.travelNotes.filter((_, itemIndex) => itemIndex !== index),
    }));
  }
}

function blankImage(): WeddingImage {
  return {
    src: "",
    alt: "Wedding image",
  };
}

function getImagePathLabel(path: ImagePath) {
  if (path === "heroImage") {
    return "ảnh hero";
  }

  if (path === "venueImage") {
    return "ảnh venue";
  }

  return "ảnh gallery";
}
