import Sidebar from "@/components/Sidebar";
import Main from "./_components/Main";
import CustomersList from "./_components/CustomersList";
import Topbar from "@/components/Topbar";
import ButtomAcionBar from "../terminal/_components/ButtomAcionBar";

export default function CustomersLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden relative border-l border-slate-200 dark:border-primary/20 bg-background-light dark:bg-background-dark">
        <Topbar page="Customers" subPage="" />

        <div className="flex flex-1 overflow-hidden">
          <CustomersList />
          <Main>{children}</Main>
        </div>

        <ButtomAcionBar
          shortcuts={[
            { label: "Search", key: "CTR+K" },
            { label: "Cancel", key: "ESC" },
          ]}
          pathname={"/customers"}
        />
      </div>
    </div>
  );
}
