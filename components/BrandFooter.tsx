import { BRANDING } from "@/lib/branding";

export default function BrandFooter() {
  return (
    <footer className="bg-slate-800 text-slate-300 mt-auto">
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm">
          <div className="text-center md:text-left">
            <p className="font-semibold text-white">{BRANDING.footerCopyright}</p>
          </div>
          <div className="text-center md:text-right max-w-md">
            <p className="text-slate-400 text-xs">
              <a href="https://www.facebook.com/nguyentrunghoa1979" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
                {BRANDING.footerNote}
              </a>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
