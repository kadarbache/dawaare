import Sidebar from "@/components/Sidebar";

export const metadata = {
  title: "Dawaare - Inventory",
  description: "Manage your inventory",
};

export default function InventoryLayout({
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
