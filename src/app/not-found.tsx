import Link from "next/link";
import { SearchX, Headphones, BarChart3 } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center p-8 bg-background-dark bg-[radial-gradient(circle_at_center,var(--tw-gradient-stops))] from-[#2d1e16] to-dark">
      <div className="max-w-2xl w-full text-center space-y-12">
        {/* Visual Graphic */}
        <div className="relative flex justify-center items-center">
          <div className="absolute w-64 h-64 bg-primary/20 rounded-full blur-[120px] -z-10" />
          <div className="absolute w-48 h-48 bg-secondary/30 rounded-full blur-[80px] -z-10 translate-x-12 translate-y-12" />

          <div className="relative group">
            <h1 className="text-[12rem] md:text-[16rem] font-black leading-none tracking-tighter text-transparent bg-clip-text bg-linear-to-b from-slate-100 to-slate-700 text-404-glitch opacity-10 select-none">
              404
            </h1>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="relative w-48 h-48 md:w-64 md:h-64 flex items-center justify-center border-4 border-primary/40 rounded-3xl rotate-12 group-hover:rotate-0 transition-transform duration-500 bg-[#2d1e16]/50 backdrop-blur-xl shadow-2xl overflow-hidden">
                <div
                  className="absolute inset-0 opacity-20"
                  style={{
                    backgroundImage:
                      "radial-gradient(circle at 2px 2px, #ec5b13 1px, transparent 0)",
                    backgroundSize: "24px 24px",
                  }}
                />
                <SearchX className="w-24! h-24! md:w-32! md:h-32! text-primary drop-shadow-[0_0_15px_rgba(236,91,19,0.5)]" />
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="space-y-6 max-w-lg mx-auto">
          <div className="space-y-2">
            <h2 className="text-3xl md:text-5xl font-extrabold text-slate-100 font-display tracking-tight">
              Oops! This page is missing.
            </h2>
            <p className="text-lg text-[#e2bfb3]">
              The link you followed might be broken, or the page may have been
              moved.
            </p>
          </div>

          {/* Action Group */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
            <Link href="/dashboard">
              <Button size="lg" className="px-8 py-8 text-lg">
                <BarChart3 size={20} />
                Back to Dashboard
              </Button>
            </Link>
            <Button
              variant="outline"
              className="px-8 py-8 border-2 border-[#5a4138] text-slate-100 rounded-md font-bold text-lg flex items-center gap-2 hover:bg-[#41312b] hover:border-primary transition-all duration-200"
            >
              <Headphones size={20} />
              Contact Support
            </Button>
          </div>
        </div>

        {/* Tech Details */}
        <div className="mt-16 pt-8 border-t border-[#5a4138]/30 flex flex-wrap justify-center gap-x-8 gap-y-2">
          <div className="flex items-center gap-2 text-slate-500 text-xs uppercase tracking-widest font-semibold">
            <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
            Error Code: 404_NOT_FOUND
          </div>
          <div className="flex items-center gap-2 text-slate-500 text-xs uppercase tracking-widest font-semibold">
            <span className="w-1.5 h-1.5 rounded-full bg-stone-700" />
            Timestamp: {new Date().toISOString().slice(0, 19).replace("T", " ")}
          </div>
        </div>
      </div>

      {/* Decorative Corner Element */}
      <div className="fixed bottom-0 right-0 p-8 pointer-events-none opacity-20 hidden md:block">
        <div className="w-64 h-64 border-40 border-[#5a4138] rounded-full translate-x-1/2 translate-y-1/2" />
      </div>

      <style>{`
        .text-404-glitch {
          text-shadow: 2px 0 #ec5b13, -2px 0 #334155;
        }
      `}</style>
    </div>
  );
}
