import { connection } from "next/server";
import { AdminSidebar } from "@/components/admin/sidebar";

export default async function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await connection();
  return (
    <div className="flex min-h-full flex-1">
      <AdminSidebar />
      <main className="min-w-0 flex-1 bg-bg p-6 sm:p-8">{children}</main>
    </div>
  );
}
