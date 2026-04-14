import Link from "next/link";
import React from "react";

/**
 * EmailVerfication Component
 *
 * Big Picture:
 * This component renders a premium, transactional email UI for email verification.
 * It's designed to be visually engaging (using "Cinder Obsidian" aesthetics)
 * to encourage users to confirm their email address.
 *
 * Architectural Why:
 * We use a structured, card-based layout with a distinct header, body, and footer.
 * This separation ensures clarity and focus on the primary call-to-action (CTA).
 * Consistent spacing and typography (Inter) are used to maintain a premium feel.
 */

export default function EmailVerfication({ url }: { url: string }) {
  return (
    <div className="min-h-screen flex items-center justify-center p-6 md:p-12 bg-[#C8D3C8]">
      <main className="w-full max-w-xl">
        {/* Main Email Container */}
        <div className="bg-white rounded-md overflow-hidden shadow-[0_0_15px_rgba(236,91,19,0.1)]">
          {/* Header Section */}
          <header className="bg-[#F8F9F8] py-8 px-6 flex flex-col items-center">
            {/* Brand Logo - Updated to Dawaare branding */}
            <div className="bg-[#33A853] px-4 py-1 rounded-sm mb-10">
              <span className="text-white font-black text-xs tracking-widest uppercase">
                Dawaare
              </span>
            </div>

            {/* Illustrated Graphic Container */}
            <div className="relative w-48 h-40 flex items-center justify-center">
              {/* Shield Icon */}
              <div className="absolute left-0 top-1/2 -translate-y-1/2 z-20 bg-[#33A853] text-white p-2 rounded-md shadow-lg">
                <span
                  className="material-symbols-outlined text-3xl"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  verified_user
                </span>
              </div>

              {/* Envelope Illustration Mockup using CSS */}
              <div className="w-32 h-24 bg-[#33A853]/10 border-2 border-[#33A853] rounded-md relative overflow-hidden flex items-end justify-center">
                {/* Blank Document */}
                <div className="absolute bottom-4 w-20 h-28 bg-white border border-stone-200 shadow-sm transform -translate-y-2">
                  <div className="mt-4 mx-2 space-y-2">
                    <div className="h-1 bg-stone-100 w-full"></div>
                    <div className="h-1 bg-stone-100 w-3/4"></div>
                    <div className="h-1 bg-stone-100 w-5/6"></div>
                  </div>
                </div>
                {/* Envelope Flap */}
                <div className="absolute bottom-0 w-full h-12 bg-[#33A853] opacity-20"></div>
              </div>

              {/* Decorative Background Element for Illustration Depth */}
              <div className="absolute inset-0 bg-linear-to-tr from-[#33A853]/5 to-transparent rounded-full -z-10 blur-2xl"></div>
            </div>
          </header>

          {/* Body Section */}
          <section className="bg-white px-8 py-12 text-center">
            <h1 className="text-3xl font-black text-stone-900 mb-4 tracking-tight">
              Verify Your Email
            </h1>
            <p className="text-stone-500 text-base mb-10 font-medium">
              Please click the button below to confirm your email
            </p>

            {/* Primary CTA Button */}
            <div className="flex justify-center mb-10">
              <Link href={url}>
                <button className="bg-[#33A853] hover:bg-[#2d9449] text-white px-10 py-4 rounded-md font-bold text-lg shadow-lg shadow-[#33A853]/20 transition-all active:scale-95 cursor-pointer">
                  Confirm your email
                </button>
              </Link>
            </div>

            <p className="text-stone-400 text-sm italic max-w-xs mx-auto">
              If you did not request, no worries — simply ignore this message.
            </p>
          </section>
        </div>

        {/* System Context Footer */}
        <div className="mt-8 text-center">
          <p className="text-background-dark/60 text-[10px] uppercase tracking-widest font-bold">
            Sent by Sa&#39;id Dawaare
          </p>
        </div>
      </main>

      {/* Background Decoration */}
      <div className="fixed top-0 left-0 w-full h-1 bg-[#33A853]"></div>
      <div className="fixed bottom-0 left-0 w-full h-1 bg-[#33A853]"></div>
    </div>
  );
}
