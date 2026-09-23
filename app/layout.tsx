import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Daily System — Wallpaper Generator",
  description: "Minimal dynamic iPhone lock-screen wallpaper generator.",
  icons: { icon: "/icon.svg" }
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
