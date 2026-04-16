import "./globals.css";
import type { Metadata } from "next";
import { Poppins, Roboto } from "next/font/google";
import { Toaster } from "react-hot-toast";
import { cn } from "@/lib/utils";

const roboto = Roboto({ subsets: ["latin"], variable: "--font-sans" });

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: "Dawaare",
  description: "Manage your shop with ease",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={cn("dark", "font-sans", roboto.variable)}>
      <body className={`${poppins.variable} antialiased`}>
        <Toaster position="top-right" />
        {children}
      </body>
    </html>
  );
}
