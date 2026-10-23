import { adminMetadata, assertAdminPreview } from "@/features/admin/guard";
import { tierLabels } from "@/components/admin/labels";
import { AdminPageHeader } from "@/components/admin/page-header";
import { ThemeSwitch } from "@/components/admin/theme-switch";
import { Badge } from "@/components/ui/badge";
import { repos } from "@/features/repos";

export const metadata = adminMetadata("Mẫu thiệp");

export default async function AdminThemesPage() {
  assertAdminPreview();
  const themes = await repos.admin.listThemes();

  return (
    <>
      <AdminPageHeader title="Mẫu thiệp">
        {themes.length} mẫu. Công tắc chỉ đổi trên màn hình, không được lưu.
      </AdminPageHeader>

      <ul className="divide-y divide-border rounded-(--radius-card) border border-border bg-surface">
        {themes.map((t) => (
          <li key={t.slug} className="flex flex-wrap items-center justify-between gap-3 p-4">
            <div className="min-w-0">
              <p className="font-semibold">{t.name}</p>
              <p className="mt-1 flex flex-wrap items-center gap-2 text-sm text-muted">
                <Badge tone={t.tier === "premium" ? "warning" : "neutral"}>
                  {tierLabels[t.tier]}
                </Badge>
                <span>{t.weddingCount} đám cưới dùng</span>
              </p>
            </div>
            <ThemeSwitch initialEnabled={t.enabled} name={t.name} />
          </li>
        ))}
      </ul>
    </>
  );
}
