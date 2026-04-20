import Topbar from "@/components/Topbar";
import SettingsClient from "./_components/SettingsClient";
import { prisma } from "@/lib/db";

export interface Categories {
  id: string;
  name: string;
  count: number;
  created_at: Date;
  updated_at: Date;
}

export default async function SettingsPage() {
  const categories = await prisma.itemsCategory.findMany();
  const exchangeRate = await prisma.exchangeRate.findUnique({
    where: { currency: "SLSH" },
  });
  return (
    <>
      <Topbar page="Settings" subPage="Currency & Categories" />
      <main className="flex-1 overflow-y-auto p-8 custom-scrollbar">
        <SettingsClient categories={categories} rate={exchangeRate?.rate} />
      </main>
    </>
  );
}
