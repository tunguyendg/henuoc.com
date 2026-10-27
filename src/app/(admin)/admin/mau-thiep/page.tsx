import { adminMetadata, assertAdminPreview } from "@/features/admin/guard";
import { themeStatusLabels, tierLabels } from "@/components/admin/labels";
import { AdminPageHeader } from "@/components/admin/page-header";
import { ThemeSwitch } from "@/components/admin/theme-switch";
import { Badge } from "@/components/ui/badge";
import type { ThemeStatus } from "@/data/themes";
import { repos } from "@/features/repos";

export const metadata = adminMetadata("Mẫu thiệp");

const statusTone = { live: "success", preview: "warning", planned: "neutral" } as const;
const groups: { status: ThemeStatus; title: string }[] = [
  { status: "live", title: "Đang live" },
  { status: "preview", title: "Preview (chưa cho dùng)" },
  { status: "planned", title: "Lộ trình" },
];

export default async function AdminThemesPage() {
  assertAdminPreview();
  const themes = await repos.admin.listThemes();
  const count = (s: ThemeStatus) => themes.filter((t) => t.status === s).length;

  return (
    <>
      <AdminPageHeader title="Mẫu thiệp">
        {themes.length} mẫu: {count("live")} live, {count("preview")} preview, {count("planned")} lộ
        trình. Công tắc chỉ đổi trên màn hình, không được lưu.
      </AdminPageHeader>

      <div className="space-y-8">
        {groups.map(({ status, title }) => {
          const items = themes.filter((t) => t.status === status);
          if (items.length === 0) return null;
          return (
            <section key={status} aria-labelledby={`nhom-${status}`}>
              <h2 id={`nhom-${status}`} className="mb-3 text-lg font-bold text-ink">
                {title} ({items.length})
              </h2>
              <ul className="divide-y divide-border rounded-(--radius-card) border border-border bg-surface">
                {items.map((t) => (
                  <li
                    key={t.slug}
                    className="flex flex-wrap items-center justify-between gap-3 p-4"
                  >
                    <div className="min-w-0">
                      <p className="font-semibold">{t.name}</p>
                      <p className="mt-1 flex flex-wrap items-center gap-2 text-sm text-muted">
                        <Badge tone={statusTone[t.status]}>{themeStatusLabels[t.status]}</Badge>
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
            </section>
          );
        })}
      </div>
    </>
  );
}
