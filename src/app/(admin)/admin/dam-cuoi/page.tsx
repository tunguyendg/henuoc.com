import { Suspense } from "react";
import Link from "next/link";
import { Search } from "lucide-react";
import { WeddingStatusBadge } from "@/components/admin/badges";
import { adminMetadata, assertAdminPreview } from "@/components/admin/guard";
import { formatDateVN, planLabels, statusLabels } from "@/components/admin/labels";
import { AdminPageHeader, TableFrame, tdClass, thClass } from "@/components/admin/page-header";
import { PlanToggle } from "@/components/admin/plan-toggle";
import { buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { AdminWeddingFilter, Plan, WeddingStatus } from "@/features/admin/types";
import { repos } from "@/features/repos";

export const metadata = adminMetadata("Đám cưới");

const plans = Object.keys(planLabels) as Plan[];
const statuses = Object.keys(statusLabels) as WeddingStatus[];
const Q_MAX = 100;

type SearchParams = Awaited<PageProps<"/admin/dam-cuoi">["searchParams"]>;

function first(v: string | string[] | undefined): string | undefined {
  return Array.isArray(v) ? v[0] : v;
}

/** URL input is untrusted: keep only known enum values and a bounded search string. */
function parseFilter(sp: SearchParams): AdminWeddingFilter {
  const plan = first(sp.plan);
  const status = first(sp.status);
  const q = first(sp.q)?.trim().slice(0, Q_MAX);
  return {
    plan: plans.find((p) => p === plan),
    status: statuses.find((s) => s === status),
    q: q || undefined,
  };
}

// The page itself stays sync (static shell); only the part that reads searchParams — a runtime
// API under cacheComponents — is inside <Suspense> and renders per request.
export default function AdminWeddingsPage({ searchParams }: PageProps<"/admin/dam-cuoi">) {
  assertAdminPreview();

  return (
    <>
      <AdminPageHeader title="Đám cưới">
        Nút đổi gói chỉ đổi trên màn hình, không được lưu.
      </AdminPageHeader>
      <Suspense fallback={<p className="text-muted">Đang tải danh sách…</p>}>
        <WeddingsSection searchParams={searchParams} />
      </Suspense>
    </>
  );
}

const selectClass =
  "h-12 rounded-(--radius-btn) border border-border bg-surface px-3 text-base text-ink focus:border-rose-600";

async function WeddingsSection({
  searchParams,
}: Pick<PageProps<"/admin/dam-cuoi">, "searchParams">) {
  const filter = parseFilter(await searchParams);
  const weddings = await repos.admin.listWeddings(filter);
  const filtered = Boolean(filter.plan || filter.status || filter.q);

  return (
    <>
      {/* Plain GET form: works without JS, filters live in the URL (shareable, back button). */}
      <form
        method="get"
        action="/admin/dam-cuoi"
        role="search"
        aria-label="Lọc đám cưới"
        className="mb-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-[1fr_auto_auto_auto] lg:items-end"
      >
        <Input
          label="Tìm theo tên hoặc slug"
          name="q"
          type="search"
          maxLength={Q_MAX}
          defaultValue={filter.q ?? ""}
        />
        <div className="flex flex-col gap-1.5">
          <label htmlFor="filter-plan" className="text-sm font-medium">
            Gói
          </label>
          <select
            id="filter-plan"
            name="plan"
            defaultValue={filter.plan ?? ""}
            className={selectClass}
          >
            <option value="">Tất cả</option>
            {plans.map((p) => (
              <option key={p} value={p}>
                {planLabels[p]}
              </option>
            ))}
          </select>
        </div>
        <div className="flex flex-col gap-1.5">
          <label htmlFor="filter-status" className="text-sm font-medium">
            Trạng thái
          </label>
          <select
            id="filter-status"
            name="status"
            defaultValue={filter.status ?? ""}
            className={selectClass}
          >
            <option value="">Tất cả</option>
            {statuses.map((s) => (
              <option key={s} value={s}>
                {statusLabels[s]}
              </option>
            ))}
          </select>
        </div>
        <div className="flex gap-2">
          <button type="submit" className={buttonVariants({ className: "h-12 flex-1" })}>
            <Search aria-hidden />
            Lọc
          </button>
          {filtered ? (
            <Link
              href="/admin/dam-cuoi"
              className={buttonVariants({ variant: "ghost", className: "h-12" })}
            >
              Xoá lọc
            </Link>
          ) : null}
        </div>
      </form>

      <p className="mb-3 text-sm text-muted" aria-live="polite">
        {weddings.length} đám cưới{filtered ? " khớp bộ lọc" : ""}.
      </p>

      {weddings.length === 0 ? (
        <p className="rounded-(--radius-card) border border-border bg-surface p-6 text-center text-muted">
          Không có đám cưới nào khớp bộ lọc.
        </p>
      ) : (
        <TableFrame label="Bảng đám cưới">
          <table className="w-full min-w-[760px] text-sm">
            <thead className="border-b border-border">
              <tr>
                <th scope="col" className={thClass}>
                  Cặp đôi
                </th>
                <th scope="col" className={thClass}>
                  Ngày cưới
                </th>
                <th scope="col" className={thClass}>
                  Trạng thái
                </th>
                <th scope="col" className={`${thClass} text-right`}>
                  Khách
                </th>
                <th scope="col" className={thClass}>
                  Gói
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {weddings.map((w) => (
                <tr key={w.id}>
                  <th scope="row" className={`${tdClass} text-left font-medium`}>
                    {w.coupleNames}
                    <span className="block text-xs font-normal text-muted">
                      {w.slug} · mẫu {w.themeSlug}
                    </span>
                  </th>
                  <td className={`${tdClass} tabular-nums`}>
                    {w.weddingDate ? formatDateVN(w.weddingDate) : "Chưa chọn"}
                  </td>
                  <td className={tdClass}>
                    <WeddingStatusBadge status={w.status} />
                  </td>
                  <td className={`${tdClass} text-right tabular-nums`}>{w.guestCount}</td>
                  <td className={tdClass}>
                    <PlanToggle initialPlan={w.plan} coupleNames={w.coupleNames} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </TableFrame>
      )}
    </>
  );
}
