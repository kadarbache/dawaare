import React from "react";

export default function Main({ children }: { children: React.ReactNode }) {
  return (
    <main className="w-2/3 overflow-y-auto p-8 bg-background-light dark:bg-background-dark custom-scrollbar">
      {children}
    </main>
  );
}
