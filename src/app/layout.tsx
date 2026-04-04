// @ts-expect-error this error can be savely ignored
import "./globals.css";
import type { Metadata } from "next";
import { Poppins, Roboto } from "next/font/google";
import { Toaster } from "react-hot-toast";
import { cn } from "@/lib/utils";

const roboto = Roboto({subsets:['latin'],variable:'--font-sans'});

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: "Cogie",
  description: "Elevate Your Workflow",
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
