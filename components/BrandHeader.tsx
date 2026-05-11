"use client";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { BRANDING } from "@/lib/branding";
import { Menu, X } from "lucide-react";
import { useState } from "react";

const NAV_ITEMS = [
  { href: "/", label: "Chấm sản phẩm" },
  { href: "/history", label: "Lịch sử" },
  { href: "/compare", label: "So sánh" },
  { href: "/guide", label: "Hướng dẫn" },
];

export default function BrandHeader() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="mitc-gradient text-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4">
        {/* Top bar */}
        <div className="flex items-center justify-between py-3 border-b border-white/20">
          <div className="flex items-center gap-3">
            <div className="relative w-12 h-12 bg-white rounded-full p-0.5 shrink-0">
              <Image
                src={BRANDING.logoPath}
                alt="Logo MITC"
                fill
                className="object-contain rounded-full"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.style.display = "none";
                  target.parentElement!.innerHTML = '<span class="flex items-center justify-center w-full h-full font-bold text-blue-800 text-xs">MITC</span>';
                }}
              />
            </div>
            <div className="hidden sm:block">
              <p className="text-xs font-medium tracking-wide text-blue-100">{BRANDING.governingBody}</p>
              <p className="text-sm font-semibold">{BRANDING.organizationName}</p>
            </div>
          </div>
          <div className="text-right hidden md:block">
            <p className="text-sm font-bold tracking-wide">{BRANDING.appName}</p>
          </div>
          <button className="md:hidden p-2" onClick={() => setMobileOpen(!mobileOpen)}>
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Navigation */}
        <nav className={`${mobileOpen ? "block" : "hidden"} md:block`}>
          <div className="flex flex-col md:flex-row md:items-center md:gap-1 py-1">
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  pathname === item.href
                    ? "bg-white/20 text-white"
                    : "text-blue-100 hover:bg-white/10 hover:text-white"
                }`}
              >
                {item.label}
              </Link>
            ))}
          </div>
        </nav>
      </div>
    </header>
  );
}
