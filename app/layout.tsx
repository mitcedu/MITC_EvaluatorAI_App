import type { Metadata } from "next";
import "./globals.css";
import { BRANDING } from "@/lib/branding";

export const metadata: Metadata = {
  title: BRANDING.appNameShort,
  description: BRANDING.subtitle,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="vi">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
      </head>
      <body className="font-sans antialiased bg-slate-50 text-slate-800 min-h-screen">
        {children}
      </body>
    </html>
  );
}
