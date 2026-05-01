import { AdminDashboard } from "@/components/admin/AdminDashboard";
import { AdminLogin } from "@/components/admin/AdminLogin";
import { isAdminAuthenticated } from "@/lib/adminAuth";
import { hasDatabaseConfig } from "@/lib/prisma";
import { getRsvps } from "@/lib/rsvps";
import { hasSupabaseStorageConfig } from "@/lib/supabase/server";
import { getWeddingContent } from "@/lib/wedding";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const isAuthenticated = await isAdminAuthenticated();

  if (!isAuthenticated) {
    return <AdminLogin isConfigured={Boolean(process.env.ADMIN_PASSWORD)} />;
  }

  const [content, rsvps] = await Promise.all([
    getWeddingContent(),
    getRsvps(),
  ]);

  return (
    <AdminDashboard
      hasDatabaseConfig={hasDatabaseConfig}
      hasStorageConfig={hasSupabaseStorageConfig}
      initialContent={content}
      initialRsvps={rsvps}
    />
  );
}
