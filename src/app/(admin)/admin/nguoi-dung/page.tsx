import { adminMetadata, assertAdminPreview } from "@/features/admin/guard";
import { formatDateVN, roleLabels } from "@/components/admin/labels";
import { AdminPageHeader, TableFrame, tdClass, thClass } from "@/components/admin/page-header";
import { repos } from "@/features/repos";

export const metadata = adminMetadata("Người dùng");

export default async function AdminUsersPage() {
  assertAdminPreview();
  const users = await repos.admin.listUsers();

  return (
    <>
      <AdminPageHeader title="Người dùng">
        {users.length} tài khoản, mới nhất trước. Email đã được che.
      </AdminPageHeader>

      <TableFrame label="Bảng người dùng">
        <table className="w-full min-w-[640px] text-sm">
          <thead className="border-b border-border">
            <tr>
              <th scope="col" className={thClass}>
                Tên
              </th>
              <th scope="col" className={thClass}>
                Email
              </th>
              <th scope="col" className={thClass}>
                Vai trò
              </th>
              <th scope="col" className={`${thClass} text-right`}>
                Đám cưới
              </th>
              <th scope="col" className={thClass}>
                Ngày tạo
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {users.map((u) => (
              <tr key={u.id}>
                <th scope="row" className={`${tdClass} text-left font-medium`}>
                  {u.displayName}
                </th>
                <td className={`${tdClass} text-muted`}>{u.emailMasked}</td>
                <td className={tdClass}>{roleLabels[u.role]}</td>
                <td className={`${tdClass} text-right tabular-nums`}>{u.weddingCount}</td>
                <td className={`${tdClass} tabular-nums`}>{formatDateVN(u.createdAt)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </TableFrame>
    </>
  );
}
