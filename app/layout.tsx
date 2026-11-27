import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "UPSC Edge — Prepare with precision",
  description: "Your personal UPSC CSE preparation, practice and performance workspace.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}
