import Sidebar from "@/components/Sidebar";

export const metadata = {
  title: "Dawaare - Dashboard",
  description: "Manage your sales, inventory, and customers",
};

export default function DashbaordLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden relative border-l border-slate-200 dark:border-primary/20">
        {children}
      </div>
    </div>
  );
}
