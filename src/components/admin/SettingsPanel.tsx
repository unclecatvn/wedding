import { Panel, Stat } from "@/components/admin/AdminCards";
import {
  TextArea,
  TextInput,
  ThemeSelect,
} from "@/components/admin/AdminFields";
import type { WeddingContent, WeddingThemeMode } from "@/types/wedding";

export function SettingsPanel({
  content,
  hasDatabaseConfig,
  hasStorageConfig,
  onUpdate,
}: {
  content: WeddingContent;
  hasDatabaseConfig: boolean;
  hasStorageConfig: boolean;
  onUpdate: <Key extends keyof WeddingContent>(
    key: Key,
    value: WeddingContent[Key],
  ) => void;
}) {
  return (
    <div className="space-y-6">
      <Panel title="Giao diện" description="Cấu hình theme hiển thị ngoài website.">
        <ThemeSelect
          value={content.themeMode}
          onChange={(themeMode: WeddingThemeMode) => onUpdate("themeMode", themeMode)}
        />
      </Panel>

      <Panel title="RSVP & Registry" description="Thông tin bổ sung cho khách mời.">
        <TextInput
          label="RSVP deadline"
          value={content.rsvpDeadline}
          onChange={(value) => onUpdate("rsvpDeadline", value)}
        />
        <TextArea
          label="Registry note"
          rows={5}
          value={content.registryNote}
          onChange={(value) => onUpdate("registryNote", value)}
        />
      </Panel>

      <Panel title="Trạng thái hệ thống" description="Kiểm tra nhanh cấu hình backend.">
        <div className="grid gap-3 md:grid-cols-2">
          <Stat
            label="Prisma database"
            value={hasDatabaseConfig ? "OK" : "Missing"}
          />
          <Stat
            label="Supabase Storage"
            value={hasStorageConfig ? "OK" : "Missing"}
          />
        </div>
      </Panel>
    </div>
  );
}
