import Sidebar from "@/components/Sidebar";

export default function SettingsLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden relative border-l border-slate-200 dark:border-primary/20 bg-background-light dark:bg-background-dark">
        {children}
      </div>
    </div>
  );
}
