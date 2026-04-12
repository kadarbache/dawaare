import Topbar from "@/components/Topbar";
import SettingsClient from "./_components/SettingsClient";

export default function SettingsPage() {
  return (
    <>
      <Topbar page="Settings" subPage="Currency & Categories" />
      <main className="flex-1 overflow-y-auto p-8 custom-scrollbar">
        <SettingsClient />
      </main>
    </>
  );
}
