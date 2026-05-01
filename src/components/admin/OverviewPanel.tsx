import { Panel, Stat } from "@/components/admin/AdminCards";
import { getRsvpStats } from "@/components/admin/RsvpManager";
import type { AdminRsvp } from "@/types/admin";
import type { WeddingContent } from "@/types/wedding";

export function OverviewPanel({
  content,
  hasDatabaseConfig,
  hasStorageConfig,
  hasUnsavedChanges,
  lastSavedAt,
  rsvps,
}: {
  content: WeddingContent;
  hasDatabaseConfig: boolean;
  hasStorageConfig: boolean;
  hasUnsavedChanges: boolean;
  lastSavedAt: string;
  rsvps: AdminRsvp[];
}) {
  const stats = getRsvpStats(rsvps);

  return (
    <div className="space-y-6">
      <Panel
        title="Tổng quan"
        description="Những chỉ số quan trọng để người quản lý biết website đang ở trạng thái nào."
      >
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <Stat label="Theme" value={content.themeMode === "light" ? "Sáng" : "Tối"} />
          <Stat label="RSVP" value={stats.total} />
          <Stat label="Khách tham dự" value={stats.attending} />
          <Stat label="Tổng khách" value={stats.guests} />
        </div>
      </Panel>

      <Panel title="Trạng thái chỉnh sửa">
        <div className="grid gap-3 md:grid-cols-3">
          <Stat
            label="Nội dung"
            value={hasUnsavedChanges ? "Chưa lưu" : "Đã lưu"}
          />
          <Stat
            label="Lần lưu cuối"
            value={lastSavedAt || "Chưa có"}
          />
          <Stat
            label="Backend"
            value={hasDatabaseConfig && hasStorageConfig ? "Sẵn sàng" : "Cần cấu hình"}
          />
        </div>
      </Panel>

      <Panel
        title="Gợi ý quản lý"
        description="Quy trình đơn giản cho người dùng phổ thông."
      >
        <ol className="space-y-3 text-sm leading-7 text-stone-300">
          <li>1. Sửa chữ ở tab Content.</li>
          <li>2. Thay ảnh ở tab Media và kiểm tra alt text.</li>
          <li>3. Vào Settings chọn giao diện sáng/tối và deadline RSVP.</li>
          <li>4. Bấm Lưu thay đổi, sau đó mở website để kiểm tra.</li>
        </ol>
      </Panel>
    </div>
  );
}
