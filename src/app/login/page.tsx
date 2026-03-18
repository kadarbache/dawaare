"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Eye, EyeOff, Store } from "lucide-react";

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  return (
    <div className="font-display bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100 min-h-screen flex items-center justify-center p-0 m-0">
      <div className="flex flex-col md:flex-row w-full min-h-screen">
        {/* Left Artistic Panel */}
        <div className="hidden md:flex md:w-1/2 neon-gradient-bg relative flex-col items-center justify-center p-12 text-center overflow-hidden">
          {/* Decorative flowing curves (CSS based) */}
          <div className="neon-curve w-[600px] h-[600px] -top-20 -left-20 bg-purple-600/20"></div>
          <div className="neon-curve w-[500px] h-[500px] -bottom-20 -right-20 bg-blue-600/20"></div>
          <div className="neon-curve w-[300px] h-[300px] top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-primary/10"></div>

          <div className="relative z-10 max-w-lg">
            <h1 className="text-5xl lg:text-7xl font-bold text-white mb-6 leading-tight tracking-tight">
              Elevate Your Workflow
            </h1>
            <p className="text-slate-300 text-lg lg:text-xl font-light">
              Achieve more with focused effort and dedication.
            </p>
          </div>

          {/* Abstract Background Image Reference */}
          <div
            className="absolute inset-0 opacity-30 mix-blend-overlay pointer-events-none bg-cover bg-center"
            title="Abstract vibrant flowing neon purple and blue curves on dark background"
            style={{
              backgroundImage:
                "url('https://lh3.googleusercontent.com/aida-public/AB6AXuABGw4Gsyqz0_dU0slUhU5FhJl1kb_xqvHtp_FimX8koVaM6-jfCiSiKzEYcZpT2eiBjupEGsZMGvQIHsaJEN6XrTeWAHBV1Od2ksEwmtMt17pST4Vd0RoajFQq4VV7_ckIumktsnFRGKj_bffqBk1bxADI115OmlJIiqUl2N9QBXfq2sUYWzhm7xHapxMsKlueuCpicuVvtvdL4x2XqIOvikkBsNOwdP0oK8ZZlE_NmUtAYx6amIHJ3yk2o-LfJrCUUNAAXvAOr5U')",
            }}
          ></div>
        </div>

        {/* Right Login Section */}
        <div className="w-full md:w-1/2 flex flex-col justify-center items-center bg-white dark:bg-background-dark px-8 py-12 lg:px-24">
          <div className="w-full max-w-md">
            {/* Logo */}
            <div className="flex items-center gap-2 mb-12">
              <div className="size-8 text-primary">
                <Store size={32} />
              </div>
              <span className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">
                Dawaare
              </span>
            </div>

            {/* Welcome Text */}
            <div className="mb-10">
              <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
                Welcome Back
              </h2>
              <p className="text-slate-500 dark:text-slate-400">
                Please enter your details to sign in.
              </p>
            </div>

            {/* Form */}
            <form className="space-y-6">
              <div className="space-y-2">
                <div>
                  <label
                    className="text-sm font-semibold text-slate-700 dark:text-slate-300"
                    htmlFor="email"
                  >
                    Email
                  </label>
                </div>
                <input
                  className="w-full px-4 py-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/50 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent transition-all outline-none"
                  id="email"
                  placeholder="Enter your email"
                  type="email"
                />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label
                    className="text-sm font-semibold text-slate-700 dark:text-slate-300"
                    htmlFor="password"
                  >
                    Password
                  </label>
                  <Link
                    className="text-sm font-medium text-primary hover:underline"
                    href="#"
                  >
                    Forgot Password?
                  </Link>
                </div>
                <div className="relative">
                  <input
                    className="w-full px-4 py-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/50 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent transition-all outline-none"
                    id="password"
                    placeholder="Enter your password"
                    type={showPassword ? "text" : "password"}
                  />
                  <button
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <Eye className="w-5 h-5" />
                    ) : (
                      <EyeOff className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>

              <button
                className="w-full bg-slate-900 dark:bg-primary text-white font-bold py-3.5 rounded-lg hover:bg-slate-800 dark:hover:bg-primary/90 transition-colors shadow-lg cursor-pointer"
                type="submit"
              >
                Sign In
              </button>

              <div className="relative flex items-center py-2">
                <div className="grow border-t border-slate-200 dark:border-slate-700"></div>
                <span className="shrink mx-4 text-slate-400 text-sm">OR</span>
                <div className="grow border-t border-slate-200 dark:border-slate-700"></div>
              </div>

              <button
                className="w-full flex items-center justify-center gap-3 bg-white dark:bg-transparent border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 font-semibold py-3.5 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors shadow-sm cursor-pointer"
                type="button"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    fill="#4285F4"
                  ></path>
                  <path
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    fill="#34A853"
                  ></path>
                  <path
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
                    fill="#FBBC05"
                  ></path>
                  <path
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.66l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 12-4.53z"
                    fill="#EA4335"
                  ></path>
                </svg>
                Sign In with Google
              </button>
            </form>

            {/* Footer Link */}
          </div>
        </div>
      </div>
    </div>
  );
}
