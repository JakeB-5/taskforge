import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Toaster } from "@taskforge/ui";
import "@/styles/globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: "TaskForge - Project Management",
  description:
    "A modern project management platform for teams. Organize tasks, track progress, and collaborate effectively.",
  keywords: ["project management", "task tracking", "kanban", "team collaboration"],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans antialiased`}>
        {children}
        <Toaster />
      </body>
    </html>
  );
}
