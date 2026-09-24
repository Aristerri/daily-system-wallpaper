import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Daily System — Wallpaper Generator",
  description: "Minimal dynamic iPhone lock-screen wallpaper generator.",
  icons: {
    icon: [
      { url: "/icon.svg", type: "image/svg+xml" },
      { url: "/favicon.png", type: "image/png", sizes: "32x32" }
    ],
    apple: [{ url: "/apple-icon.png", sizes: "180x180", type: "image/png" }]
  }
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
