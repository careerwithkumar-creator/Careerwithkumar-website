import { AdminSidebar } from "@/components/admin/sidebar";

export default function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-full flex-1">
      <AdminSidebar />
      <main className="min-w-0 flex-1 bg-bg p-6 sm:p-8">{children}</main>
    </div>
  );
}
